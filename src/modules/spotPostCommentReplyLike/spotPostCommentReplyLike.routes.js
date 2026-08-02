import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import { toggleLikeSpotCommentReply } from './spotPostCommentReplyLike.controller.js';
const router = Router();

router.patch('/spot-post-comment-reply-like/:id', dualAuthMiddleware, toggleLikeSpotCommentReply);

export const spotCommentReplyLikeRouter = router;


