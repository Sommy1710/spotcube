import mongoose from "mongoose";
import {Post} from "../post/post.schema.js";
import {PostView} from "./postView.schema.js";

export const recordPostView = async (req, postId) => {
  // Identify a logged-in user or spot owner.
  let viewerKey;

  if (req.user?.id || req.user?._id) {
    viewerKey = `User:${req.user.id ?? req.user._id}`;
  } else if (req.spotOwner?.id || req.spotOwner?._id) {
    viewerKey =
      `SpotOwner:${
        req.spotOwner.id ?? req.spotOwner._id
      }`;
  } else {
    // For anonymous visitors, the frontend supplies a stable ID.
    const visitorId = req.get("x-visitor-id");

    if (visitorId && visitorId.length <= 100) {
      viewerKey = `Anonymous:${visitorId}`;
    } else {
      // Do not count unidentified visitors.
      return {
        counted: false,
        reason: "No viewer identity provided",
      };
    }
  }

  if (!mongoose.isValidObjectId(postId)) {
    return null;
  }

  // First check whether the post exists.
  const postExists = await Post.exists({ _id: postId });

  if (!postExists) {
    return null;
  }

  try {
    // The unique index prevents duplicate view records.
    await PostView.create({
      post: postId,
      viewerKey,
    });

    // Only a newly recorded view increments the counter.
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    return {
      counted: true,
      views: post.views,
    };
  } catch (error) {
    if (error.code === 11000) {
      // This viewer has already viewed this post.
      const post = await Post.findById(postId).select("views");

      return {
        counted: false,
        views: post?.views ?? 0,
      };
    }

    throw error;
  }
};