// =====================================================================================
// SPOT POST COMMENT SWAGGER DOCUMENTATION
// Base URL: /api/spotPostComment
// =====================================================================================

/**
 * @swagger
 * tags:
 *   name: Spot Post Comments
 *   description: APIs for creating and deleting comments on Spot Posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateSpotCommentRequest:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           example: This spot looks amazing 🔥
 *
 *     SpotComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 688d35b954ccac98f728f932
 *
 *         spotPost:
 *           type: string
 *           example: 688d2fbc54ccac98f728f917
 *
 *         author:
 *           type: string
 *           example: 688ab29f889caee98d4f0fd1
 *
 *         authorModel:
 *           type: string
 *           enum:
 *             - User
 *             - SpotOwner
 *           example: User
 *
 *         username:
 *           type: string
 *           example: somto_dev
 *
 *         comment:
 *           type: string
 *           example: Nice location 👏
 *
 *         commentLikeCount:
 *           type: integer
 *           example: 4
 *
 *         replyCount:
 *           type: integer
 *           example: 2
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *
 *     SpotCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Comment added successfully.
 *
 *         data:
 *           type: object
 *           properties:
 *             comment:
 *               $ref: '#/components/schemas/SpotComment'
 *
 *
 *     DeleteSpotCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Comment deleted successfully.
 *
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: The request failed with the following errors.
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
 *     ForbiddenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: You are not authorized to delete this comment.
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
 *           example: Spot post not found.
 */

/**
 * @swagger
 * /api/spotPostComment/spot-post-comment/{id}:
 *   post:
 *     summary: Create a comment on a Spot Post
 *     description: |
 *       Allows an authenticated User or Spot Owner to comment on a Spot Post.
 *
 *       The authenticated account is automatically detected by the Dual Authentication Middleware.
 *
 *       After the comment is successfully created:
 *       - A SpotComment document is created.
 *       - The SpotPost.commentCount is incremented.
 *
 *     tags:
 *       - Spot Post Comments
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Post ID
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSpotCommentRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpotCommentResponse'
 *
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *
 *       404:
 *         description: Spot post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */

/**
 * @swagger
 * /api/spotPostComment/delete-spot-post-comment/{id}:
 *   delete:
 *     summary: Delete a Spot Post Comment
 *     description: |
 *       Deletes a comment from a Spot Post.
 *
 *       Only the owner of the comment can delete it.
 *
 *       After deletion:
 *       - The SpotComment document is removed.
 *       - SpotPost.commentCount is decremented.
 *
 *     tags:
 *       - Spot Post Comments
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSpotCommentResponse'
 *
 *       401:
 *         description: Authentication required or user is not authorized
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UnauthorizedResponse'
 *                 - $ref: '#/components/schemas/ForbiddenResponse'
 *
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */