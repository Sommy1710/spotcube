import {Router} from 'express';
import { createPostComment } from './postComment.controller.js';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
const router = Router();

router.post('/comment/:postId', dualAuthMiddleware, createPostComment);

export const postCommentRouter = router;