import mongoose, {model, Schema} from "mongoose";

const SpotPostViewSchema = new Schema(
    {
        spotPost: {
            type: Schema.Types.ObjectId,
            ref: "SpotPost",
            required: true,

        },

        //identify the viewer
        viewerKey: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
// same viewer can count only once per spot pose
SpotPostViewSchema.index(
    {listing: 1, viewerKey: 1},
    {unique: true}
);
export const SpotPostView = model("SpotPostView", SpotPostViewSchema);