import mongoose, {model, Schema} from 'mongoose';

const PostCommentSchema = new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
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
  },

  replyCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const PostComment = model("PostComment", PostCommentSchema);