import {Router} from 'express';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import {toggleFavouriteSpotPost, fetchFavouriteSpotPosts,} from './favourites.controller.js';
const router = Router();

router.patch('/favourites/:id', dualAuthMiddleware, toggleFavouriteSpotPost);
router.get('/fetch-favourites', dualAuthMiddleware, fetchFavouriteSpotPosts);

export const favouritesRouter = router;
