import mongoose, { model, Schema } from "mongoose";

const PostViewSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Identifies the viewer, whether logged in or anonymous.
    viewerKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// The same viewer can count only once per post.
PostViewSchema.index(
  { post: 1, viewerKey: 1 },
  { unique: true }
);

export const PostView = model("PostView", PostViewSchema);