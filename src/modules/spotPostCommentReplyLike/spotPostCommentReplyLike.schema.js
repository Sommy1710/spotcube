import mongoose, { Schema, model } from "mongoose";

const SpotCommentReplyLikeSchema = new Schema(
  {
    reply: {
      type: Schema.Types.ObjectId,
      ref: "SpotCommentReply",
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

SpotCommentReplyLikeSchema.index(
  {
    reply: 1,
    user: 1,
    userModel: 1,
  },
  {
    unique: true,
  }
);

SpotCommentReplyLikeSchema.index({
  reply: 1,
});

SpotCommentReplyLikeSchema.index({
  user: 1,
  userModel: 1,
});

export const SpotCommentReplyLike = model(
  "SpotCommentReplyLike",
  SpotCommentReplyLikeSchema
);