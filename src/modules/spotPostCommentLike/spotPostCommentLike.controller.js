import { SpotComment } from "../spotPostComment/spotPostComment.schema.js";
import { SpotCommentLike } from "./spotPostCommentLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import { createNotification } from "../notifications/notification.service.js";
import {
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";
import {User} from '../auth/user.schema.js';
import {SpotOwner} from '../spotOwner/spotOwner.schema.js';


export const toggleLikeSpotComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    // Determine who is liking the comment
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

    // Find comment
    const comment = await SpotComment.findById(id);

    if (!comment) {
        throw new NotFoundError("Comment not found.");
    }

    // Check if already liked
    const existingLike = await SpotCommentLike.findOne({
        comment: id,
        user: accountId,
        userModel: accountModel,
    });

    // =========================
    // UNLIKE
    // =========================
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

    // =========================
    // LIKE
    // =========================
    await SpotCommentLike.create({
        comment: id,
        user: accountId,
        userModel: accountModel,
    });

    comment.commentLikeCount += 1;

    await comment.save();

    // ==========================================
    // DON'T NOTIFY SOMEONE ABOUT THEIR OWN LIKE
    // ==========================================
    const isOwnComment =
        comment.author.toString() === accountId.toString() &&
        comment.authorModel === accountModel;

    if (!isOwnComment) {

        // Get username of person who liked the comment
        let account;

        if (accountModel === "User") {
            account = await User.findById(accountId)
                .select("username");
        } else {
            account = await SpotOwner.findById(accountId)
                .select("username");
        }

        const username = account?.username || "Someone";

        // Create notification
        await createNotification({
            recipient: comment.author,
            recipientModel: comment.authorModel,

            sender: accountId,
            senderModel: accountModel,

            type: "COMMENT_LIKED",

            entityId: comment._id,
            entityModel: "SpotPostComment",

            message: `${username} liked your comment.`,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Comment liked successfully.",
        liked: true,
        likeCount: comment.commentLikeCount,
    });
});