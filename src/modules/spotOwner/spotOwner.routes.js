import {Router} from 'express';
import {createSpotOwnerAccount, verifyEmailOTP, authenticateSpotOwner, deleteSpotOwnerAccount, getAuthenticatedSpotOwner,
     logoutSpotOwner, deleteSpotOwnerProfilePhoto, updateSpotOwnerAccount,resetPassword, forgotPassword, toggleFollow, fetchProfile
      } from './spotOwner.controller.js';
import upload from '../../lib/upload.js';
import spotOwnerMiddleware from '../../app/middleware/spotOwner.middleware.js';
import dualAuthMiddleware from '../../app/middleware/dual-auth.middleware.js';
import { spotOwnerLimiter } from './spotOwnerLimiter.js';
const router = Router();

router.post('/register', upload.single('profilePhoto'), createSpotOwnerAccount);
router.post('/verify', verifyEmailOTP);
router.post('/login', spotOwnerLimiter, authenticateSpotOwner);
router.get('/user', spotOwnerMiddleware, getAuthenticatedSpotOwner);
router.delete('/delete/:spotOwnerId', spotOwnerMiddleware, deleteSpotOwnerAccount);
router.delete('/delete-profile-photo', spotOwnerMiddleware, deleteSpotOwnerProfilePhoto);
router.put('/spotOwners/:spotOwnerId', spotOwnerMiddleware, upload.single('profilePhoto'), updateSpotOwnerAccount);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/follow/:id', dualAuthMiddleware, toggleFollow );
router.post("/logout", logoutSpotOwner);
router.get("/fetch-profile/:id", dualAuthMiddleware, fetchProfile);


export const spotOwnerRouter = router;