import {Router} from 'express';
import { createNewSpotPost, deleteSingleSpotPost, fetchAllSpotPosts, fetchSpotPost, updateSpotPost,
 } from './spotPost.controller.js';
import {uploadListingMedia} from '../../lib/upload.js';
import spotOwnerMiddleware from '../../app/middleware/spotOwner.middleware.js';
import dualAuthMiddleware from './../../app/middleware/dual-auth.middleware.js';
const router = Router();

router.post('/create-spotPost', spotOwnerMiddleware, uploadListingMedia, createNewSpotPost );
router.get('/fetch-all-spotPosts', spotOwnerMiddleware, fetchAllSpotPosts);
router.get('/fetch-spotPost/:id', spotOwnerMiddleware, fetchSpotPost);
router.put('/update-spotPost/:id', spotOwnerMiddleware, updateSpotPost);
router.delete('/delete-spotPost/:id', spotOwnerMiddleware, deleteSingleSpotPost);

export const spotPostRouter = router;