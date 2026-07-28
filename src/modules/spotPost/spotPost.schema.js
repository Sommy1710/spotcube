import mongoose, {model, Schema} from 'mongoose';

const SpotPostSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "SpotOwner", required: true },
  username: {type: String, required: true},
  caption: { type: String, maxlength: 2200, default: "" },
  photos: {
    type: [String],
    required: [true, 'At least one photo is required.'],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'At least one photo must be uploaded.'
    }
  },
  videos: [{type: String}],

  location: { type: String },
  geoLocation: {
    type: {
      type: String,
      enum: ["Point"],
      
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      
    }
  },
  likeCount: {
    type: Number,
    default: 0,
  }, 
  commentCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0
  },

  createdAt: {type: Date, default: Date.now},
}, { timestamps: true });

//text index for search
SpotPostSchema.index({
  caption: "text",
  location: "text"
});

SpotPostSchema.index({
    geoLocation: "2dsphere",
});

SpotPostSchema.index({
    author: 1,
    createdAt: -1
});

export const SpotPost = model('SpotPost', SpotPostSchema);

const SpotLikeSchema = new Schema(
  {
    spotPost: {
      type: Schema.Types.ObjectId,
      ref: "SpotPost",
      required: true,
    },

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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate likes
SpotLikeSchema.index(
  {
    spotPost: 1,
    user: 1,
    userModel: 1,
  },
  {
    unique: true,
  }
);

export const SpotLike = model("SpotLike", SpotLikeSchema);

const SpotCommentSchema = new Schema(
  {
    spotPost: {
      type: Schema.Types.ObjectId,
      ref: "SpotPost",
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
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
      required: true,
      maxlength: 1000,
    },

    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        userType: {
          type: String,
          enum: ["User", "SpotOwner"],
          required: true,
        },
      },
    ],

    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SpotCommentSchema.index({
  spotPost: 1,
  createdAt: -1,
});

export const SpotComment = model("SpotComment", SpotCommentSchema);

/*const ReportSpotPostSchema = new Schema(
  {
    spotPost: {
      type: Schema.Types.ObjectId,
      ref: "SpotPost",
      required: true
    },

    reporter: {
      type: Schema.Types.ObjectId,
      required: true
    },

    reporterModel: {
      type: String,
      enum: ["User", "SpotOwner"],
      required: true
    },

    reason: {
      type: String,
      enum: [
        "scam",
        "fake_photos",
        "misleading_info",
        "offensive_content",
        "misinformation",
        "copyright",
        "spam",
        "hate_speech",
        "nudity",
        "violence",
        "harassment",
        "other"
      ],
      reqired: true
    },

    description: {
      type: String,
      maxlength: 500
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending"
    }
  },
  {timestamps: true}
);

//prevent same user from reporting same listing multiple times

ReportSpotSchema.index(
  {spotPost: 1, reporter: 1, reporterModel: 1},
  {unique: true}
);

export const ReportSpotPost = model("ReportSpotPost", ReportSpotPostSchema);*/