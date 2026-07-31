import mongoose, { Schema, model } from "mongoose";

const SpotCommentLikeSchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "SpotComment",
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

SpotCommentLikeSchema.index(
  {
    comment: 1,
    user: 1,
    userModel: 1,
  },
  {
    unique: true,
  }
);

SpotCommentLikeSchema.index({
  comment: 1,
});

SpotCommentLikeSchema.index({
  user: 1,
  userModel: 1,
});

export const SpotCommentLike = model(
  "SpotCommentLike",
  SpotCommentLikeSchema
);