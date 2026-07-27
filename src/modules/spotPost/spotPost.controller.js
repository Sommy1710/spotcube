import * as spotPostService from './spotPost.service.js';
import {asyncHandler} from '../../lib/util.js';
import {Validator} from '../../lib/validator.js';
import { createSpotPostRequest, updateSpotPostRequest } from './create-spotPost.request.js';
import {ValidationError} from '../../lib/error-definitions.js';
import { SpotLike, SpotPost } from './spotPost.schema.js';
import {v2 as cloudinary} from 'cloudinary';
import { NotFoundError, UnauthenticatedError, UnauthorizedError } from '../../lib/error-definitions.js';
//import { createNotification } from "../notifications/notification.service.js";
import {User} from "../auth/user.schema.js"
import { SpotOwner } from '../spotOwner/spotOwner.schema.js';
import axios from "axios"; // for geocoding API calls

export const createNewSpotPost = asyncHandler(async (req, res) => {
  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("spot owner not authenticated");
  }

  const imageFiles = req.files?.photos || [];
  const videoFiles = req.files?.videos || [];

  if (imageFiles.length === 0) {
    throw new ValidationError("At least one photo must be uploaded.");
  }

  //Upload images
  const photoUrls = await Promise.all(
    imageFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            })
            .end(file.buffer);
        })
    )
  );

  //Upload videos
  const videoUrls = await Promise.all(
    videoFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "video" }, async (error, result) => {
              if (error) return reject(error);

              if (result.duration && result.duration > 60) {
                await cloudinary.uploader.destroy(result.public_id, {
                  resource_type: "video",
                });
                return reject(new Error("Each video must be 60 seconds or less."));
              }

              resolve(result.secure_url);
            })
            .end(file.buffer);
        })
    )
  );

  //Joi validation
  const validator = new Validator();
  const { errors, value } = validator.validate(createSpotPostRequest, req.body);

  if (errors) {
    throw new ValidationError("The request failed with the following errors.", errors);
  }

  //Geocode location string → coordinates
  let geoLocation = null;
  let geoMessage = "Geolocation found successfully.";
  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: value.location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "Hometrace/1.0 (hometrace2@gmail.com)"
      }
    });

    if (geoRes.data && geoRes.data.length > 0) {
      const { lon, lat } = geoRes.data[0];
      geoLocation = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      geoMessage = "Geolocation not found, listing created without coordinates.";
    }
  } catch (err) {
    console.error("Geocoding error:", err.message);
    geoMessage = "Failed to fetch geolocation, geolocation created without coordinates.";
  }

  //Build payload
  const spotPostPayload = {
    ...value,
    author: req.spotOwner.id,
    username: req.spotOwner.username,
    photos: photoUrls,
    videos: videoUrls,
    geoLocation, // may be null
  };

  //Save spot post

  const spotPost = await spotPostService.createSpotPost(spotPostPayload);

res.status(201).json({
    success: true,
    message: "New spot post created successfully",
    data: {
        spotPost
    },
    geoMessage
});
});

export const fetchAllSpotPosts = asyncHandler(async (req, res) => {
  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("Not authenticated");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filters = {
    author: req.spotOwner.id 
  };

  
  if (req.query.status) {
    filters.status = req.query.status;
  }

  
  const [spotPosts, total] = await Promise.all([
    SpotPost.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    SpotPost.countDocuments(filters)
  ]);

  const totalPage = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message: "Your spot posts retrieved successfully",
    data: {
      spotPosts,
      pagination: {
        page,
        limit,
        total,
        totalPage
      }
    }
  });
});

export const fetchSpotPost = asyncHandler(async(req, res) => 
{
    const {id} = req.params;
    const spotPost = await spotPostService.getSpotPost(id);
    if (!spotPost) {
      throw new NotFoundError("Spot post not found");
    }
    
    return res.json({
        success: true,
        message: 'spot post retrieved',
        data: {
            spotPost
        }
    })

});

const extractPublicId = (url) => {
  if (!url) return null;

  // Example URL:
  // https://res.cloudinary.com/demo/image/upload/v123456789/listings/house.jpg

  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");

  if (uploadIndex === -1) return null;

  // Skip "upload" and version folder (v123...)
  const publicIdWithExt = parts
    .slice(uploadIndex + 2)
    .join("/");

  // Remove file extension
  return publicIdWithExt.replace(/\.[^/.]+$/, "");
};


export const deleteSingleSpotPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("Not authenticated");
  }

  const spotPost = await spotPostService.getSpotPost(id);
  if (!spotPost) {
    throw new NotFoundError("spot post not found");
  }

  if (!spotPost.author.equals(req.spotOwner.id)) {
    throw new UnauthenticatedError("You are not authorized to delete this post");
  }

  // Delete images
  if (Array.isArray(spotPost.photos)) {
    await Promise.all(
      spotPost.photos.map(async (url) => {
        const publicId = extractPublicId(url);
        if (publicId) {
          const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
          });

          console.log({
            publicId,
            response
          })
        }
      })
    );
  }

  // Delete videos
  if (Array.isArray(spotPost.videos)) {
    await Promise.all(
      spotPost.videos.map(async (url) => {
        const publicId = extractPublicId(url);
        if (publicId) {
          const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
          });

          console.log({
            publicId,
            response
          })
        }
      })
    );
  }


  await spotPostService.deleteSpotPost(id);

  return res.status(200).json({
    success: true,
    message: "post and all associated media deleted successfully"
  });
});

export const updateSpotPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //Auth check
  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("Not authenticated");
  }

  //Fetch spotPost
  const spotPost = await spotPostService.getSpotPost(id);
  if (!spotPost) {
    throw new NotFoundError("Spot Post not found");
  }

  //Ownership check
  if (!spotPost.author.equals(req.spotOwner.id)) {
    throw new UnauthenticatedError("You are not authorized to update this spot post");
  }

  //Block media updates
  if (req.files && (req.files.photos || req.files.videos)) {
    throw new ValidationError("Images and videos cannot be updated");
  }

  //Validate body (PARTIAL update)
  const validator = new Validator();
  const result = validator.validate(updateSpotPostRequest, req.body);

  if (result.errors) {
    throw new ValidationError("Validation failed", result.errors);
  }

  //SAFELY DEFAULT VALUE
  const updatePayload = result.value || {};

  //Prevent empty update
  if (Object.keys(updatePayload).length === 0) {
    throw new ValidationError("No valid fields provided for update");
  }

  //Update spot post
  const updatedSpotPost = await spotPostService.updateSpotPost(
    { _id: id, author: req.spotOwner.id },
    { $set: updatePayload },
    { new: true, runValidators: true }
  );
  if (!updatedSpotPost) {
    throw new NotFoundError("Spot post not found")
  }

  return res.status(200).json({
    success: true,
    message: "post updated successfully",
    data: updatedSpotPost
  });
});

export const toggleLikeSpotPost = asyncHandler(async (req, res) => {
  const {id} = req.params;
  //ensure authenticated (works for both User and SpotOwner)
  if (!req.user && !req.spotOwner) {
    throw new UnauthenticatedError("Authentication required");
  }

  //determine who is liking
  let accountId;
  let accountModel;

  if (req.user) {
    accountId = req.user.id;
    accountModel = "User";
  } else {
    accountId = req.spotOwner.id;
    accountModel = "SpotOwner";
  }

  //find the post 
  const spotPost = await SpotPost.findById(id);

  if (!spotPost) {
    throw new NotFoundError("spot post not found");
  }

  //check if already liked
  const existingLike = await SpotLike.findOne({
    spotPost: id,
    user: accountId,
    userModel: accountModel,
  });

  //unlike
  if (existingLike) {
    await SpotLike.deleteOne({_id: existingLike._id});

    spotPost.likeCount = Math.max(spotPost.likeCount -1, 0);
    await spotPost.save();

    return res.status(200).json({
      success: true,
      message: "Spot post unliked successfully",
      liked: false,
      likeCount: spotPost.likeCount,
    });
  }

  //like
  await SpotLike.create({
    spotPost: id,
    user: accountId,
    userModel: accountModel,
  });

  spotPost.likeCount += 1;
  await spotPost.save();

  return res.status(200).json({
    success: true,
    message: "spot post liked successfully",
    liked: true,
    likeCount: spotPost.likeCount,
  });
});