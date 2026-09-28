import mongoose, { model, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      maxlength: 2200,
      default: "",
    },

    photos: {
      type: [String],
      default: [],
    },

    videos: {
      type: [String],
      default: [],
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


// Search posts by caption
PostSchema.index({
  caption: "text",
});


// Find posts belonging to a specific user
PostSchema.index({
  author: 1,
  createdAt: -1,
});


// FYP/feed ordering
PostSchema.index({
  createdAt: -1,
});


export const Post = model("Post", PostSchema);