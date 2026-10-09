import { Router } from "express";
import { createPostCommentReply } from "./postCommentReply.controller.js";
import dualAuthMiddleware from "../../app/middleware/dual-auth.middleware.js";

const router = Router();

router.post("/comment/:commentId", dualAuthMiddleware, createPostCommentReply);

export const postCommentReplyRouter = router;