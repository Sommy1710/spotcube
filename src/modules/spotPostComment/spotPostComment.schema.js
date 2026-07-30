import mongoose, {model, Schema} from 'mongoose';

const SpotCommentSchema = new Schema({
  spotPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SpotPost",
    required: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "authorModel",
    required: true,
  },

  authorModel: {
    type: String,
    enum: ["User", "SpotOwner"],
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
    maxlength: 1000,
    required: true,
  },

  commentLikeCount: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

export const SpotComment = model("SpotComment", SpotCommentSchema);
