import { PostComment } from "../postComment/postComment.schema.js";
import { PostCommentReply } from "./postCommentReply.schema.js";
import { createPostCommentReplyRequest } from "./create-postCommentReply.request.js";
import { asyncHandler } from "../../lib/util.js";
import { createNotification } from "../notifications/notification.service.js";
import {
  NotFoundError,
  UnauthenticatedError,
} from "../../lib/error-definitions.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";

export const createPostCommentReply = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // validate the body with your Joi schema
  const { error, value } = createPostCommentReplyRequest.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const { reply } = value; // trimmed by Joi

  // ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  // determine who is replying
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

  // find the comment being replied to
  const comment = await PostComment.findById(commentId);

  if (!comment) {
    throw new NotFoundError("Comment not found.");
  }

  // get the replier's details
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

  // create the reply
  const newReply = await PostCommentReply.create({
    comment: comment._id,
    post: comment.post,
    author: accountId,
    authorModel: accountModel,
    username: account.username,
    reply,
  });

  // increment the reply count atomically
  await PostComment.findByIdAndUpdate(comment._id, {
    $inc: { replyCount: 1 },
  });

  // don't notify someone about their own reply
  const isOwnComment =
    comment.author.toString() === accountId.toString() &&
    comment.authorModel === accountModel;

  if (!isOwnComment) {
    let replierName;

    if (accountModel === "User") {
      replierName = account.username || "Someone";
    } else {
      replierName =
        `${account.firstname || ""} ${account.lastname || ""}`.trim() ||
        account.username ||
        "Someone";
    }

    await createNotification({
      recipient: comment.author,
      recipientModel: comment.authorModel,

      sender: accountId,
      senderModel: accountModel,

      type: "COMMENT_REPLIED",

      entityId: comment.post,
      entityModel: "Post",

      message: `${replierName} replied to your comment.`,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Reply created successfully.",
    reply: newReply,
  });
});