import axios from "axios";
import { asyncHandler } from "../../lib/util.js";
import {UnauthenticatedError, UnauthorizedError, ValidationError, NotFoundError} from "../../lib/error-definitions.js";
import { Validator } from "../../lib/validator.js";
import {Post, PostLike} from "./post.schema.js";
import { createPostRequest, updatePostRequest } from "./post.request.js";
import {v2 as cloudinary} from 'cloudinary';
import { User } from "../auth/user.schema.js";
import { createNotification } from "../notifications/notification.service.js";
import {SpotOwner} from "../spotOwner/spotOwner.schema.js";


export const createPost = asyncHandler(async (req, res) => {

  // ============================================================
  // 1. CHECK AUTHENTICATION
  // ============================================================

  if (!req.user || !req.user.id) {
    throw new UnauthenticatedError(
      "user not authenticated"
    );
  }


  // ============================================================
  // 2. GET UPLOADED FILES
  // ============================================================

  const imageFiles = req.files?.photos || [];
  const videoFiles = req.files?.videos || [];


  // ============================================================
  // 3. AT LEAST ONE PHOTO OR VIDEO IS REQUIRED
  // ============================================================

  if (
    imageFiles.length === 0 &&
    videoFiles.length === 0
  ) {
    throw new ValidationError(
      "At least one photo or video is required."
    );
  }


  // ============================================================
  // 4. MAXIMUM 10 PHOTOS
  // ============================================================

  if (imageFiles.length > 10) {
    throw new ValidationError(
      "You can upload a maximum of 10 photos per post."
    );
  }


  // ============================================================
  // 5. MAXIMUM 1 VIDEO
  // ============================================================

  if (videoFiles.length > 1) {
    throw new ValidationError(
      "You can upload a maximum of 1 video per post."
    );
  }


  // ============================================================
  // 6. JOI VALIDATION
  // ============================================================

  const validator = new Validator();

  const { errors, value } = validator.validate(
    createPostRequest,
    req.body
  );

  if (errors) {
    throw new ValidationError(
      "The request failed with the following errors.",
      errors
    );
  }


  // ============================================================
  // 7. FIND THE AUTHENTICATED USER
  // ============================================================

  const user = await User.findById(req.user.id)
    .select("username");

  if (!user) {
    throw new UnauthenticatedError(
      "Authenticated user account could not be found."
    );
  }


  // ============================================================
  // 8. UPLOAD PHOTOS TO CLOUDINARY
  // ============================================================

  const photoUrls = await Promise.all(
    imageFiles.map(
      (file) =>
        new Promise((resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
              },
              (error, result) => {

                if (error) {
                  return reject(error);
                }

                resolve(result.secure_url);
              }
            )
            .end(file.buffer);

        })
    )
  );


  // ============================================================
  // 9. UPLOAD VIDEO TO CLOUDINARY
  // ============================================================

  const videoUrls = await Promise.all(
    videoFiles.map(
      (file) =>
        new Promise((resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "video",
              },
              async (error, result) => {

                if (error) {
                  return reject(error);
                }


                // ==================================================
                // VIDEO MUST BE 60 SECONDS OR LESS
                // ==================================================

                if (
                  result.duration &&
                  result.duration > 60
                ) {

                  try {

                    await cloudinary.uploader.destroy(
                      result.public_id,
                      {
                        resource_type: "video",
                      }
                    );

                  } catch (deleteError) {

                    console.error(
                      "Failed to delete invalid video from Cloudinary:",
                      deleteError.message
                    );

                  }

                  return reject(
                    new ValidationError(
                      "Video must be 60 seconds or less."
                    )
                  );
                }


                resolve(result.secure_url);
              }
            )
            .end(file.buffer);

        })
    )
  );


  // ============================================================
  // 10. BUILD POST DATA
  // ============================================================

  const postPayload = {
    ...value,

    author: req.user.id,

    username: user.username,

    photos: photoUrls,

    videos: videoUrls,
  };


  // ============================================================
  // 11. CREATE POST
  // ============================================================

  const post = await Post.create(
    postPayload
  );


  // ============================================================
  // 12. RESPONSE
  // ============================================================

  res.status(201).json({
    success: true,

    message: "Post created successfully.",

    data: {
      post,
    },
  });

});

export const extractCloudinaryPublicId = (url) => {
  try {
    const parts = url.split("/upload/");

    if (parts.length !== 2) {
      return null;
    }

    let publicId = parts[1];

    // Remove version
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    return publicId;

  } catch (error) {
    return null;
  }
};

export const deletePost = asyncHandler(async (req, res) => {

  // ============================================================
  // 1. CHECK AUTHENTICATION
  // ============================================================

  if (!req.user || !req.user.id) {
    throw new UnauthenticatedError(
      "user not authenticated"
    );
  }


  // ============================================================
  // 2. GET POST ID
  // ============================================================

  const { postId } = req.params;

  if (!postId) {
    throw new ValidationError(
      "Post ID is required."
    );
  }


  // ============================================================
  // 3. FIND THE POST
  // ============================================================

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError(
      "Post not found."
    );
  }


  // ============================================================
  // 4. CHECK POST OWNERSHIP
  // ============================================================

  if (post.author.toString() !== req.user.id.toString()) {
    throw new UnauthorizedError(
      "You are not authorized to delete this post."
    );
  }


  // ============================================================
  // 5. DELETE PHOTOS FROM CLOUDINARY
  // ============================================================

  for (const photoUrl of post.photos || []) {

    try {

      const publicId = extractCloudinaryPublicId(
        photoUrl
      );

      if (publicId) {
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
          }
        );
      }

    } catch (error) {

      console.error(
        "Failed to delete photo from Cloudinary:",
        error.message
      );

    }
  }


  // ============================================================
  // 6. DELETE VIDEOS FROM CLOUDINARY
  // ============================================================

  for (const videoUrl of post.videos || []) {

    try {

      const publicId = extractCloudinaryPublicId(
        videoUrl
      );

      if (publicId) {
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "video",
          }
        );
      }

    } catch (error) {

      console.error(
        "Failed to delete video from Cloudinary:",
        error.message
      );

    }
  }


  // ============================================================
  // 7. DELETE POST FROM DATABASE
  // ============================================================

  await Post.findByIdAndDelete(postId);


  // ============================================================
  // 8. RESPONSE
  // ============================================================

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });

});

export const updatePost = asyncHandler(async (req, res) => {

  if (!req.user || !req.user.id) {
    throw new UnauthenticatedError(
      "user not authenticated"
    );
  }

  const { postId } = req.params;

  if (!postId) {
    throw new ValidationError(
      "Post ID is required."
    );
  }

  const validator = new Validator();

  const { errors, value } = validator.validate(
    updatePostRequest,
    req.body
  );

  if (errors) {
    throw new ValidationError(
      "The request failed with the following errors.",
      errors
    );
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError(
      "Post not found."
    );
  }

  if (
    post.author.toString() !==
    req.user.id.toString()
  ) {
    throw new UnauthorizedError(
      "You are not authorized to update this post."
    );
  }

  post.caption = value.caption;

  await post.save();

  return res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    data: {
      post,
    },
  });

});

export const toggleLikePost = asyncHandler(async (req, res) => {
  const { postId: id } = req.params;

  // ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required");
  }

  // determine who is liking
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

  // find the post
  const post = await Post.findById(id);

  if (!post) {
    throw new NotFoundError("post not found");
  }

  // check if already liked
  const existingLike = await PostLike.findOne({
    post: id,
    user: accountId,
    userModel: accountModel,
  });

  // =========================
  // UNLIKE
  // =========================
  if (existingLike) {
    await PostLike.deleteOne({ _id: existingLike._id });

    post.likeCount = Math.max(post.likeCount - 1, 0);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "post unliked successfully",
      liked: false,
      likeCount: post.likeCount,
    });
  }

  // =========================
  // LIKE
  // =========================
  await PostLike.create({
    post: id,
    user: accountId,
    userModel: accountModel,
  });

  post.likeCount += 1;
  await post.save();

  // ==========================================
  // DON'T NOTIFY SOMEONE ABOUT THEIR OWN LIKE
  // ==========================================
  // Post.author always refers to a User (see Post schema)
  const recipientModel = "User";

  const isOwnPost =
    post.author.toString() === accountId.toString() &&
    accountModel === "User";

  if (!isOwnPost) {
    // get the name of the person who liked the post
    let account;

    if (accountModel === "User") {
      account = await User.findById(accountId).select("username");
    } else {
      account = await SpotOwner.findById(accountId).select(
        "username firstname lastname"
      );
    }

    let likerName = "Someone";

    if (accountModel === "User") {
      likerName = account?.username || "Someone";
    } else {
      likerName =
        `${account?.firstname || ""} ${account?.lastname || ""}`.trim() ||
        account?.username ||
        "Someone";
    }

    await createNotification({
      recipient: post.author,
      recipientModel,

      sender: accountId,
      senderModel: accountModel,

      type: "POST_LIKED",

      entityId: post._id,
      entityModel: "Post",

      message: `${likerName} liked your post.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: "post liked successfully",
    liked: true,
    likeCount: post.likeCount,
  });
});