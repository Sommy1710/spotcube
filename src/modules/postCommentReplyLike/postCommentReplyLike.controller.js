import { PostCommentReply } from "../postCommentReply/postCommentReply.schema.js";
import { PostCommentReplyLike } from "./postCommentReplyLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import { createNotification } from "../notifications/notification.service.js";
import {
  NotFoundError,
  UnauthenticatedError,
} from "../../lib/error-definitions.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";

export const toggleLikePostCommentReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  // ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  // determine who is liking the reply
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

  // find the reply
  const reply = await PostCommentReply.findById(replyId);

  if (!reply) {
    throw new NotFoundError("Reply not found.");
  }

  // check if already liked
  const existingLike = await PostCommentReplyLike.findOne({
    reply: reply._id,
    user: accountId,
    userModel: accountModel,
  });

  // =========================
  // UNLIKE
  // =========================
  if (existingLike) {
    await PostCommentReplyLike.deleteOne({ _id: existingLike._id });

    reply.replyLikeCount = Math.max(reply.replyLikeCount - 1, 0);
    await reply.save();

    return res.status(200).json({
      success: true,
      message: "Reply unliked successfully.",
      liked: false,
      likeCount: reply.replyLikeCount,
    });
  }

  // =========================
  // LIKE
  // =========================
  await PostCommentReplyLike.create({
    reply: reply._id,
    user: accountId,
    userModel: accountModel,
  });

  reply.replyLikeCount += 1;
  await reply.save();

  // ==========================================
  // DON'T NOTIFY SOMEONE ABOUT THEIR OWN LIKE
  // ==========================================
  // Reply authors can be a User or a SpotOwner, so compare id and model
  const isOwnReply =
    reply.author.toString() === accountId.toString() &&
    reply.authorModel === accountModel;

  if (!isOwnReply) {
    // get the name of the person who liked the reply
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
      recipient: reply.author,
      recipientModel: reply.authorModel,

      sender: accountId,
      senderModel: accountModel,

      type: "REPLY_LIKED",

      // points at the post so the frontend can open it
      entityId: reply.post,
      entityModel: "Post",

      message: `${likerName} liked your reply.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Reply liked successfully.",
    liked: true,
    likeCount: reply.replyLikeCount,
  });
});