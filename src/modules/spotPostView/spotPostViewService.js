import mongoose from "mongoose";
import {SpotPost} from "../spotPost/spotPost.schema.js";
import {SpotPostView} from "./spotPostView.schema.js";

export const recordSpotPostView = async (req, spotPostId) => {
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

  if (!mongoose.isValidObjectId(spotPostId)) {
    return null;
  }

  // First check whether the spot post exists.
  const spotPostExists = await SpotPost.exists({ _id: spotPostId });

  if (!spotPostExists) {
    return null;
  }

  try {
    // The unique index prevents duplicate view records.
    await SpotPostView.create({
      spotPost: spotPostId,
      viewerKey,
    });

    // Only a newly recorded view increments the counter.
    const spotPost = await SpotPost.findByIdAndUpdate(
      spotPostId,
      { $inc: { views: 1 } },
      { new: true }
    );

    return {
      counted: true,
      views: spotPost.views,
    };
  } catch (error) {
    if (error.code === 11000) {
      // This viewer has already viewed this spot post.
      const spotPost = await SpotPost.findById(spotPostId).select("views");

      return {
        counted: false,
        views: spotPost?.views ?? 0,
      };
    }

    throw error;
  }
};