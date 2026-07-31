import { SpotComment } from "./spotPostComment.schema.js";
import { SpotPost } from "../spotPost/spotPost.schema.js";
import { Validator } from "../../lib/validator.js";
import { createSpotCommentRequest } from "./create-spotComment.request.js";
import { User } from "../auth/user.schema.js";
import {SpotOwner} from '../spotOwner/spotOwner.schema.js';
import { asyncHandler } from "../../lib/util.js";
import {
    ValidationError,
    NotFoundError,
    UnauthenticatedError,
} from "../../lib/error-definitions.js";

export const createSpotComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Authentication
    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    // Validate request body
    const validator = new Validator();

    const { value, errors } = validator.validate(
        createSpotCommentRequest,
        req.body
    );

    if (errors) {
        throw new ValidationError(
            "The request failed with the following errors.",
            errors
        );
    }

    // Ensure the post exists
    const spotPost = await SpotPost.findById(id);

    if (!spotPost) {
        throw new NotFoundError("Spot post not found.");
    }

    // Determine commenter
    let authorId;
let authorModel;
let username;

if (req.user?.role === "spotOwner") {
    const owner = await SpotOwner.findById(req.user.id).select("username");

    if (!owner) {
        throw new NotFoundError("Spot owner not found.");
    }

    authorId = owner._id;
    authorModel = "SpotOwner";
    username = owner.username;

} else if (req.user) {
    const user = await User.findById(req.user.id).select("username");

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    authorId = user._id;
    authorModel = "User";
    username = user.username;

} else if (req.spotOwner) {
    const owner = await SpotOwner.findById(req.spotOwner.id).select("username");

    if (!owner) {
        throw new NotFoundError("Spot owner not found.");
    }

    authorId = owner._id;
    authorModel = "SpotOwner";
    username = owner.username;
} 
    

    // Create comment
    const comment = await SpotComment.create({
        spotPost: id,
        author: authorId,
        authorModel,
        username,
        comment: value.comment,
    });

    // Increment comment count
    await SpotPost.updateOne(
        { _id: id },
        {
            $inc: {
                commentCount: 1,
            },
        }
    );

    return res.status(201).json({
        success: true,
        message: "Comment added successfully.",
        data: {
            comment,
        },
    });
});

export const deleteSpotComment = asyncHandler(async (req, res) => {
    const {id} = req.params;

    //authentication
    if (!req.user && !req.spotOwner) {
        throw new UnauthenticatedError("Authentication required.");
    }

    //find the comment
    const comment = await SpotComment.findById(id);

    if (!comment) {
        throw new NotFoundError("Comment not found.");
    }

    //determine authenticated account
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

    //ensure only the comment owner can delete it 
    if (
        comment.author.toString() !== accountId || 
        comment.authorModel !== accountModel
    ) {
        throw new UnauthenticatedError(
            "You are not authorized to delete this comment."
        );
    }

    //delete the comment
    await SpotComment.findByIdAndDelete(id);
    //decrement the comment count
    await SpotPost.updateOne(
        {
            _id: comment.spotPost,
            commentCount: {$gt: 0},
        },
        {
            $inc: {
                commentCount: -1,
            }
        }
    );

    return res.status(200).json({
        success: true,
        message: "Comment deleted successfully.",
    });
});