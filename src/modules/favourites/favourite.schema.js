import mongoose, { Schema, model } from "mongoose";

const SpotFavouriteSchema = new Schema(
  {
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

    spotPost: {
      type: Schema.Types.ObjectId,
      ref: "SpotPost",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SpotFavouriteSchema.index({
  user: 1,
  userModel: 1,
  spotPost: 1,
}, {
  unique: true,
});

SpotFavouriteSchema.index({
  user: 1,
  userModel: 1,
});

SpotFavouriteSchema.index({
  spotPost: 1,
});

export const SpotFavourite = model(
  "SpotFavourite",
  SpotFavouriteSchema
);