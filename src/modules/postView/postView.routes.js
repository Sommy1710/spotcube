import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import { incrementPostViews } from './postView.controller.js';
const router = Router();

router.post('/increment-post-views/:id', dualAuthMiddleware, incrementPostViews);

export const incrementPostViewsRouter = router;