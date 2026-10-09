import mongoose, { Schema, model } from "mongoose";

const PostCommentReplyLikeSchema = new Schema(
  {
    reply: {
      type: Schema.Types.ObjectId,
      ref: "PostCommentReply",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      refPath: "userModel",
      required: true,
    },

    userModel: {
      type: String,
      enum: ["User", "SpotOwner"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PostCommentReplyLikeSchema.index(
  {
    reply: 1,
    user: 1,
    userModel: 1,
  },
  {
    unique: true,
  }
);

PostCommentReplyLikeSchema.index({
  reply: 1,
});

PostCommentReplyLikeSchema.index({
  user: 1,
  userModel: 1,
});

export const PostCommentReplyLike = model(
  "PostCommentReplyLike",
  PostCommentReplyLikeSchema
);