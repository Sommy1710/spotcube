import Joi from "joi";

export const createPostCommentReplyRequest = Joi.object({
  reply: Joi.string().trim().min(1).max(1000).required(),
});