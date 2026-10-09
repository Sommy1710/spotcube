import {PostComment} from "../postComment/postComment.schema.js";
import { PostCommentLike } from "./postCommentLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import { createNotification } from "../notifications/notification.service.js";
import {
  NotFoundError,
  UnauthenticatedError,
} from "../../lib/error-definitions.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";

export const toggleLikePostComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  // determine who is liking the comment
  let accountId;
  let accountModel;

  if (req.user?.role === "spotOwner") {
    accountId = req.user.id;
    accountModel = "SpotOwner";
  } else if (req.user) {
    accountId = req.user.id;
    accountModel = "User";
  } else {
    accountId = req.spotOwner.id;
    accountModel = "SpotOwner";
  }

  // find the comment
  const comment = await PostComment.findById(commentId);

  if (!comment) {
    throw new NotFoundError("Comment not found.");
  }

  // check if already liked
  const existingLike = await PostCommentLike.findOne({
    comment: comment._id,
    user: accountId,
    userModel: accountModel,
  });

  // =========================
  // UNLIKE
  // =========================
  if (existingLike) {
    await PostCommentLike.deleteOne({ _id: existingLike._id });

    comment.commentLikeCount = Math.max(comment.commentLikeCount - 1, 0);
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment unliked successfully.",
      liked: false,
      likeCount: comment.commentLikeCount,
    });
  }

  // =========================
  // LIKE
  // =========================
  await PostCommentLike.create({
    comment: comment._id,
    user: accountId,
    userModel: accountModel,
  });

  comment.commentLikeCount += 1;
  await comment.save();

  // ==========================================
  // DON'T NOTIFY SOMEONE ABOUT THEIR OWN LIKE
  // ==========================================
  // Comment authors can be a User or a SpotOwner, so compare id and model
  const isOwnComment =
    comment.author.toString() === accountId.toString() &&
    comment.authorModel === accountModel;

  if (!isOwnComment) {
    // get the name of the person who liked the comment
    let account;

    if (accountModel === "User") {
      account = await User.findById(accountId).select("username");
    } else {
      account = await SpotOwner.findById(accountId).select(
        "username firstname lastname"
      );
    }

    let likerName = "Someone";

    if (accountModel === "User") {
      likerName = account?.username || "Someone";
    } else {
      likerName =
        `${account?.firstname || ""} ${account?.lastname || ""}`.trim() ||
        account?.username ||
        "Someone";
    }

    await createNotification({
      recipient: comment.author,
      recipientModel: comment.authorModel,

      sender: accountId,
      senderModel: accountModel,

      type: "COMMENT_LIKED",

      // points at the post so the frontend can open it
      entityId: comment.post,
      entityModel: "Post",

      message: `${likerName} liked your comment.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Comment liked successfully.",
    liked: true,
    likeCount: comment.commentLikeCount,
  });
});