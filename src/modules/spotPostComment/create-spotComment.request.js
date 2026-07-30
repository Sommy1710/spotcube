import Joi from "joi";

export const createSpotCommentRequest = Joi.object({
    comment: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required(),
});