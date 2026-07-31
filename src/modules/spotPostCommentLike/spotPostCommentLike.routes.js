import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import {toggleLikeSpotComment} from './spotPostCommentLike.controller.js';
const router = Router();

router.patch("/spot-post-comment-like/:id", dualAuthMiddleware, toggleLikeSpotComment);

export const spotCommentLikeRouter = router;
