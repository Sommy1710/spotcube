import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import {createSpotComment} from './createSpotPostComment.controller.js'
const router = Router();

router.post("/spot-post-comment/:id", dualAuthMiddleware, createSpotComment);

export const spotPostCommentRouter = router;
