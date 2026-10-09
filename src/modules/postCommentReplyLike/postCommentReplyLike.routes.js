import { Router } from "express";
import { toggleLikePostCommentReply } from "./postCommentReplyLike.controller.js";
import dualAuthMiddleware from "../../app/middleware/dual-auth.middleware.js";

const router = Router();

router.post("/reply/:replyId", dualAuthMiddleware, toggleLikePostCommentReply);

export const postCommentReplyLikeRouter = router;