import {Router} from "express";
import {createPost, deletePost, updatePost} from "./post.controller.js";
import {uploadPostMedia} from "../../lib/upload.js";
import authMiddleware from "../../app/middleware/auth.middleware.js";
const router = Router();

router.post("/create-post", authMiddleware, uploadPostMedia, createPost);
router.delete("/delete-post/:postId", authMiddleware, deletePost);
router.patch('/update-post/:postId', authMiddleware, updatePost);

export const postRouter = router;