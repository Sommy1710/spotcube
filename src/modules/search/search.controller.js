import { asyncHandler } from "../../lib/util.js";
import { ValidationError } from "../../lib/error-definitions.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";
import { SpotPost } from "../spotPost/spotPost.schema.js";

export const globalSearch = asyncHandler(async (req, res) => {
    const query = req.query.q?.trim();

    if (!query) {
        throw new ValidationError("Search query is required.");
    }

    const limit = Math.min(Number(req.query.limit) || 10, 30);

    const regex = new RegExp(query, "i");

    const [users, spotOwners, spotPosts] = await Promise.all([

        // Users
        User.find({
            isDeleted: false,
            isBanned: false,
            $or: [
                { firstname: regex },
                { lastname: regex },
                { username: regex },
            ],
        })
            .select(
                "firstname lastname username profilePhoto bio"
            )
            .limit(limit)
            .lean(),

        // Spot Owners
        SpotOwner.find({
            isDeleted: false,
            isBanned: false,
            username: regex,
        })
            .select(
                "username profilePhoto bio isVerified"
            )
            .limit(limit)
            .lean(),

        // Spot Posts
        SpotPost.find({
            caption: regex,
        })
            .select(
                "author username caption photos videos location geoLocation likeCount commentCount views createdAt"
            )
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean(),
    ]);

    return res.status(200).json({
        success: true,
        message: "Search completed successfully.",

        data: {

            users: {
                total: users.length,
                results: users,
            },

            spotOwners: {
                total: spotOwners.length,
                results: spotOwners,
            },

            spotPosts: {
                total: spotPosts.length,
                results: spotPosts,
            },
        },
    });
});