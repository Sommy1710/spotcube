/**
 * ============================================================
 *  NOTIFICATIONS API DOCUMENTATION
 * ============================================================
 *
 *  Base path (mounted in server.js):
 *      app.use('/api/notifications', notificationsRouter);
 *
 *  Re-uses components that already exist in your auth swagger
 *  file, so they are NOT defined again here:
 *    - CookieAuth (security scheme)
 *    - UnauthorizedError
 *    - InternalServerError
 */

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: |
 *       Notification APIs for **users** and **spot owners**.
 *
 *       Notifications are created automatically when:
 *       - A post or spot post is liked
 *       - Someone comments on a post or spot post
 *       - A comment is liked
 *       - A comment receives a reply
 *       - A reply is liked
 *       - A new follower is gained
 *
 *       ### Real-time delivery (WebSocket)
 *       In addition to this REST endpoint, notifications are pushed
 *       live over a WebSocket connection on the same host and port as the API.
 *
 *       - **Connect to:** `ws://<host>/` (or `wss://` in production)
 *       - **Authentication:** the `authentication` HttpOnly cookie is
 *         sent automatically by the browser during the handshake.
 *         If it is missing or invalid, the server closes the socket
 *         with code `1008`.
 *       - **On success the server sends:**
 *         `{ "type": "connected", "message": "Notification WebSocket connected successfully." }`
 *       - **When a notification is created the server sends:**
 *         `{ "type": "notification", "data": { ...Notification } }`
 *
 *       The REST endpoint below loads **older / saved** notifications.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique notification ID.
 *           example: 66f1c2a9e4b0a1d2c3e4f567
 *
 *         recipient:
 *           type: string
 *           description: ID of the user or spot owner who RECEIVES the notification.
 *           example: 66f1c2a9e4b0a1d2c3e4f111
 *
 *         recipientModel:
 *           type: string
 *           description: Tells you which collection `recipient` belongs to.
 *           enum:
 *             - User
 *             - SpotOwner
 *           example: User
 *
 *         sender:
 *           type: string
 *           description: ID of the user or spot owner who TRIGGERED the notification.
 *           example: 66f1c2a9e4b0a1d2c3e4f222
 *
 *         senderModel:
 *           type: string
 *           description: Tells you which collection `sender` belongs to.
 *           enum:
 *             - User
 *             - SpotOwner
 *           example: SpotOwner
 *
 *         type:
 *           type: string
 *           description: |
 *             What happened.
 *
 *             | Value | Meaning |
 *             |-------|---------|
 *             | SPOT_POST_LIKED | Someone liked a spot post |
 *             | COMMENTED_ON_SPOT_POST | Someone commented on a spot post |
 *             | NEW_FOLLOWER | Someone followed you |
 *             | COMMENT_LIKED | Someone liked your comment |
 *             | COMMENT_REPLIED | Someone replied to your comment |
 *             | REPLY_LIKED | Someone liked your reply |
 *             | NEW_SPOT_POST | A spot owner you follow made a new spot post |
 *             | NEW_POST | Someone you follow made a new post |
 *             | POST_LIKED | Someone liked your post |
 *             | COMMENTED_ON_POST | Someone commented on your post |
 *           enum:
 *             - SPOT_POST_LIKED
 *             - NEW_FOLLOWER
 *             - COMMENTED_ON_SPOT_POST
 *             - COMMENT_LIKED
 *             - COMMENT_REPLIED
 *             - REPLY_LIKED
 *             - NEW_SPOT_POST
 *             - NEW_POST
 *             - POST_LIKED
 *             - COMMENTED_ON_POST
 *           example: POST_LIKED
 *
 *         entityId:
 *           type: string
 *           description: ID of the thing the notification is about (post, comment, profile...).
 *           example: 66f1c2a9e4b0a1d2c3e4f333
 *
 *         entityModel:
 *           type: string
 *           description: Tells you which collection `entityId` belongs to. Use it to decide where to navigate on click.
 *           enum:
 *             - SpotPost
 *             - SpotOwner
 *             - User
 *             - SpotPostComment
 *             - Post
 *           example: Post
 *
 *         message:
 *           type: string
 *           description: Human readable text to display.
 *           example: johndoe liked your post
 *
 *         isRead:
 *           type: boolean
 *           description: false until the recipient marks it as read.
 *           default: false
 *           example: false
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
 *     GetNotificationsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Notifications fetched successfully.
 *
 *         total:
 *           type: integer
 *           description: Number of notifications returned.
 *           example: 2
 *
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /api/notifications/my-notifications:
 *   get:
 *     summary: Get all notifications for the logged-in account
 *     description: |
 *       Returns every notification belonging to the authenticated account,
 *       **newest first**.
 *
 *       Works for both account types. The account type is read from
 *       the `role` on the authenticated account:
 *
 *       | role | notifications returned for |
 *       |------|----------------------------|
 *       | `user` | the User collection |
 *       | anything else | the SpotOwner collection |
 *
 *       Only notifications where `recipient` equals the logged-in
 *       account's ID are returned, so one account can never see
 *       another account's notifications.
 *
 *       Authentication uses the **authentication** HttpOnly cookie
 *       set at login.
 *
 *     tags:
 *       - Notifications
 *
 *     security:
 *       - CookieAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Notifications fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetNotificationsResponse'
 *             example:
 *               success: true
 *               message: Notifications fetched successfully.
 *               total: 2
 *               notifications:
 *                 - _id: 66f1c2a9e4b0a1d2c3e4f567
 *                   recipient: 66f1c2a9e4b0a1d2c3e4f111
 *                   recipientModel: User
 *                   sender: 66f1c2a9e4b0a1d2c3e4f222
 *                   senderModel: User
 *                   type: POST_LIKED
 *                   entityId: 66f1c2a9e4b0a1d2c3e4f333
 *                   entityModel: Post
 *                   message: janedoe liked your post
 *                   isRead: false
 *                   createdAt: 2026-10-09T10:15:30.000Z
 *                   updatedAt: 2026-10-09T10:15:30.000Z
 *                 - _id: 66f1c2a9e4b0a1d2c3e4f568
 *                   recipient: 66f1c2a9e4b0a1d2c3e4f111
 *                   recipientModel: User
 *                   sender: 66f1c2a9e4b0a1d2c3e4f444
 *                   senderModel: SpotOwner
 *                   type: COMMENTED_ON_POST
 *                   entityId: 66f1c2a9e4b0a1d2c3e4f333
 *                   entityModel: Post
 *                   message: cafe_lekki commented on your post
 *                   isRead: true
 *                   createdAt: 2026-10-08T18:02:11.000Z
 *                   updatedAt: 2026-10-08T19:40:00.000Z
 *
 *       401:
 *         description: Missing or invalid authentication cookie.
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