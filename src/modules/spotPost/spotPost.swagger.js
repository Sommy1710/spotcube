/**
 * @swagger
 * components:
 *   schemas:
 *
 *     GeoLocation:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: Point
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           example:
 *             - 3.3792
 *             - 6.5244
 *
 *     SpotPost:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 687cbf31234dfe5acb52fd12
 *
 *         author:
 *           type: string
 *           example: 687cbf31234dfe5acb52fd22
 *
 *         username:
 *           type: string
 *           example: spotcubeofficial
 *
 *         caption:
 *           type: string
 *           example: Beautiful sunset at Landmark Beach.
 *
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *             example: https://res.cloudinary.com/demo/image/upload/photo.jpg
 *
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *             example: https://res.cloudinary.com/demo/video/upload/video.mp4
 *
 *         location:
 *           type: string
 *           example: Landmark Beach, Lagos
 *
 *         geoLocation:
 *           $ref: '#/components/schemas/GeoLocation'
 *
 *         likeCount:
 *           type: integer
 *           example: 27
 *
 *         commentCount:
 *           type: integer
 *           example: 13
 *
 *         views:
 *           type: integer
 *           example: 110
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
 *     SpotLike:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *
 *             username:
 *               type: string
 *
 *             profilePhoto:
 *               type: string
 *
 *         userModel:
 *           type: string
 *           enum:
 *             - User
 *             - SpotOwner
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *
 *         limit:
 *           type: integer
 *
 *         total:
 *           type: integer
 *
 *         totalPage:
 *           type: integer
 *
 *         totalPages:
 *           type: integer
 *
 *         hasNextPage:
 *           type: boolean
 *
 *         hasPreviousPage:
 *           type: boolean
 *
 *
 *     FollowUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         accountType:
 *           type: string
 *           example: User
 *
 *         username:
 *           type: string
 *
 *         firstname:
 *           type: string
 *
 *         lastname:
 *           type: string
 *
 *         profilePhoto:
 *           type: string
 *
 *         bio:
 *           type: string
 *
 *         isVerified:
 *           type: boolean
 *
 *         followersCount:
 *           type: integer
 *
 *         followingCount:
 *           type: integer
 *
 *         followedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /api/spotPost/create-spotPost:
 *   post:
 *     summary: Create a new Spot Post
 *     description: |
 *       Creates a new Spot Post.
 *
 *       **Authentication Required**
 *
 *       Only Spot Owners can create Spot Posts.
 *
 *       Images are required.
 *
 *       Videos are optional.
 *
 *       Maximum video duration is 60 seconds.
 *
 *       The location is automatically geocoded into latitude and longitude.
 *
 *     tags:
 *       - Spot Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             required:
 *               - photos
 *               - location
 *
 *             properties:
 *
 *               caption:
 *                 type: string
 *                 maxLength: 2200
 *                 example: Amazing sunset today.
 *
 *               location:
 *                 type: string
 *                 example: Lekki Phase 1, Lagos
 *
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *
 *       201:
 *         description: Spot post created successfully.
 *
 *       400:
 *         description: Validation failed.
 *
 *       401:
 *         description: Authentication required.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/fetch-all-spotPosts:
 *   get:
 *     summary: Fetch all Spot Posts belonging to the authenticated Spot Owner
 *
 *     description: |
 *       Returns all Spot Posts created by the authenticated Spot Owner.
 *
 *       Results are paginated.
 *
 *     tags:
 *       - Spot Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *
 *     responses:
 *
 *       200:
 *         description: Spot posts retrieved successfully.
 *
 *       401:
 *         description: Authentication required.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/fetch-spotPost/{id}:
 *   get:
 *     summary: Fetch a single Spot Post
 *     description: |
 *       Retrieves a single Spot Post using its unique ID.
 *
 *       Only authenticated Spot Owners can access this endpoint.
 *
 *     tags:
 *       - Spot Posts
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
 *           example: 687cbf31234dfe5acb52fd12
 *
 *     responses:
 *
 *       200:
 *         description: Spot post retrieved successfully.
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
 *                   example: spot post retrieved
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     spotPost:
 *                       $ref: '#/components/schemas/SpotPost'
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: Spot post not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/update-spotPost/{id}:
 *   put:
 *     summary: Update a Spot Post
 *
 *     description: |
 *       Updates an existing Spot Post.
 *
 *       Only the owner of the Spot Post can update it.
 *
 *       Images and videos **cannot** be updated through this endpoint.
 *
 *       Only editable fields such as caption and location are accepted.
 *
 *     tags:
 *       - Spot Posts
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
 *             type: object
 *             properties:
 *
 *               caption:
 *                 type: string
 *                 maxLength: 2200
 *                 example: Updated caption.
 *
 *               location:
 *                 type: string
 *                 example: Abuja, Nigeria
 *
 *     responses:
 *
 *       200:
 *         description: Spot Post updated successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: post updated successfully
 *
 *                 data:
 *                   $ref: '#/components/schemas/SpotPost'
 *
 *       400:
 *         description: Validation failed.
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: Spot Post not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/delete-spotPost/{id}:
 *   delete:
 *     summary: Delete a Spot Post
 *
 *     description: |
 *       Deletes a Spot Post together with all associated
 *       Cloudinary images and videos.
 *
 *       Only the owner of the Spot Post can delete it.
 *
 *     tags:
 *       - Spot Posts
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
 *     responses:
 *
 *       200:
 *         description: Spot Post deleted successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: post and all associated media deleted successfully
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: Spot Post not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/like-spot-post/{id}:
 *   post:
 *     summary: Like or Unlike a Spot Post
 *
 *     description: |
 *       Toggles the like status of a Spot Post.
 *
 *       If the authenticated User or Spot Owner has already
 *       liked the post, the like is removed.
 *
 *       Otherwise a new like is added.
 *
 *     tags:
 *       - Spot Posts
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
 *     responses:
 *
 *       200:
 *         description: Like status updated successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: spot post liked successfully
 *
 *                 liked:
 *                   type: boolean
 *                   example: true
 *
 *                 likeCount:
 *                   type: integer
 *                   example: 42
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: Spot Post not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/fetch-spot-likes/{id}:
 *   get:
 *     summary: Fetch all likes for a Spot Post
 *
 *     description: |
 *       Retrieves every User and Spot Owner that has liked
 *       the specified Spot Post.
 *
 *       Results are paginated.
 *
 *       Authentication is required.
 *
 *     tags:
 *       - Spot Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Post ID
 *         schema:
 *           type: string
 *           example: 687cbf31234dfe5acb52fd12
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *
 *     responses:
 *
 *       200:
 *         description: Spot post likes retrieved successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: spot post likes retrieved successfully
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     likes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SpotLike'
 *
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *
 *       404:
 *         description: Spot Post not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/fetch-followers/{id}:
 *   get:
 *     summary: Fetch followers of a User or Spot Owner
 *
 *     description: |
 *       Returns everyone following the specified account.
 *
 *       The supplied ID may belong to either
 *       a User or a Spot Owner.
 *
 *       Authentication is required.
 *
 *       Results are paginated.
 *
 *     tags:
 *       - Spot Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: User or Spot Owner ID
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *
 *     responses:
 *
 *       200:
 *         description: Followers retrieved successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Followers retrieved successfully.
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     followers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FollowUser'
 *
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *
 *       400:
 *         description: Invalid account ID.
 *
 *       404:
 *         description: Account not found.
 *
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/spotPost/fetch-following/{id}:
 *   get:
 *     summary: Fetch accounts followed by a User or Spot Owner
 *
 *     description: |
 *       Returns every User and Spot Owner that the supplied
 *       account is currently following.
 *
 *       The ID may belong to either account type.
 *
 *       Authentication is required.
 *
 *       Results are paginated.
 *
 *     tags:
 *       - Spot Posts
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: User or Spot Owner ID
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *
 *     responses:
 *
 *       200:
 *         description: Following retrieved successfully.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Following retrieved successfully.
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     following:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FollowUser'
 *
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *
 *       400:
 *         description: Invalid account ID.
 *
 *       404:
 *         description: Account not found.
 *
 *       500:
 *         description: Internal server error.
 */