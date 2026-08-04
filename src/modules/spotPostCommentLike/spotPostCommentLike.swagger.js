// =====================================================================================
// SPOT POST COMMENT LIKE SWAGGER DOCUMENTATION
// Base URL: /api/spotPostCommentLike
// =====================================================================================

/**
 * @swagger
 * tags:
 *   name: Spot Comment Likes
 *   description: APIs for liking and unliking Spot Post comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     SpotCommentLikeResponse:
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
 *           description: Indicates whether the authenticated user currently likes the comment.
 *           example: true
 *
 *         likeCount:
 *           type: integer
 *           description: Updated total number of likes on the comment.
 *           example: 15
 *
 *
 *     SpotCommentUnlikeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Comment unliked successfully.
 *
 *         liked:
 *           type: boolean
 *           example: false
 *
 *         likeCount:
 *           type: integer
 *           example: 14
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
 *     NotFoundResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Comment not found.
 */

/**
 * @swagger
 * /api/spotPostCommentLike/spot-post-comment-like/{id}:
 *   patch:
 *     summary: Like or Unlike a Spot Post Comment
 *     description: |
 *       Toggles the authenticated user's like status on a Spot Post comment.
 *
 *       If the comment has **not** been liked previously:
 *       - A new like is created.
 *       - The commentLikeCount is incremented.
 *       - `liked` is returned as **true**.
 *
 *       If the comment **has already** been liked:
 *       - The existing like is removed.
 *       - The commentLikeCount is decremented (never below zero).
 *       - `liked` is returned as **false**.
 *
 *       This endpoint works for both:
 *       - User accounts
 *       - Spot Owner accounts
 *
 *       The authenticated account is automatically determined by the
 *       Dual Authentication Middleware.
 *
 *     tags:
 *       - Spot Comment Likes
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Comment ID
 *         schema:
 *           type: string
 *           example: 688d35b954ccac98f728f932
 *
 *     responses:
 *
 *       200:
 *         description: Comment like status toggled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SpotCommentLikeResponse'
 *                 - $ref: '#/components/schemas/SpotCommentUnlikeResponse'
 *
 *       401:
 *         description: User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */