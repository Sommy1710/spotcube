import mongoose, { Schema, model } from "mongoose";

const SpotCommentReplySchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "SpotComment",
      required: true,
      index: true,
    },

    spotPost: {
      type: Schema.Types.ObjectId,
      ref: "SpotPost",
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

SpotCommentReplySchema.index({
    comment: 1,
    createdAt: -1,
});

export const SpotCommentReply = model(
    "SpotCommentReply",
    SpotCommentReplySchema
);