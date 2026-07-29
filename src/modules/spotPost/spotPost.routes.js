import {Router} from 'express';
import { createNewSpotPost, deleteSingleSpotPost, fetchAllSpotPosts, fetchSpotPost, updateSpotPost,fetchSpotLikes, toggleLikeSpotPost,
    fetchFollowers, fetchFollowing,
 } from './spotPost.controller.js';
import {uploadListingMedia} from '../../lib/upload.js';
import spotOwnerMiddleware from '../../app/middleware/spotOwner.middleware.js';
import dualAuthMiddleware from './../../app/middleware/dual-auth.middleware.js';
const router = Router();

router.post('/create-spotPost', spotOwnerMiddleware, uploadListingMedia, createNewSpotPost );
router.get('/fetch-all-spotPosts', spotOwnerMiddleware, fetchAllSpotPosts);
router.get('/fetch-spotPost/:id', spotOwnerMiddleware, fetchSpotPost);
router.put('/update-spotPost/:id', spotOwnerMiddleware, updateSpotPost);
router.post("/like-spot-post/:id", dualAuthMiddleware, toggleLikeSpotPost);
router.delete('/delete-spotPost/:id', spotOwnerMiddleware, deleteSingleSpotPost);
router.get('/fetch-spot-likes/:id', dualAuthMiddleware, fetchSpotLikes);
router.get("/fetch-followers/:id", dualAuthMiddleware, fetchFollowers);
router.get("/fetch-following/:id", dualAuthMiddleware, fetchFollowing);

export const spotPostRouter = router;