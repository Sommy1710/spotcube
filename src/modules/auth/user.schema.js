import mongoose, {model, Schema} from 'mongoose';

import argon from 'argon2'

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    country: {
        type: String,
        default: 'Nigeria'
    },

    bio: {
        type: String
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
    }
},



    profilePhoto: {
        type: String,
        default: ''
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    followers: [
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "followers.accountModel"
        },
        accountModel: {
            type: String,
            enum: ["User", "SpotOwner"],
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }
],

following: [
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "following.accountModel"
        },
        accountModel: {
            type: String,
            enum: ["User", "SpotOwner"],
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }
],

    emailVerificationCode: String,
    emailCodeExpiry: Date,

    passwordResetCode: String,
    passwordResetExpiry: Date,

    isDeleted: {
        type: Boolean,
        default: false
    },

    deleteRequestedAt: Date,

    isBanned: {type: Boolean, default: false},
    bannedAt: Date,
    banReason: String

}, { timestamps: true });

UserSchema.index({geoLocation: "2dsphere"});

UserSchema.pre('save', async function()
{
    if (this.isModified('password'))
    {
        this.password = await argon.hash(this.password);
    }
});
 
export const User = model('User', UserSchema);