import mongoose, {model, Schema} from "mongoose";

const SpotCoverSchema = new Schema(
    {
        //the spot owner this cover belongs to (one cover per spot owner)
        spotOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SpotOwner",
            required: true,
            unique: true
        },

        //name of spot owner
        username: {
            type: String,
            required: true,
        },

        coverPhoto: {
            type: String,
            required: true,

        },
        category: {
            type: String,
            enum: [
                "Bar",
                "Cafe",
                "Resturant",
                "Lounge",
                "Store",
                "Club",
                "Park",
                "Other",
            ],
            required: true,
        },

        location: {type: String},
        geoLocation: {
            type: {
                type: String,
                enum: ["Point"],
            },
            geoPrecision: {
                type: String,
                enum: ["address", "area", "city", "state", "country"],
            },
            coordinates: {
                type: [Number],
            },
        },
        //star rating (rating system will find this later)
        ratingAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        ratingCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

//browse covers by category, newest first
SpotCoverSchema.index({
    category: 1,
    createdAt: -1,
});
SpotCoverSchema.index({ geoLocation: "2dsphere" });

export const SpotCover = model('SpotCover', SpotCoverSchema);