import { SpotComment } from "../spotPostComment/spotPostComment.schema.js";
import { SpotCommentLike } from "./spotPostCommentLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import {
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";

export const toggleLikeSpotComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

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

    const comment = await SpotComment.findById(id);

    if (!comment) {
        throw new NotFoundError("Comment not found.");
    }

    const existingLike = await SpotCommentLike.findOne({
        comment: id,
        user: accountId,
        userModel: accountModel,
    });

    // Unlike
    if (existingLike) {
        await SpotCommentLike.deleteOne({
            _id: existingLike._id,
        });

        comment.commentLikeCount = Math.max(
            comment.commentLikeCount - 1,
            0
        );

        await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment unliked successfully.",
            liked: false,
            likeCount: comment.commentLikeCount,
        });
    }

    // Like
    await SpotCommentLike.create({
        comment: id,
        user: accountId,
        userModel: accountModel,
    });

    comment.commentLikeCount += 1;

    await comment.save();

    return res.status(200).json({
        success: true,
        message: "Comment liked successfully.",
        liked: true,
        likeCount: comment.commentLikeCount,
    });
});