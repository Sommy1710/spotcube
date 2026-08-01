import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import {createSpotCommentReply, deleteSpotCommentReply} from './spotCommentReply.controller.js'
const router = Router();

router.post(
    "/comment-reply/:id",
    dualAuthMiddleware,
    createSpotCommentReply
);
router.delete("/delete-comment-reply/:id", dualAuthMiddleware, deleteSpotCommentReply);

export const spotCommentReplyRouter = router;