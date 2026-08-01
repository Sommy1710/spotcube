import Joi from "joi";

export const createSpotCommentReplyRequest = Joi.object({
    reply: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required(),
});