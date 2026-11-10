import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
import { asyncHandler } from './../../lib/util.js';
import {ConflictError, NotFoundError, UnauthenticatedError, UnauthorizedError, ValidationError} from "../../lib/error-definitions.js";
import {Validator} from "../../lib/validator.js";
import {SpotCover} from "./spotCover.schema.js";
import {createSpotCoverRequest, updateSpotCoverRequest, listSpotCoversRequest} from "./spotCover.request.js";
import {SpotOwner} from "../spotOwner/spotOwner.schema.js";
import {User} from "../auth/user.schema.js";

const MAX_COVER_SIZE_MB = 5;

// each spot owner has one fixed Cloudinary id, so a new upload
// replaces the old file instead of leaving a forgotten copy behind
const coverPublicId = (spotOwnerId) => `spot-covers/${spotOwnerId}`;

// uploads the image and crops it to a 16:9 banner (1600 x 900)
const uploadCover = (buffer, spotOwnerId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          public_id: coverPublicId(spotOwnerId),
          overwrite: true,
          invalidate: true,
          transformation: [
            {
              width: 1600,
              height: 900,
              crop: "fill",
              gravity: "auto",
              quality: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            return reject(new Error("Cover photo upload failed"));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });

// checks that the uploaded file is an image of an allowed size
const assertValidImage = (file) => {
  if (!file.mimetype.startsWith("image/")) {
    throw new ValidationError("Cover photo must be an image.");
  }

  if (file.size > MAX_COVER_SIZE_MB * 1024 * 1024) {
    throw new ValidationError(
      `Cover photo must be ${MAX_COVER_SIZE_MB}MB or smaller.`
    );
  }
};

// copies the spot owner's name and location onto the cover
const snapshotFromOwner = (owner) => {
  const snapshot = {
    username: owner.username,
    location: owner.location,
  };

  // only copy coordinates that really exist
  if (owner.geoLocation?.coordinates?.length === 2) {
    snapshot.geoLocation = {
      type: "Point",
      coordinates: [...owner.geoLocation.coordinates],
    };
    snapshot.geoPrecision = owner.geoPrecision;
  }

  return snapshot;
};

export const createSpotCover = asyncHandler(async (req, res) => {


  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("spot owner not authenticated");
  }

  if (!req.file) {
    throw new ValidationError("A cover photo is required.");
  }

  assertValidImage(req.file);

  const validator = new Validator();

  const { errors, value } = validator.validate(
    createSpotCoverRequest,
    req.body
  );

  if (errors) {
    throw new ValidationError(
      "The request failed with the following errors.",
      errors
    );
  }

  const owner = await SpotOwner.findOne({
    _id: req.spotOwner.id,
    isDeleted: false,
    isBanned: false,
  }).select("username location geoLocation geoPrecision");

  if (!owner) {
    throw new UnauthenticatedError(
      "Authenticated spot owner account could not be found."
    );
  }

  const existingCover = await SpotCover.findOne({ spotOwner: owner._id });

  if (existingCover) {
    throw new ConflictError(
      "You already have a cover. Update or delete it instead."
    );
  }

  const coverPhoto = await uploadCover(req.file.buffer, owner._id);

  const coverPayload = {
    spotOwner: owner._id,
    ...snapshotFromOwner(owner),
    coverPhoto,
    category: value.category,
  };

  const cover = await SpotCover.create(coverPayload);

  return res.status(201).json({
    success: true,
    message: "Cover created successfully.",
    data: {
      cover,
    },
  });
});


export const updateSpotCover = asyncHandler(async (req, res) => {

  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("spot owner not authenticated");
  }

  const { coverId } = req.params;

  if (!mongoose.isValidObjectId(coverId)) {
    throw new ValidationError("Invalid cover ID.");
  }

  const validator = new Validator();

  const { errors, value } = validator.validate(
    updateSpotCoverRequest,
    req.body
  );

  if (errors) {
    throw new ValidationError(
      "The request failed with the following errors.",
      errors
    );
  }


  if (!req.file && !value.category) {
    throw new ValidationError("Provide a cover photo, a category, or both.");
  }

  if (req.file) {
    assertValidImage(req.file);
  }


  const cover = await SpotCover.findById(coverId);

  if (!cover) {
    throw new NotFoundError("Cover not found.");
  }


  if (cover.spotOwner.toString() !== req.spotOwner.id.toString()) {
    throw new UnauthorizedError(
      "You are not authorized to update this cover."
    );
  }


  const owner = await SpotOwner.findById(req.spotOwner.id).select(
    "username location geoLocation"
  );

  if (!owner) {
    throw new NotFoundError("Spot owner account could not be found.");
  }


  if (req.file) {
    cover.coverPhoto = await uploadCover(req.file.buffer, cover.spotOwner);
  }

  if (value.category) {
    cover.category = value.category;
  }

  // keeps the name and location in step with the spot owner's profile
  Object.assign(cover, snapshotFromOwner(owner));

  await cover.save();

  return res.status(200).json({
    success: true,
    message: "Cover updated successfully.",
    data: {
      cover,
    },
  });
});

export const deleteSpotCover = asyncHandler(async (req, res) => {

  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("spot owner not authenticated");
  }


  const { coverId } = req.params;

  if (!mongoose.isValidObjectId(coverId)) {
    throw new ValidationError("Invalid cover ID.");
  }


  const cover = await SpotCover.findById(coverId);

  if (!cover) {
    throw new NotFoundError("Cover not found.");
  }

  if (cover.spotOwner.toString() !== req.spotOwner.id.toString()) {
    throw new UnauthorizedError(
      "You are not authorized to delete this cover."
    );
  }

  try {
    await cloudinary.uploader.destroy(coverPublicId(cover.spotOwner), {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete cover photo from Cloudinary:",
      error.message
    );
  }

  await SpotCover.findByIdAndDelete(coverId);


  return res.status(200).json({
    success: true,
    message: "Cover deleted successfully.",
  });
});

export const getMySpotCover = asyncHandler(async (req, res) => {
  if (!req.spotOwner || !req.spotOwner.id) {
    throw new UnauthenticatedError("spot owner not authenticated");
  }

  const cover = await SpotCover.findOne({ spotOwner: req.spotOwner.id }).lean();

  if (!cover) {
    throw new NotFoundError("You have not created a cover yet.");
  }

  return res.status(200).json({
    success: true,
    message: "Cover fetched successfully.",
    data: {
      cover,
    },
  });
});


export const getSpotCoverBySpotOwner = asyncHandler(async (req, res) => {
  const { spotOwnerId } = req.params;

  if (!mongoose.isValidObjectId(spotOwnerId)) {
    throw new ValidationError("Invalid spot ID.");
  }

  // the spot owner must still exist and not be banned
  const owner = await SpotOwner.exists({
    _id: spotOwnerId,
    isDeleted: false,
    isBanned: false,
  });

  if (!owner) {
    throw new NotFoundError("Spot not found.");
  }

  const cover = await SpotCover.findOne({ spotOwner: spotOwnerId }).lean();

  if (!cover) {
    throw new NotFoundError("This spot has no cover yet.");
  }

  return res.status(200).json({
    success: true,
    message: "Cover fetched successfully.",
    data: {
      cover,
    },
  });
});

export const listSpotCovers = asyncHandler(async (req, res) => {
  const validator = new Validator();

  const { errors, value } = validator.validate(
    listSpotCoversRequest,
    req.query
  );

  if (errors) {
    throw new ValidationError(
      "The request failed with the following errors.",
      errors
    );
  }

  const { category, page, limit } = value;

  const filter = category ? { category } : {};

  const [covers, total] = await Promise.all([
    SpotCover.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    SpotCover.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: "Covers fetched successfully.",
    data: {
      covers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});


/*export const getNearbySpotCovers = asyncHandler(async (req, res) => {

  // 1. CHECK AUTHENTICATION
  if (!req.user || !req.user.id) {
    throw new UnauthenticatedError("user not authenticated");
  }

  // 2. LOAD THE USER'S LAST KNOWN LOCATION
  const user = await User.findById(req.user.id).select("currentLocation");

  if (user?.currentLocation?.coordinates?.length !== 2) {
    throw new ValidationError(
      "Your location is not available. Please allow location access in the app."
    );
  }

  // 3. READ QUERY VALUES (with safe limits)
  const radiusKm = Math.min(Number(req.query.radiusKm) || 10, 50);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 30);

  // 4. FIND COVERS NEAR THE USER, NEAREST FIRST
  const covers = await SpotCover.aggregate([
    {
      $geoNear: {
        near: user.currentLocation,
        distanceField: "distanceMeters",
        maxDistance: radiusKm * 1000,
        spherical: true,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        username: 1,
        coverPhoto: 1,
        category: 1,
        location: 1,
        ratingAverage: 1,
        ratingCount: 1,
        geoPrecision: 1,
        distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] },
        // geoLocation is left out on purpose, so exact coordinates are not exposed
      },
    },
  ]);

  // 5. RESPONSE
  return res.status(200).json({
    success: true,
    data: { covers, page, limit, radiusKm },
  });
});*/

// ============================================================
// NEARBY COVERS  →  GET /api/spotCover/nearby?radiusKm=2&page=1&limit=10
// Every cover, ranked:
//   1 same address (within radiusKm)  2 same city/town (within 25 km)
//   3 same state  4 same country  5 other countries  6 no address
// ============================================================

const CITY_RADIUS_METERS = 25000;

// haversine distance in metres between the viewer's point and a cover's "$coords"
const distanceFromViewer = (viewerLat, viewerLng) => {
  const lat1 = (viewerLat * Math.PI) / 180;
  const lng1 = (viewerLng * Math.PI) / 180;

  const coverLat = {
    $degreesToRadians: { $arrayElemAt: ["$coords", 1] },
  };
  const coverLng = {
    $degreesToRadians: { $arrayElemAt: ["$coords", 0] },
  };

  const dLat = { $subtract: [coverLat, lat1] };
  const dLng = { $subtract: [coverLng, lng1] };

  const a = {
    $add: [
      { $pow: [{ $sin: { $divide: [dLat, 2] } }, 2] },
      {
        $multiply: [
          Math.cos(lat1),
          { $cos: coverLat },
          { $pow: [{ $sin: { $divide: [dLng, 2] } }, 2] },
        ],
      },
    ],
  };

  return { $multiply: [2 * 6371000, { $asin: { $sqrt: a } }] };
};

export const getNearbySpotCovers = asyncHandler(async (req, res) => {

  // 1. CHECK AUTHENTICATION (user or spot owner)
  const viewerId = req.user?.id || req.spotOwner?.id;

  if (!viewerId) {
    throw new UnauthenticatedError("not authenticated");
  }

  // 2. LOAD THE VIEWER'S LOCATION DETAILS
  const isUser = Boolean(req.user);

  const viewer = isUser
    ? await User.findById(viewerId).select("currentLocation state country")
    : await SpotOwner.findById(viewerId).select("geoLocation state country");

  if (!viewer) {
    throw new NotFoundError("Account not found.");
  }

  // 3. READ QUERY VALUES (with safe limits)
  const addressRadiusMeters = Math.min(Number(req.query.radiusKm) || 2, 10) * 1000;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 30);

  // 4. THE VIEWER'S POINT (ignore a missing or [0, 0] point)
  const point = isUser ? viewer.currentLocation : viewer.geoLocation;

  const hasPoint =
    point?.coordinates?.length === 2 &&
    !(point.coordinates[0] === 0 && point.coordinates[1] === 0);

  const norm = (text) => String(text || "").trim().toLowerCase();
  const lower = (field) => ({ $toLower: { $ifNull: [field, ""] } });

  const viewerState = norm(viewer.state);
  const viewerCountry = norm(viewer.country);

  // 5. EXPRESSIONS
  // a cover has usable coordinates when it has a real [lng, lat] pair (not [0, 0])
  const hasCoords = {
    $and: [
      { $eq: [{ $size: { $ifNull: ["$coords", []] } }, 2] },
      {
        $not: [
          {
            $and: [
              { $eq: [{ $arrayElemAt: ["$coords", 0] }, 0] },
              { $eq: [{ $arrayElemAt: ["$coords", 1] }, 0] },
            ],
          },
        ],
      },
    ],
  };

  const precision = { $ifNull: ["$geoPrecision", "none"] };

  // a city/state/country-level match is a centre point, not a real address
  const preciseEnoughForAddress = {
    $not: [{ $in: [precision, ["city", "state", "country"]] }],
  };

  // a state/country-level match is too wide to count as "same city"
  const preciseEnoughForCity = {
    $not: [{ $in: [precision, ["state", "country"]] }],
  };

  const noAddress = {
    $and: [
      {
        $eq: [
          { $strLenCP: { $trim: { input: { $ifNull: ["$location", ""] } } } },
          0,
        ],
      },
      { $not: [hasCoords] },
    ],
  };

  // 6. TIER RULES (first match wins)
  const branches = [{ case: noAddress, then: 6 }];

  if (hasPoint) {
    branches.push({
      case: {
        $and: [
          { $ne: ["$distanceMeters", null] },
          preciseEnoughForAddress,
          { $lte: ["$distanceMeters", addressRadiusMeters] },
        ],
      },
      then: 1,
    });

    branches.push({
      case: {
        $and: [
          { $ne: ["$distanceMeters", null] },
          preciseEnoughForCity,
          { $lte: ["$distanceMeters", CITY_RADIUS_METERS] },
        ],
      },
      then: 2,
    });
  }

  if (viewerCountry && viewerState) {
    branches.push({
      case: {
        $and: [
          { $eq: [lower("$owner.country"), viewerCountry] },
          { $eq: [lower("$owner.state"), viewerState] },
        ],
      },
      then: 3,
    });
  }

  if (viewerCountry) {
    branches.push({
      case: { $eq: [lower("$owner.country"), viewerCountry] },
      then: 4,
    });
  }

  // 7. QUERY
  const covers = await SpotCover.aggregate([

    // bring in each cover's spot owner (for state, country and account status)
    {
      $lookup: {
        from: SpotOwner.collection.name,
        let: { ownerId: "$spotOwner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
          { $project: { state: 1, country: 1, isDeleted: 1, isBanned: 1 } },
        ],
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // hide covers whose spot owner is deleted or banned
    {
      $match: {
        "owner.isDeleted": { $ne: true },
        "owner.isBanned": { $ne: true },
      },
    },

    // the cover's [lng, lat] (works whether the field is geoLocation or geolocation)
    {
      $addFields: {
        coords: {
          $ifNull: ["$geoLocation.coordinates", "$geolocation.coordinates"],
        },
      },
    },

    // distance from the viewer (null when either side has no usable point)
    {
      $addFields: {
        distanceMeters: hasPoint
          ? {
              $cond: [
                hasCoords,
                distanceFromViewer(point.coordinates[1], point.coordinates[0]),
                null,
              ],
            }
          : null,
      },
    },

    // 1 address, 2 city, 3 state, 4 country, 5 other countries, 6 no address
    { $addFields: { tier: { $switch: { branches, default: 5 } } } },

    // inside the address and city tiers, the closest covers come first
    {
      $addFields: {
        nearRank: {
          $cond: [
            { $in: ["$tier", [1, 2]] },
            { $ifNull: ["$distanceMeters", 0] },
            0,
          ],
        },
      },
    },

    { $sort: { tier: 1, nearRank: 1, createdAt: -1, _id: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },

    {
      $project: {
        username: 1,
        coverPhoto: 1,
        category: 1,
        location: 1,
        ratingAverage: 1,
        ratingCount: 1,
        geoPrecision: 1,
        tier: 1,
        distanceKm: {
          $cond: [
            {
              $and: [
                { $in: ["$tier", [1, 2]] },
                { $ne: ["$distanceMeters", null] },
              ],
            },
            { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] },
            "$$REMOVE",
          ],
        },
        // coordinates and owner details are left out on purpose
      },
    },
  ]);

  // 8. RESPONSE
  return res.status(200).json({
    success: true,
    data: {
      covers,
      page,
      limit,
      radiusKm: addressRadiusMeters / 1000,
      cityRadiusKm: CITY_RADIUS_METERS / 1000,
    },
  });
});