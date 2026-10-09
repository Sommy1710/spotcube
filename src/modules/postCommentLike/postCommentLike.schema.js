import mongoose, { Schema, model } from "mongoose";

const PostCommentLikeSchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "PostComment",
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

PostCommentLikeSchema.index(
  {
    comment: 1,
    user: 1,
    userModel: 1,
  },
  {
    unique: true,
  }
);

PostCommentLikeSchema.index({
  comment: 1,
});

PostCommentLikeSchema.index({
  user: 1,
  userModel: 1,
});

export const PostCommentLike = model(
  "PostCommentLike",
  PostCommentLikeSchema
);