import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import { incrementSpotPostViews } from './spotPostView.controller.js';
const router = Router();

router.post('/increment-spotPost-views/:id', dualAuthMiddleware, incrementSpotPostViews);

export const incrementSpotPostViewsRouter = router;
