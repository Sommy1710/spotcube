import Joi from "joi";

export const createPostRequest = Joi.object({
    caption: Joi.string()
    .max(2200)
    .allow("")
    .default(""),
});

export const updatePostRequest = Joi.object({
    caption: Joi.string()
    .max(2200)
    .allow("")
    .required(),
});