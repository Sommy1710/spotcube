import { asyncHandler } from "../../lib/util.js";
import { UnauthenticatedError, NotFoundError } from "../../lib/error-definitions.js";
import {SpotPost} from "../spotPost/spotPost.schema.js";
import { SpotFavourite } from "./favourite.schema.js";

export const toggleFavouriteSpotPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  let accountId;
  let accountModel;

  if (req.user?.role === "spotOwner") {
    accountId = req.user.id;
    accountModel = "SpotOwner";
  } else if (req.user) {
    accountId = req.user.id;
    accountModel = "User";
  } else {
    accountId = req.spotOwner.id;
    accountModel = "SpotOwner";
  }

  const spotPost = await SpotPost.findById(id);

  if (!spotPost) {
    throw new NotFoundError("Spot post not found.");
  }

  const existingFavourite = await SpotFavourite.findOne({
    user: accountId,
    userModel: accountModel,
    spotPost: id,
  });

  if (existingFavourite) {
    await SpotFavourite.deleteOne({
      _id: existingFavourite._id,
    });

    return res.status(200).json({
      success: true,
      message: "Spot post removed from favourites.",
      favourited: false,
    });
  }

  await SpotFavourite.create({
    user: accountId,
    userModel: accountModel,
    spotPost: id,
  });

  return res.status(200).json({
    success: true,
    message: "Spot post added to favourites.",
    favourited: true,
  });
});



export const fetchFavouriteSpotPosts = asyncHandler(async (req, res) => {
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required.");
  }

  let accountId;
  let accountModel;

  if (req.user?.role === "spotOwner") {
    accountId = req.user.id;
    accountModel = "SpotOwner";
  } else if (req.user) {
    accountId = req.user.id;
    accountModel = "User";
  } else {
    accountId = req.spotOwner.id;
    accountModel = "SpotOwner";
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [favourites, total] = await Promise.all([
    SpotFavourite.find({
      user: accountId,
      userModel: accountModel,
    })
      .populate({
        path: "spotPost",
        select: `
          username
          caption
          photos
          videos
          location
          geoLocation
          likeCount
          commentCount
          views
          createdAt
        `,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    SpotFavourite.countDocuments({
      user: accountId,
      userModel: accountModel,
    }),
  ]);

  const favouritePosts = favourites
    .filter((item) => item.spotPost)
    .map((item) => ({
      favouriteId: item._id,
      savedAt: item.createdAt,

      post: {
        _id: item.spotPost._id,
        username: item.spotPost.username,
        caption: item.spotPost.caption,
        photos: item.spotPost.photos,
        videos: item.spotPost.videos,
        location: item.spotPost.location,
        geoLocation: item.spotPost.geoLocation,
        likeCount: item.spotPost.likeCount,
        commentCount: item.spotPost.commentCount,
        views: item.spotPost.views,
        createdAt: item.spotPost.createdAt,
      },
    }));

  return res.status(200).json({
    success: true,
    message: "Favourite spot posts retrieved successfully.",
    data: {
      favourites: favouritePosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    },
  });
});