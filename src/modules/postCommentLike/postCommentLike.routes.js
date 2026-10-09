import {Router} from 'express';
import { toggleLikePostComment } from './postCommentLike.controller.js';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
const router = Router();

router.post('/comment/:commentId', dualAuthMiddleware, toggleLikePostComment);

export const postCommentLikeRouter = router;