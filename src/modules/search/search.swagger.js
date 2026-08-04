/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: |
 *       Global search endpoints.
 *
 *       This endpoint searches across:
 *       - Users
 *       - Spot Owners
 *       - Spot Posts
 *
 *       The response groups results into separate collections.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authentication
 *       description: >
 *         Authentication cookie returned after a successful login.
 *
 *   schemas:
 *
 *     SearchUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 66a0c8dff8b54c7347fa2f11
 *
 *         firstname:
 *           type: string
 *           example: John
 *
 *         lastname:
 *           type: string
 *           example: Doe
 *
 *         username:
 *           type: string
 *           example: johndoe
 *
 *         profilePhoto:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/profile.jpg
 *
 *         bio:
 *           type: string
 *           example: Backend Developer
 *
 *
 *     SearchSpotOwner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 66a0c8dff8b54c7347fa2f12
 *
 *         username:
 *           type: string
 *           example: lagosfoods
 *
 *         profilePhoto:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/shop.jpg
 *
 *         bio:
 *           type: string
 *           example: The best food vendor in Lagos.
 *
 *         isVerified:
 *           type: boolean
 *           example: true
 *
 *
 *     SearchSpotPost:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 66a0c8dff8b54c7347fa2f13
 *
 *         author:
 *           type: string
 *           example: 66a0c8dff8b54c7347fa2f12
 *
 *         username:
 *           type: string
 *           example: lagosfoods
 *
 *         caption:
 *           type: string
 *           example: Fresh Suya available today 🔥
 *
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *
 *         location:
 *           type: string
 *           example: Lagos
 *
 *         geoLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: Point
 *
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example:
 *                 - 3.3792
 *                 - 6.5244
 *
 *         likeCount:
 *           type: integer
 *           example: 103
 *
 *         commentCount:
 *           type: integer
 *           example: 27
 *
 *         views:
 *           type: integer
 *           example: 800
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Search completed successfully.
 *
 *         data:
 *           type: object
 *           properties:
 *
 *             users:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchUser'
 *
 *             spotOwners:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 1
 *
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchSpotOwner'
 *
 *             spotPosts:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 5
 *
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchSpotPost'
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
 *           example: Search query is required.
 *
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Invalid or missing authentication token.
 *
 *
 *     InternalServerError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Internal server error.
 */


/**
 * @swagger
 * /api/search/search:
 *   get:
 *     summary: Global Search
 *     description: |
 *       Searches the application for:
 *
 *       - Users (firstname, lastname, username)
 *       - Spot Owners (username)
 *       - Spot Posts (caption)
 *
 *       The search is case-insensitive and returns
 *       three separate result groups.
 *
 *       A maximum of **30 results** can be returned
 *       per category.
 *
 *     tags:
 *       - Search
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Search keyword.
 *         schema:
 *           type: string
 *           example: john
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         description: |
 *           Maximum number of results returned
 *           for each category.
 *
 *           Default: 10
 *
 *           Maximum: 30
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 30
 *           minimum: 1
 *
 *     responses:
 *
 *       200:
 *         description: Search completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *
 *       400:
 *         description: Missing search query.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       401:
 *         description: Authentication required.
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