import { SpotCommentReply } from "../spotcommentReply/spotCommentReply.schema.js";
import { SpotCommentReplyLike } from "./spotPostCommentReplyLike.schema.js";
import { asyncHandler } from "../../lib/util.js";
import { createNotification } from "../notifications/notification.service.js";
import {
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";


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
    
    //dont notify someone when they like their own reply
    const isOwnReply = reply.author.toString() === accountId.toString() && reply.authorModel === accountModel;

    if (!isOwnReply) {
        //get the name of the person who liked
        if (accountModel === "spotOwner") {
            const spotOwner = await SpotOwner.findById(accountId)
            .select("username");
            username = spotOwner?.username || "Someone";
        } else {
            const user = 
            await User.findById(accountId)
            .select("username");
            username = user?.username || "Someone";
        }

        await createNotification({
            recipient: reply.author,
            recipientModel: reply.authorModel,
            sender: accountId,
            senderModel: accountModel,
            type: "REPLY_LIKED",
            entityId: reply._id,
            entityModel: "SpotPostComment",
            message: `${username} liked your reply.`,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Reply liked successfully.",
        liked: true,
        likeCount: updatedReply.replyLikeCount,
    });
});