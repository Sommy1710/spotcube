/**
 * ============================================================
 *  POST COMMENTS API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/postComment', postCommentRouter);
 *
 *  Re-uses components that already exist in your auth swagger
 *  file, so they are NOT defined again here:
 *    - CookieAuth (security scheme)
 *    - ValidationError
 *    - UnauthorizedError
 *    - NotFoundError
 *    - InternalServerError
 */

/**
 * @swagger
 * tags:
 *   - name: Post Comments
 *     description: |
 *       APIs for commenting on posts.
 *
 *       Both **users** and **spot owners** can comment.
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
 *     # A single comment document returned from MongoDB
 *     # ---------------------------------------------------------
 *     PostComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique comment ID.
 *           example: 66f1c2a9e4b0a1d2c3e4f777
 *
 *         post:
 *           type: string
 *           description: ID of the post this comment belongs to.
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *
 *         author:
 *           type: string
 *           description: ID of the user or spot owner who wrote the comment.
 *           example: 66f1c2a9e4b0a1d2c3e4f222
 *
 *         authorModel:
 *           type: string
 *           description: Tells you which collection `author` belongs to.
 *           enum:
 *             - User
 *             - SpotOwner
 *           example: User
 *
 *         username:
 *           type: string
 *           description: Username of the commenter at the time of commenting.
 *           example: janedoe
 *
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           example: This place looks amazing!
 *
 *         commentLikeCount:
 *           type: integer
 *           description: Number of likes on this comment.
 *           example: 0
 *
 *         replyCount:
 *           type: integer
 *           description: Number of replies to this comment.
 *           example: 0
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
 *     # Request body for creating a comment (application/json)
 *     # ---------------------------------------------------------
 *     CreatePostCommentRequest:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           description: The comment text (maximum 1000 characters).
 *           example: This place looks amazing!
 *
 *
 *     # ---------------------------------------------------------
 *     # Response for creating a comment
 *     # ---------------------------------------------------------
 *     CreatePostCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Comment created successfully.
 *
 *         comment:
 *           $ref: '#/components/schemas/PostComment'
 */

/**
 * @swagger
 * /api/postComment/comment/{postId}:
 *   post:
 *     summary: Comment on a post
 *     description: |
 *       Adds a comment to a post.
 *
 *       Works for both **users** and **spot owners**.
 *       The commenter's `username` is saved on the comment automatically.
 *
 *       The post's `commentCount` is increased by 1.
 *
 *       ### Notification
 *       The post's author receives a `COMMENTED_ON_POST` notification,
 *       in real time and in their saved notifications.
 *       No notification is sent when users comment on their own post.
 *
 *     tags:
 *       - Post Comments
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
 *         description: The `_id` of the post being commented on.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostCommentRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePostCommentResponse'
 *             example:
 *               success: true
 *               message: Comment created successfully.
 *               comment:
 *                 _id: 66f1c2a9e4b0a1d2c3e4f777
 *                 post: 66f1c2a9e4b0a1d2c3e4f333
 *                 author: 66f1c2a9e4b0a1d2c3e4f222
 *                 authorModel: User
 *                 username: janedoe
 *                 comment: This place looks amazing!
 *                 commentLikeCount: 0
 *                 replyCount: 0
 *                 createdAt: 2026-10-09T10:15:30.000Z
 *                 updatedAt: 2026-10-09T10:15:30.000Z
 *
 *       400:
 *         description: Comment is missing or longer than 1000 characters.
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
 *       404:
 *         description: Post not found, or the commenting account no longer exists.
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