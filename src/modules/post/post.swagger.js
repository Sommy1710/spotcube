/**
 * ============================================================
 *  POSTS API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/posts', postRouter);
 *
 *  Re-uses components that already exist in your auth swagger
 *  file, so they are NOT defined again here:
 *    - CookieAuth (security scheme)
 *    - ValidationError
 *    - UnauthorizedError
 *    - ForbiddenError
 *    - NotFoundError
 *    - InternalServerError
 */

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: |
 *       APIs for creating, updating, deleting and liking posts.
 *
 *       - **Create, update and delete** can only be done by a
 *         regular **user** (and only on their own posts).
 *       - **Like / unlike** can be done by both **users** and
 *         **spot owners**.
 *
 *       Authentication uses the **authentication** HttpOnly cookie
 *       set at login.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     # ---------------------------------------------------------
 *     # A single post document returned from MongoDB
 *     # ---------------------------------------------------------
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique post ID.
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *
 *         author:
 *           type: string
 *           description: ID of the User who created the post.
 *           example: 66f1c2a9e4b0a1d2c3e4f111
 *
 *         username:
 *           type: string
 *           description: Username of the author at the time the post was created.
 *           example: johndoe
 *
 *         caption:
 *           type: string
 *           maxLength: 2200
 *           example: Sunday vibes at Lekki beach
 *
 *         photos:
 *           type: array
 *           description: Cloudinary URLs of the uploaded photos (maximum 10).
 *           items:
 *             type: string
 *           example:
 *             - https://res.cloudinary.com/demo/image/upload/v1/photo1.jpg
 *
 *         videos:
 *           type: array
 *           description: Cloudinary URLs of the uploaded video (maximum 1).
 *           items:
 *             type: string
 *           example:
 *             - https://res.cloudinary.com/demo/video/upload/v1/video1.mp4
 *
 *         likeCount:
 *           type: integer
 *           example: 12
 *
 *         commentCount:
 *           type: integer
 *           example: 3
 *
 *         views:
 *           type: integer
 *           example: 140
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-09T10:15:30.000Z
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-09T10:15:30.000Z
 *
 *
 *     # ---------------------------------------------------------
 *     # Request body for creating a post (multipart/form-data)
 *     # ---------------------------------------------------------
 *     CreatePostRequest:
 *       type: object
 *       properties:
 *         caption:
 *           type: string
 *           maxLength: 2200
 *           description: Optional text for the post.
 *           example: Sunday vibes at Lekki beach
 *
 *         photos:
 *           type: array
 *           maxItems: 10
 *           description: Up to 10 image files.
 *           items:
 *             type: string
 *             format: binary
 *
 *         videos:
 *           type: array
 *           maxItems: 1
 *           description: One video file, 60 seconds or less.
 *           items:
 *             type: string
 *             format: binary
 *
 *
 *     # ---------------------------------------------------------
 *     # Request body for updating a post (application/json)
 *     # ---------------------------------------------------------
 *     UpdatePostRequest:
 *       type: object
 *       required:
 *         - caption
 *       properties:
 *         caption:
 *           type: string
 *           maxLength: 2200
 *           description: The new caption. An empty string removes the caption.
 *           example: Updated caption
 *
 *
 *     # ---------------------------------------------------------
 *     # Response for create and update
 *     # ---------------------------------------------------------
 *     PostResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Post created successfully.
 *
 *         data:
 *           type: object
 *           properties:
 *             post:
 *               $ref: '#/components/schemas/Post'
 *
 *
 *     # ---------------------------------------------------------
 *     # Response for toggle like
 *     # ---------------------------------------------------------
 *     ToggleLikePostResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: post liked successfully
 *
 *         liked:
 *           type: boolean
 *           description: true if the post is now liked, false if the like was removed.
 *           example: true
 *
 *         likeCount:
 *           type: integer
 *           description: The post's total likes after this action.
 *           example: 13
 */

/**
 * @swagger
 * /api/posts/create-post:
 *   post:
 *     summary: Create a new post
 *     description: |
 *       Creates a post for the logged-in **user**.
 *
 *       Supports `multipart/form-data` because photos and a video
 *       can be uploaded. Files are uploaded to Cloudinary and only
 *       their URLs are saved.
 *
 *       ### Rules
 *       - At least **one photo or one video** is required.
 *       - Maximum **10 photos**.
 *       - Maximum **1 video**, and it must be **60 seconds or less**.
 *       - Caption is optional, maximum **2200 characters**.
 *
 *     tags:
 *       - Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *             example:
 *               success: true
 *               message: Post created successfully.
 *               data:
 *                 post:
 *                   _id: 66f1c2a9e4b0a1d2c3e4f333
 *                   author: 66f1c2a9e4b0a1d2c3e4f111
 *                   username: johndoe
 *                   caption: Sunday vibes at Lekki beach
 *                   photos:
 *                     - https://res.cloudinary.com/demo/image/upload/v1/photo1.jpg
 *                   videos: []
 *                   likeCount: 0
 *                   commentCount: 0
 *                   views: 0
 *                   createdAt: 2026-10-09T10:15:30.000Z
 *                   updatedAt: 2026-10-09T10:15:30.000Z
 *
 *       400:
 *         description: |
 *           Validation error. Possible reasons:
 *           - No photo or video was uploaded
 *           - More than 10 photos
 *           - More than 1 video
 *           - Video is longer than 60 seconds
 *           - Caption is longer than 2200 characters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

/**
 * @swagger
 * /api/posts/delete-post/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: |
 *       Permanently deletes a post.
 *
 *       Only the **author** of the post can delete it.
 *
 *       The post's photos and videos are also removed from Cloudinary.
 *
 *     tags:
 *       - Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *         description: The post's `_id`.
 *
 *     responses:
 *
 *       200:
 *         description: Post deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Post deleted successfully.
 *
 *       400:
 *         description: Post ID is missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       403:
 *         description: You are not the author of this post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               success: false
 *               message: Post not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

/**
 * @swagger
 * /api/posts/update-post/{postId}:
 *   patch:
 *     summary: Update a post's caption
 *     description: |
 *       Changes the caption of a post.
 *
 *       Only the **author** of the post can update it.
 *
 *       Only the **caption** can be changed. Photos and videos
 *       cannot be edited after the post is created.
 *
 *     tags:
 *       - Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *         description: The post's `_id`.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *             example:
 *               success: true
 *               message: Post updated successfully.
 *               data:
 *                 post:
 *                   _id: 66f1c2a9e4b0a1d2c3e4f333
 *                   author: 66f1c2a9e4b0a1d2c3e4f111
 *                   username: johndoe
 *                   caption: Updated caption
 *                   photos:
 *                     - https://res.cloudinary.com/demo/image/upload/v1/photo1.jpg
 *                   videos: []
 *                   likeCount: 12
 *                   commentCount: 3
 *                   views: 140
 *                   createdAt: 2026-10-09T10:15:30.000Z
 *                   updatedAt: 2026-10-09T11:00:00.000Z
 *
 *       400:
 *         description: Caption is missing or longer than 2200 characters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       403:
 *         description: You are not the author of this post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               success: false
 *               message: Post not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

/**
 * @swagger
 * /api/posts/toggle-like-post/{postId}:
 *   post:
 *     summary: Like or unlike a post
 *     description: |
 *       Toggles the logged-in account's like on a post.
 *
 *       Works for both **users** and **spot owners**.
 *
 *       - If the account has **not** liked the post, a like is added.
 *       - If the account **has** already liked it, the like is removed.
 *
 *       Each account can like a post only once.
 *
 *       ### Notification
 *       When a post is **liked** (not unliked), the post's author
 *       receives a `POST_LIKED` notification, in real time and
 *       in their saved notifications.
 *       No notification is sent when users like their own post.
 *
 *     tags:
 *       - Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *         description: The post's `_id`.
 *
 *     responses:
 *
 *       200:
 *         description: Post liked or unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToggleLikePostResponse'
 *             examples:
 *               liked:
 *                 summary: The post was liked
 *                 value:
 *                   success: true
 *                   message: post liked successfully
 *                   liked: true
 *                   likeCount: 13
 *               unliked:
 *                 summary: The like was removed
 *                 value:
 *                   success: true
 *                   message: post unliked successfully
 *                   liked: false
 *                   likeCount: 12
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               success: false
 *               message: post not found
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */