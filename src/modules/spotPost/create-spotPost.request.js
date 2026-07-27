import Joi from "joi";

export const createSpotPostRequest = Joi.object({
    caption: Joi.string()
        .max(2200)
        .allow("")
        .default(""),

    location: Joi.string()
        .trim()
        .optional(),

    geoLocation: Joi.object({
        type: Joi.string()
            .valid("Point")
            .required(),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required()
    }).optional()
});

export const updateSpotPostRequest = Joi.object({
    caption: Joi.string().trim().optional(),
});