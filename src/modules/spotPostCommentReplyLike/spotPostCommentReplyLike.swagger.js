// =====================================================================================
// SPOT COMMENT REPLY LIKE SWAGGER DOCUMENTATION
// Base URL: /api/spotCommentReplyLike
// =====================================================================================

/**
 * @swagger
 * tags:
 *   name: Spot Comment Reply Likes
 *   description: APIs for liking and unliking replies to Spot Post comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     SpotCommentReplyLikeResponse:
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
 *           description: Indicates whether the authenticated user currently likes the reply.
 *           example: true
 *
 *         likeCount:
 *           type: integer
 *           description: Updated total number of likes on the reply.
 *           example: 8
 *
 *
 *     SpotCommentReplyUnlikeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Reply unliked successfully.
 *
 *         liked:
 *           type: boolean
 *           example: false
 *
 *         likeCount:
 *           type: integer
 *           example: 7
 *
 *
 *     UnauthorizedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Authentication required.
 *
 *
 *     ReplyNotFoundResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Reply not found.
 */

/**
 * @swagger
 * /api/spotCommentReplyLike/spot-post-comment-reply-like/{id}:
 *   patch:
 *     summary: Like or Unlike a Spot Comment Reply
 *     description: |
 *       Toggles the authenticated user's like status on a Spot Comment Reply.
 *
 *       If the reply has **not** been liked previously:
 *       - A new like record is created.
 *       - The replyLikeCount is incremented.
 *       - `liked` is returned as **true**.
 *
 *       If the reply **has already** been liked:
 *       - The existing like record is removed.
 *       - The replyLikeCount is decremented (never below zero).
 *       - `liked` is returned as **false**.
 *
 *       This endpoint supports authentication from both:
 *       - User accounts
 *       - Spot Owner accounts
 *
 *       The authenticated account is automatically detected by the
 *       Dual Authentication Middleware.
 *
 *     tags:
 *       - Spot Comment Reply Likes
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Comment Reply ID
 *         schema:
 *           type: string
 *           example: 688d42c854ccac98f728fa18
 *
 *     responses:
 *
 *       200:
 *         description: Reply like status toggled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SpotCommentReplyLikeResponse'
 *                 - $ref: '#/components/schemas/SpotCommentReplyUnlikeResponse'
 *
 *       401:
 *         description: Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReplyNotFoundResponse'
 */