import mongoose, { Schema, model } from "mongoose";

const PostCommentReplySchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "PostComment",
      required: true,
      index: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      refPath: "authorModel",
      required: true,
    },

    authorModel: {
      type: String,
      enum: ["User", "SpotOwner"],
      required: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    replyLikeCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

PostCommentReplySchema.index({
    comment: 1,
    createdAt: -1,
});

export const PostCommentReply = model(
    "PostCommentReply",
    PostCommentReplySchema
);