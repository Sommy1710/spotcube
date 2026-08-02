import { SpotCommentReply } from "../spotcommentReply/spotCommentReply.schema.js";
import { SpotCommentReplyLike } from "./spotPostCommentReplyLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import {
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";

export const toggleLikeSpotCommentReply = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Authentication
    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    let accountId;
    let accountModel;

    if (req.user?.role === "spotOwner") {
        accountId = req.user.id;
        accountModel = "SpotOwner";
    } else if (req.user) {
        accountId = req.user.id;
        accountModel = "User";
    } else {
        accountId = req.spotOwner.id;
        accountModel = "SpotOwner";
    }

    // Ensure reply exists
    const reply = await SpotCommentReply.findById(id);

    if (!reply) {
        throw new NotFoundError("Reply not found.");
    }

    // Check if already liked
    const existingLike = await SpotCommentReplyLike.findOne({
        reply: id,
        user: accountId,
        userModel: accountModel,
    });

    // Unlike
    if (existingLike) {
        await SpotCommentReplyLike.deleteOne({
            _id: existingLike._id,
        });

        await SpotCommentReply.updateOne(
            {
                _id: id,
                replyLikeCount: { $gt: 0 },
            },
            {
                $inc: {
                    replyLikeCount: -1,
                },
            }
        );

        const updatedReply = await SpotCommentReply.findById(id)
            .select("replyLikeCount");

        return res.status(200).json({
            success: true,
            message: "Reply unliked successfully.",
            liked: false,
            likeCount: updatedReply.replyLikeCount,
        });
    }

    // Like
    await SpotCommentReplyLike.create({
        reply: id,
        user: accountId,
        userModel: accountModel,
    });

    await SpotCommentReply.updateOne(
        { _id: id },
        {
            $inc: {
                replyLikeCount: 1,
            },
        }
    );

    const updatedReply = await SpotCommentReply.findById(id)
        .select("replyLikeCount");

    return res.status(200).json({
        success: true,
        message: "Reply liked successfully.",
        liked: true,
        likeCount: updatedReply.replyLikeCount,
    });
});