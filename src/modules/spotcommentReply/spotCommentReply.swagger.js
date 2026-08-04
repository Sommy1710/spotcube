/**
 * @swagger
 * tags:
 *   - name: Spot Comment Reply
 *     description: APIs for creating and deleting replies to spot post comments.
 */

/**
 * --------------------------------------------------------------------
 * COMPONENT SCHEMAS
 * --------------------------------------------------------------------
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateSpotCommentReplyRequest:
 *       type: object
 *       required:
 *         - reply
 *       properties:
 *         reply:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           example: I completely agree with your opinion.
 *
 *     SpotCommentReply:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe761
 *
 *         comment:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe111
 *
 *         spotPost:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe222
 *
 *         author:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe333
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
 *           example: sommy17
 *
 *         reply:
 *           type: string
 *           example: Nice comment. I totally agree.
 *
 *         replyLikeCount:
 *           type: integer
 *           example: 0
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * --------------------------------------------------------------------
 * CREATE COMMENT REPLY
 * --------------------------------------------------------------------
 */

/**
 * @swagger
 * /api/spotCommentReply/comment-reply/{id}:
 *   post:
 *     summary: Create a reply to a spot post comment
 *     description: |
 *       Creates a reply under an existing spot post comment.
 *
 *       Authentication is required.
 *
 *       The authenticated account may be:
 *       - User
 *       - Spot Owner
 *
 *       The comment's reply count is automatically increased.
 *
 *     tags:
 *       - Spot Comment Reply
 *
 *     security:
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Comment ID
 *         schema:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe111
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSpotCommentReplyRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Reply created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Reply added successfully.
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       $ref: '#/components/schemas/SpotCommentReply'
 *
 *       400:
 *         description: Validation error.
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: Comment not found.
 *
 *       500:
 *         description: Internal server error.
 */

/**
 * --------------------------------------------------------------------
 * DELETE COMMENT REPLY
 * --------------------------------------------------------------------
 */

/**
 * @swagger
 * /api/spotCommentReply/delete-comment-reply/{id}:
 *   delete:
 *     summary: Delete a comment reply
 *     description: |
 *       Deletes an existing reply.
 *
 *       Only the owner of the reply can delete it.
 *
 *       The parent comment's reply count is automatically decreased.
 *
 *     tags:
 *       - Spot Comment Reply
 *
 *     security:
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reply ID
 *         schema:
 *           type: string
 *           example: 687b4d1f2ac912a91cbfe761
 *
 *     responses:
 *
 *       200:
 *         description: Reply deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Reply deleted successfully.
 *
 *       401:
 *         description: |
 *           Authentication failed or user is not the owner of the reply.
 *
 *       404:
 *         description: Reply not found.
 *
 *       500:
 *         description: Internal server error.
 */