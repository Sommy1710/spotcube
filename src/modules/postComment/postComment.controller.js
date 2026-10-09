import {PostComment} from "./postComment.schema.js";
import {Post} from "../post/post.schema.js";
import { asyncHandler } from "../../lib/util.js";
import {createNotification} from "../notifications/notification.service.js";
import {NotFoundError, UnauthenticatedError,} from "../../lib/error-definitions.js";
import {User} from "../auth/user.schema.js";
import {SpotOwner} from "../spotOwner/spotOwner.schema.js";

export const createPostComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  // ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  // determine who is commenting
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

  // find the post
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError("Post not found.");
  }

  // get the commenter's details (needed for username and notification text)
  let account;

  if (accountModel === "User") {
    account = await User.findById(accountId).select("username");
  } else {
    account = await SpotOwner.findById(accountId).select(
      "username firstname lastname"
    );
  }

  if (!account) {
    throw new NotFoundError("Account not found.");
  }

  // create the comment
  const newComment = await PostComment.create({
    post: post._id,
    author: accountId,
    authorModel: accountModel,
    username: account.username,
    comment,
  });

  // increment the comment count atomically
  await Post.findByIdAndUpdate(post._id, { $inc: { commentCount: 1 } });

  // ==========================================
  // DON'T NOTIFY SOMEONE ABOUT THEIR OWN COMMENT
  // ==========================================
  // Post.author always refers to a User (see Post schema)
  const isOwnPost =
    post.author.toString() === accountId.toString() &&
    accountModel === "User";

  if (!isOwnPost) {
    let commenterName;

    if (accountModel === "User") {
      commenterName = account.username || "Someone";
    } else {
      commenterName =
        `${account.firstname || ""} ${account.lastname || ""}`.trim() ||
        account.username ||
        "Someone";
    }

    await createNotification({
      recipient: post.author,
      recipientModel: "User",

      sender: accountId,
      senderModel: accountModel,

      type: "COMMENTED_ON_POST",

      entityId: post._id,
      entityModel: "Post",

      message: `${commenterName} commented on your post.`,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Comment created successfully.",
    comment: newComment,
  });
});