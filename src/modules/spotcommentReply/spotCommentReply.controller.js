import { SpotComment } from "../spotPostComment/spotPostComment.schema.js";
import { SpotCommentReply } from "./spotCommentReply.schema.js";
import { User } from "../auth/user.schema.js";
import { SpotOwner } from "../spotOwner/spotOwner.schema.js";
import { Validator } from "../../lib/validator.js";
import { createSpotCommentReplyRequest } from "./create-spotCommentReply.request.js";
import { asyncHandler } from "../../lib/util.js";
import {
    ValidationError,
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";

export const createSpotCommentReply = asyncHandler(async (req, res) => {

    const { id } = req.params; // comment id

    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    const validator = new Validator();

    const { value, errors } = validator.validate(
        createSpotCommentReplyRequest,
        req.body
    );

    if (errors) {
        throw new ValidationError(
            "Validation failed.",
            errors
        );
    }

    const comment = await SpotComment.findById(id);

    if (!comment) {
        throw new NotFoundError("Comment not found.");
    }

    let authorId;
    let authorModel;
    let username;

    if (req.user?.role === "spotOwner") {

        const owner = await SpotOwner.findById(req.user.id)
            .select("username");

        if (!owner) {
            throw new NotFoundError("Spot owner not found.");
        }

        authorId = owner._id;
        authorModel = "SpotOwner";
        username = owner.username;

    } else if (req.user) {

        const user = await User.findById(req.user.id)
            .select("username");

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        authorId = user._id;
        authorModel = "User";
        username = user.username;

    } else {

        const owner = await SpotOwner.findById(req.spotOwner.id)
            .select("username");

        if (!owner) {
            throw new NotFoundError("Spot owner not found.");
        }

        authorId = owner._id;
        authorModel = "SpotOwner";
        username = owner.username;
    }

    const reply = await SpotCommentReply.create({

        comment: comment._id,

        spotPost: comment.spotPost,

        author: authorId,

        authorModel,

        username,

        reply: value.reply,
    });

    await SpotComment.updateOne(
        {
            _id: comment._id,
        },
        {
            $inc: {
                replyCount: 1,
            },
        }
    );

    return res.status(201).json({

        success: true,

        message: "Reply added successfully.",

        data: {
            reply,
        },
    });
});


export const deleteSpotCommentReply = asyncHandler(async (req, res) => {
    const { id } = req.params; // Reply ID

    // Authentication
    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    // Find reply
    const reply = await SpotCommentReply.findById(id);

    if (!reply) {
        throw new NotFoundError("Reply not found.");
    }

    // Determine authenticated account
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

    // Ensure only the reply owner can delete it
    if (
        reply.author.toString() !== accountId ||
        reply.authorModel !== accountModel
    ) {
        throw new UnauthenticatedError(
            "You are not authorized to delete this reply."
        );
    }

    // Delete reply
    await SpotCommentReply.findByIdAndDelete(reply._id);

    // Decrement reply count
    await SpotComment.updateOne(
        {
            _id: reply.comment,
            replyCount: { $gt: 0 },
        },
        {
            $inc: {
                replyCount: -1,
            },
        }
    );

    return res.status(200).json({
        success: true,
        message: "Reply deleted successfully.",
    });
});