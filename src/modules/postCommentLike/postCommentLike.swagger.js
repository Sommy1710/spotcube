/**
 * ============================================================
 *  POST COMMENT LIKES API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/postCommentLike', postCommentLikeRouter);
 *
 *  Re-uses components that already exist in your auth swagger
 *  file, so they are NOT defined again here:
 *    - CookieAuth (security scheme)
 *    - UnauthorizedError
 *    - NotFoundError
 *    - InternalServerError
 */

/**
 * @swagger
 * tags:
 *   - name: Post Comment Likes
 *     description: |
 *       APIs for liking and unliking comments on posts.
 *
 *       Both **users** and **spot owners** can like comments.
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
 *     # Response for toggling a like on a comment
 *     # ---------------------------------------------------------
 *     ToggleLikePostCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Comment liked successfully.
 *
 *         liked:
 *           type: boolean
 *           description: true if the comment is now liked, false if the like was removed.
 *           example: true
 *
 *         likeCount:
 *           type: integer
 *           description: The comment's total likes after this action.
 *           example: 5
 */

/**
 * @swagger
 * /api/postCommentLike/comment/{commentId}:
 *   post:
 *     summary: Like or unlike a post comment
 *     description: |
 *       Toggles the logged-in account's like on a comment.
 *
 *       Works for both **users** and **spot owners**.
 *
 *       - If the account has **not** liked the comment, a like is added.
 *       - If the account **has** already liked it, the like is removed.
 *
 *       Each account can like a comment only once.
 *
 *       The comment's `commentLikeCount` is updated automatically.
 *
 *       ### Notification
 *       When a comment is **liked** (not unliked), the comment's author
 *       receives a `COMMENT_LIKED` notification, in real time and
 *       in their saved notifications.
 *
 *       - The comment's author can be a **user** or a **spot owner**.
 *       - The notification's `entityId` is the ID of the **post**
 *         the comment is on (`entityModel` is `Post`), so the frontend
 *         can open that post when the notification is clicked.
 *       - No notification is sent when someone likes their own comment.
 *
 *     tags:
 *       - Post Comment Likes
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
 *         description: The `_id` of the comment to like or unlike.
 *
 *     responses:
 *
 *       200:
 *         description: Comment liked or unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToggleLikePostCommentResponse'
 *             examples:
 *               liked:
 *                 summary: The comment was liked
 *                 value:
 *                   success: true
 *                   message: Comment liked successfully.
 *                   liked: true
 *                   likeCount: 5
 *               unliked:
 *                 summary: The like was removed
 *                 value:
 *                   success: true
 *                   message: Comment unliked successfully.
 *                   liked: false
 *                   likeCount: 4
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       404:
 *         description: Comment not found.
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