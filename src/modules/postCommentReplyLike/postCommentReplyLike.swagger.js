/**
 * ============================================================
 *  POST COMMENT REPLY LIKES API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/postCommentReplyLike', postCommentReplyLikeRouter);
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
 *   - name: Post Comment Reply Likes
 *     description: |
 *       APIs for liking and unliking replies to comments on posts.
 *
 *       Both **users** and **spot owners** can like replies.
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
 *     # Response for toggling a like on a reply
 *     # ---------------------------------------------------------
 *     ToggleLikePostCommentReplyResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Reply liked successfully.
 *
 *         liked:
 *           type: boolean
 *           description: true if the reply is now liked, false if the like was removed.
 *           example: true
 *
 *         likeCount:
 *           type: integer
 *           description: The reply's total likes after this action.
 *           example: 3
 */

/**
 * @swagger
 * /api/postCommentReplyLike/reply/{replyId}:
 *   post:
 *     summary: Like or unlike a reply to a post comment
 *     description: |
 *       Toggles the logged-in account's like on a reply.
 *
 *       Works for both **users** and **spot owners**.
 *
 *       - If the account has **not** liked the reply, a like is added.
 *       - If the account **has** already liked it, the like is removed.
 *
 *       Each account can like a reply only once.
 *
 *       The reply's `replyLikeCount` is updated automatically.
 *
 *       ### Notification
 *       When a reply is **liked** (not unliked), the reply's author
 *       receives a `REPLY_LIKED` notification, in real time and
 *       in their saved notifications.
 *
 *       - The reply's author can be a **user** or a **spot owner**.
 *       - The notification's `entityId` is the ID of the **post**
 *         the reply is on (`entityModel` is `Post`), so the frontend
 *         can open that post when the notification is clicked.
 *       - No notification is sent when someone likes their own reply.
 *
 *     tags:
 *       - Post Comment Reply Likes
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: replyId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66f1c2a9e4b0a1d2c3e4f888
 *         description: The `_id` of the reply to like or unlike.
 *
 *     responses:
 *
 *       200:
 *         description: Reply liked or unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToggleLikePostCommentReplyResponse'
 *             examples:
 *               liked:
 *                 summary: The reply was liked
 *                 value:
 *                   success: true
 *                   message: Reply liked successfully.
 *                   liked: true
 *                   likeCount: 3
 *               unliked:
 *                 summary: The like was removed
 *                 value:
 *                   success: true
 *                   message: Reply unliked successfully.
 *                   liked: false
 *                   likeCount: 2
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               success: false
 *               message: Reply not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */