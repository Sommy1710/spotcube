import Joi from "joi";

// must match the category list in the SpotCover schema exactly
export const COVER_CATEGORIES = [
  "Bar",
  "Cafe",
  "Resturant",
  "Lounge",
  "Store",
  "Club",
  "Park",
  "Other",
];

export const createSpotCoverRequest = Joi.object({
  category: Joi.string()
    .valid(...COVER_CATEGORIES)
    .required(),
});

// the photo is the uploaded file, so only the category is checked here
export const updateSpotCoverRequest = Joi.object({
  category: Joi.string().valid(...COVER_CATEGORIES),
});

// filters for the browse list (query string)
export const listSpotCoversRequest = Joi.object({
  category: Joi.string().valid(...COVER_CATEGORIES),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(30).default(10),
});