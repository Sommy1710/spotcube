/**
 * @swagger
 * tags:
 *   - name: SpotOwner
 *     description: Spot Owner Authentication, Profile and Follow APIs
 */

/**
 * @swagger
 * /api/spotOwner/register:
 *   post:
 *     summary: Register a new Spot Owner
 *     tags: [SpotOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - state
 *               - location
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               state:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               heardAboutUs:
 *                 type: string
 *                 example: Facebook
 *               referralCode:
 *                 type: string
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Spot Owner registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email or username already exists
 */

/**
 * @swagger
 * /api/spotOwner/verify:
 *   post:
 *     summary: Verify Spot Owner email using OTP
 *     tags: [SpotOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: Spot Owner not found
 */

/**
 * @swagger
 * /api/spotOwner/login:
 *   post:
 *     summary: Login Spot Owner
 *     tags: [SpotOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: Email not verified or account banned
 *       404:
 *         description: Spot Owner not found
 */

/**
 * @swagger
 * /api/spotOwner/user:
 *   get:
 *     summary: Get authenticated Spot Owner
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated Spot Owner
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/spotOwner/delete/{spotOwnerId}:
 *   delete:
 *     summary: Delete Spot Owner account
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: spotOwnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Spot Owner not found
 */

/**
 * @swagger
 * /api/spotOwner/delete-profile-photo:
 *   delete:
 *     summary: Delete authenticated Spot Owner profile photo
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/spotOwner/spotOwners/{spotOwnerId}:
 *   put:
 *     summary: Update Spot Owner account
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: spotOwnerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Spot Owner updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Spot Owner not found
 */

/**
 * @swagger
 * /api/spotOwner/forgot-password:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [SpotOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset code sent
 *       404:
 *         description: Spot Owner not found
 */

/**
 * @swagger
 * /api/spotOwner/reset-password:
 *   post:
 *     summary: Reset Spot Owner password
 *     tags: [SpotOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/spotOwner/follow/{id}:
 *   post:
 *     summary: Follow or unfollow a User or Spot Owner
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User or Spot Owner ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow status toggled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */

/**
 * @swagger
 * /api/spotOwner/logout:
 *   post:
 *     summary: Logout Spot Owner
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/spotOwner/fetch-profile/{id}:
 *   get:
 *     summary: Fetch a User or Spot Owner profile
 *     tags: [SpotOwner]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User or Spot Owner ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 */