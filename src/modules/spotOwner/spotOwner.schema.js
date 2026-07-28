import mongoose, {model, Schema} from 'mongoose';
import argon from 'argon2'


const SpotOwnerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Nigeria'
    },

    state: {
    type: String,
    enum: [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara"
    ],
    required: true
},

location: { type: String, required: true },
    geoLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
      
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },

  heardAboutUs: {
          type: String,
          enum: [
              "Facebook",
              "Instagram",
              "TikTok",
              "Twitter/X",
              "Google Search",
              "YouTube",
              "Friend",
              "Family",
              "Referral",
              "Advertisement",
              "Other"
          ],
          default: "Other"
      },
  
      spotPoints: {
          type: Number,
          default: 0
      },
  
      referralCode: {
          type: String,
          trim: true,
          uppercase: true,
          default: null
      },
      referredBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        model: {
            type: String,
            enum: ["User", "SpotOwner"],
        },
      },

      followersCount: {
        type: Number,
        default: 0
      },

      followingCount: {
        type: Number,
        default: 0
      },

    bio: {
        type: String
    },

    profilePhoto: {type: String, default: ''},
    isEmailVerified: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    role: {
        type: String,
        default: 'spotOwner',
        immutable: true
    },
    emailVerificationCode: String,
    emailCodeExpiry: Date,

    passwordResetCode: String,
    passwordResetExpiry: Date,

    isDeleted: {type: Boolean, default: false},
    deleteRequestedAt: Date,

    isBanned: {type: Boolean, default: false},
    bannedAt: Date,
    banReason: String

}, {timestamps: true});

SpotOwnerSchema.pre('save', async function()
{
    if (this.isModified('password'))
    {
        this.password = await argon.hash(this.password);
    }
});


export const SpotOwner = model('SpotOwner', SpotOwnerSchema);

const ProfileViewSchema = new Schema({
  OwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "SpotOwner", required: true },
  viewerId: { type: mongoose.Schema.Types.ObjectId, refPath: "viewerModel" },
  viewerModel: { type: String, enum: ["User", "SpotOwner"] },
  isFollower: { type: Boolean, default: false },
  viewedAt: { type: Date, default: Date.now }
});

export const ProfileView = model("ProfileView", ProfileViewSchema);

const FollowSchema = new Schema(
{
    follower: {
        type: Schema.Types.ObjectId,
        refPath: "followerModel",
        required: true
    },

    followerModel: {
        type: String,
        enum: ["User", "SpotOwner"],
        required: true
    },

    following: {
        type: Schema.Types.ObjectId,
        refPath: "followingModel",
        required: true
    },

    followingModel: {
        type: String,
        enum: ["User", "SpotOwner"],
        required: true
    }
},
{
    timestamps: true
});

FollowSchema.index({
    follower: 1,
    followerModel: 1
});

FollowSchema.index({
    following: 1,
    followingModel: 1
});

FollowSchema.index({
    follower: 1,
    followerModel: 1,
    following: 1,
    followingModel: 1
}, {
    unique: true
});

export const Follow = model('Follow', FollowSchema);
