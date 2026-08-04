/**
 * @swagger
 * tags:
 *   - name: Favourites
 *     description: |
 *       APIs for managing users' favourite Spot Posts.
 *
 *       These endpoints allow authenticated Users and Spot Owners to:
 *
 *       - Save a Spot Post
 *       - Remove a Spot Post from favourites
 *       - Retrieve all favourited Spot Posts
 */

/**
 * @swagger
 * components:
 *
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authentication
 *       description: >
 *         Authentication cookie returned after a successful login.
 *
 *
 *   schemas:
 *
 *     FavouritePost:
 *       type: object
 *       properties:
 *
 *         favouriteId:
 *           type: string
 *           example: 6853c2b3bc28cfef6ad45123
 *
 *         savedAt:
 *           type: string
 *           format: date-time
 *
 *         post:
 *           type: object
 *           properties:
 *
 *             _id:
 *               type: string
 *               example: 6853c2b3bc28cfef6ad45111
 *
 *             username:
 *               type: string
 *               example: sommy_dev
 *
 *             caption:
 *               type: string
 *               example: Beautiful sunset at Lekki Beach 🌅
 *
 *             photos:
 *               type: array
 *               items:
 *                 type: string
 *
 *             videos:
 *               type: array
 *               items:
 *                 type: string
 *
 *             location:
 *               type: string
 *               example: Lekki, Lagos
 *
 *             geoLocation:
 *               type: object
 *               properties:
 *
 *                 type:
 *                   type: string
 *                   example: Point
 *
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example:
 *                     - 3.4219
 *                     - 6.4698
 *
 *             likeCount:
 *               type: integer
 *               example: 42
 *
 *             commentCount:
 *               type: integer
 *               example: 18
 *
 *             views:
 *               type: integer
 *               example: 325
 *
 *             createdAt:
 *               type: string
 *               format: date-time
 *
 *
 *     ToggleFavouriteResponse:
 *       type: object
 *       properties:
 *
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *
 *         favourited:
 *           type: boolean
 *
 *
 *     FetchFavouriteResponse:
 *       type: object
 *       properties:
 *
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Favourite spot posts retrieved successfully.
 *
 *         data:
 *           type: object
 *           properties:
 *
 *             favourites:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavouritePost'
 *
 *             pagination:
 *               type: object
 *               properties:
 *
 *                 page:
 *                   type: integer
 *                   example: 1
 *
 *                 limit:
 *                   type: integer
 *                   example: 20
 *
 *                 total:
 *                   type: integer
 *                   example: 65
 *
 *                 totalPages:
 *                   type: integer
 *                   example: 4
 *
 *                 hasNextPage:
 *                   type: boolean
 *                   example: true
 *
 *                 hasPreviousPage:
 *                   type: boolean
 *                   example: false
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
 *           example: Authentication required.
 *
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Spot post not found.
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
 * /api/favourites/favourites/{id}:
 *   patch:
 *     summary: Save or remove a Spot Post from favourites
 *
 *     description: |
 *       Toggles a Spot Post as a favourite.
 *
 *       If the Spot Post has not been favourited previously,
 *       it will be added to the authenticated user's favourites.
 *
 *       If it already exists,
 *       it will be removed.
 *
 *       This endpoint works for both Users and Spot Owners.
 *
 *     tags:
 *       - Favourites
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Spot Post ID.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Favourite status updated successfully.
 *
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               Added:
 *                 summary: Spot Post added to favourites
 *                 value:
 *                   success: true
 *                   message: Spot post added to favourites.
 *                   favourited: true
 *
 *               Removed:
 *                 summary: Spot Post removed from favourites
 *                 value:
 *                   success: true
 *                   message: Spot post removed from favourites.
 *                   favourited: false
 *
 *       401:
 *         description: Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *
 *       404:
 *         description: Spot Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

/**
 * @swagger
 * /api/favourites/fetch-favourites:
 *   get:
 *     summary: Retrieve all favourite Spot Posts
 *
 *     description: |
 *       Returns every Spot Post saved by the authenticated account.
 *
 *       Supports pagination using:
 *
 *       - page
 *       - limit
 *
 *       Results are sorted from newest to oldest.
 *
 *       Works for both Users and Spot Owners.
 *
 *     tags:
 *       - Favourites
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of records returned per page.
 *
 *     responses:
 *
 *       200:
 *         description: Favourite Spot Posts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FetchFavouriteResponse'
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