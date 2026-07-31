import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import {createSpotComment, deleteSpotComment} from './createSpotPostComment.controller.js'
const router = Router();

router.post("/spot-post-comment/:id", dualAuthMiddleware, createSpotComment);
router.delete("/delete-spot-post-comment/:id", dualAuthMiddleware, deleteSpotComment);

export const spotPostCommentRouter = router;
