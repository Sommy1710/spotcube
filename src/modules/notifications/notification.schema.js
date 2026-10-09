import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel"
    },

    recipientModel: {
      type: String,
      enum: ["User", "SpotOwner"],
      required: true
    },

    sender: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel"
    },

    senderModel: {
      type: String,
      enum: ["User", "SpotOwner"]
    },

    type: {
      type: String,
      enum: ["SPOT_POST_LIKED", "NEW_FOLLOWER", "COMMENTED_ON_SPOT_POST", "COMMENT_LIKED", "COMMENT_REPLIED", "REPLY_LIKED", "NEW_SPOT_POST", "NEW_POST", "POST_LIKED", "COMMENTED_ON_POST"],
      required: true
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: true
    },

    entityModel: {
      type: String,
      enum: ["SpotPost", "SpotOwner", "User", "SpotPostComment", "Post"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = model("Notification", NotificationSchema);
