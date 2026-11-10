import { Router } from "express";
import upload from "../../lib/upload.js";
import spotOwnerMiddleware from "../../app/middleware/spotOwner.middleware.js";
import dualAuthMiddleware from "../../app/middleware/dual-auth.middleware.js";

import {
  createSpotCover,
  updateSpotCover,
  deleteSpotCover,
  getMySpotCover,
  getSpotCoverBySpotOwner,
  listSpotCovers,
  getNearbySpotCovers,
} from "./spotCover.controller.js";

const router = Router();

router.post(
  "/create-cover",
  spotOwnerMiddleware,
  upload.single("coverPhoto"),
  createSpotCover
);
router.patch(
  "/update-cover/:coverId",
  spotOwnerMiddleware,
  upload.single("coverPhoto"),
  updateSpotCover
);
router.delete("/delete-cover/:coverId", spotOwnerMiddleware, deleteSpotCover);

router.get("/my-cover", spotOwnerMiddleware, getMySpotCover);
router.get("/nearby", dualAuthMiddleware, getNearbySpotCovers);
router.get("/spot/:spotOwnerId", dualAuthMiddleware, getSpotCoverBySpotOwner);
router.get("/list-spot-covers", dualAuthMiddleware, listSpotCovers);

export const spotCoverRouter = router;