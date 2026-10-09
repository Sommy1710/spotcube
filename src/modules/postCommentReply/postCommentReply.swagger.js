/**
 * ============================================================
 *  POST COMMENT REPLIES API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/postCommentReply', postCommentReplyRouter);
 *
 *  Re-uses components that already exist in your auth swagger
 *  file, so they are NOT defined again here:
 *    - CookieAuth (security scheme)
 *    - ErrorResponse
 *    - UnauthorizedError
 *    - NotFoundError
 *    - InternalServerError
 */

/**
 * @swagger
 * tags:
 *   - name: Post Comment Replies
 *     description: |
 *       APIs for replying to comments on posts.
 *
 *       Both **users** and **spot owners** can reply.
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
 *     # A single reply document returned from MongoDB
 *     # ---------------------------------------------------------
 *     PostCommentReply:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique reply ID.
 *           example: 66f1c2a9e4b0a1d2c3e4f888
 *
 *         comment:
 *           type: string
 *           description: ID of the comment this reply belongs to.
 *           example: 66f1c2a9e4b0a1d2c3e4f777
 *
 *         post:
 *           type: string
 *           description: ID of the post the comment is on.
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *
 *         author:
 *           type: string
 *           description: ID of the user or spot owner who wrote the reply.
 *           example: 66f1c2a9e4b0a1d2c3e4f222
 *
 *         authorModel:
 *           type: string
 *           description: Tells you which collection `author` belongs to.
 *           enum:
 *             - User
 *             - SpotOwner
 *           example: SpotOwner
 *
 *         username:
 *           type: string
 *           description: Username of the replier at the time of replying.
 *           example: cafe_lekki
 *
 *         reply:
 *           type: string
 *           maxLength: 1000
 *           example: Thank you! Come visit us anytime.
 *
 *         replyLikeCount:
 *           type: integer
 *           description: Number of likes on this reply.
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
 *     # Request body for creating a reply (application/json)
 *     # ---------------------------------------------------------
 *     CreatePostCommentReplyRequest:
 *       type: object
 *       required:
 *         - reply
 *       properties:
 *         reply:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           description: The reply text. Leading and trailing spaces are removed.
 *           example: Thank you! Come visit us anytime.
 *
 *
 *     # ---------------------------------------------------------
 *     # Response for creating a reply
 *     # ---------------------------------------------------------
 *     CreatePostCommentReplyResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Reply created successfully.
 *
 *         reply:
 *           $ref: '#/components/schemas/PostCommentReply'
 */

/**
 * @swagger
 * /api/postCommentReply/comment/{commentId}:
 *   post:
 *     summary: Reply to a post comment
 *     description: |
 *       Adds a reply to a comment on a post.
 *
 *       Works for both **users** and **spot owners**.
 *       The replier's `username` is saved on the reply automatically.
 *
 *       The comment's `replyCount` is increased by 1.
 *
 *       ### Rules
 *       - `reply` is required, must not be empty, and can be at most
 *         **1000 characters**.
 *       - Spaces at the start and end are trimmed before saving.
 *
 *       ### Notification
 *       The comment's author receives a `COMMENT_REPLIED` notification,
 *       in real time and in their saved notifications.
 *
 *       - The comment's author can be a **user** or a **spot owner**.
 *       - The notification's `entityId` is the ID of the **post**
 *         the comment is on (`entityModel` is `Post`), so the frontend
 *         can open that post when the notification is clicked.
 *       - No notification is sent when someone replies to their own comment.
 *
 *     tags:
 *       - Post Comment Replies
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66f1c2a9e4b0a1d2c3e4f777
 *         description: The `_id` of the comment being replied to.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostCommentReplyRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Reply created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePostCommentReplyResponse'
 *             example:
 *               success: true
 *               message: Reply created successfully.
 *               reply:
 *                 _id: 66f1c2a9e4b0a1d2c3e4f888
 *                 comment: 66f1c2a9e4b0a1d2c3e4f777
 *                 post: 66f1c2a9e4b0a1d2c3e4f333
 *                 author: 66f1c2a9e4b0a1d2c3e4f444
 *                 authorModel: SpotOwner
 *                 username: cafe_lekki
 *                 reply: Thank you! Come visit us anytime.
 *                 replyLikeCount: 0
 *                 createdAt: 2026-10-09T10:15:30.000Z
 *                 updatedAt: 2026-10-09T10:15:30.000Z
 *
 *       400:
 *         description: Validation failed (reply is missing, empty or longer than 1000 characters).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: '"reply" is required'
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       404:
 *         description: Comment not found, or the replying account no longer exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               success: false
 *               message: Comment not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */