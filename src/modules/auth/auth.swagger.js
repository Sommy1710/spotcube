/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: |
 *       Authentication and User Account Management APIs.
 *
 *       These endpoints allow users to:
 *       - Register
 *       - Verify email
 *       - Login
 *       - Retrieve profile
 *       - Update profile
 *       - Delete profile
 *       - Reset password
 *       - Logout
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authentication
 *       description: Authentication cookie returned after successful login.
 *
 *   schemas:
 *
 *     RegisterUserRequest:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - username
 *         - email
 *         - password
 *         - state
 *         - location
 *       properties:
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
 *         email:
 *           type: string
 *           format: email
 *           example: john@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *
 *         country:
 *           type: string
 *           default: Nigeria
 *           example: Nigeria
 *
 *         bio:
 *           type: string
 *           example: Software engineer.
 *
 *         state:
 *           type: string
 *           example: Lagos
 *
 *         location:
 *           type: string
 *           example: Lekki Phase 1
 *
 *         heardAboutUs:
 *           type: string
 *           enum:
 *             - Facebook
 *             - Instagram
 *             - TikTok
 *             - Twitter/X
 *             - Google Search
 *             - YouTube
 *             - Friend
 *             - Family
 *             - Referral
 *             - Advertisement
 *             - Other
 *
 *         referralCode:
 *           type: string
 *           example: 8AF2D912
 *
 *         profilePhoto:
 *           type: string
 *           format: binary
 *           description: Optional profile image.
 *
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@gmail.com
 *
 *         otp:
 *           type: string
 *           example: "53281"
 *
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         firstname:
 *           type: string
 *
 *         lastname:
 *           type: string
 *
 *         username:
 *           type: string
 *
 *         email:
 *           type: string
 *
 *         country:
 *           type: string
 *
 *         state:
 *           type: string
 *
 *         location:
 *           type: string
 *
 *         bio:
 *           type: string
 *
 *         profilePhoto:
 *           type: string
 *
 *         followersCount:
 *           type: integer
 *
 *         followingCount:
 *           type: integer
 *
 *         spotPoints:
 *           type: integer
 *
 *         role:
 *           type: string
 *
 *         isEmailVerified:
 *           type: boolean
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
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Request completed successfully.
 *
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *
 */
/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@gmail.com
 *
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@gmail.com
 *
 *         otp:
 *           type: string
 *           example: "48291"
 *
 *         newPassword:
 *           type: string
 *           format: password
 *           example: NewPassword123
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
 *           example: The request failed with the following errors
 *
 *         errors:
 *           type: object
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
 *           example: invalid or missing token
 *
 *
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: You are not authorized to perform this operation
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
 *           example: User not found.
 *
 *
 *     ConflictError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: A user with the provided email already exists.
 *
 *
 *     TooManyRequests:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Too many login attempts. Try again in 15 minute(s).
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
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account.
 *
 *       A verification OTP is automatically generated and sent to the user's email.
 *
 *       Supports multipart/form-data because a profile photo can be uploaded.
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *
 *     responses:
 *
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully. OTP sent to email.
 *               data:
 *                 email: john@gmail.com
 *                 expiresAt: 2026-08-06T13:00:00Z
 *
 *       400:
 *         description: Validation error.
 *
 *       409:
 *         description: Email or username already exists.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify user's email address
 *     description: |
 *       Confirms a user's email address using the OTP sent during registration.
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Email verified successfully.
 *
 *       400:
 *         description: Invalid OTP, expired OTP or email already verified.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: |
 *       Authenticates a registered user.
 *
 *       If authentication succeeds,
 *       an HttpOnly cookie named **authentication**
 *       is returned.
 *
 *       Login attempts are rate limited.
 *
 *       Maximum:
 *       - 5 attempts
 *       - every 15 minutes
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Login successful.
 *         headers:
 *           Set-Cookie:
 *             description: JWT authentication cookie.
 *             schema:
 *               type: string
 *
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: user successfully logged in
 *
 *       403:
 *         description: Email not verified.
 *
 *       404:
 *         description: User not found.
 *
 *       429:
 *         description: Too many login attempts.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: |
 *       Returns the currently authenticated user.
 *
 *       The JWT must be supplied in the
 *       **authentication** HttpOnly cookie.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - CookieAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: User retrieved successfully.
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
 *                   example: user found successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Missing or invalid authentication token.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/users/{userId}:
 *   put:
 *     summary: Update a user's profile
 *     description: |
 *       Updates the authenticated user's account.
 *
 *       Administrators may also update any user.
 *
 *       Supports profile photo upload using
 *       multipart/form-data.
 *
 *       Only the following fields may be updated:
 *
 *       - username
 *       - bio
 *       - profilePhoto
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               username:
 *                 type: string
 *                 example: johndoe
 *
 *               bio:
 *                 type: string
 *                 example: Backend Engineer.
 *
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User updated successfully
 *               data:
 *                 user:
 *                   username: johndoe
 *                   bio: Backend Engineer
 *
 *       400:
 *         description: Validation failed.
 *
 *       401:
 *         description: Authentication required.
 *
 *       403:
 *         description: User is not authorized.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/delete/{userId}:
 *   delete:
 *     summary: Delete a user account
 *     description: |
 *       Permanently deletes a user account.
 *
 *       A user may delete their own account.
 *
 *       Administrators may delete any account.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - CookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID.
 *
 *     responses:
 *
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User account deleted successfully
 *
 *       401:
 *         description: Authentication required.
 *
 *       403:
 *         description: User not authorized.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/delete-profile-photo:
 *   delete:
 *     summary: Delete the authenticated user's profile photo
 *     description: |
 *       Removes the current user's profile image
 *       from Cloudinary and clears the stored URL.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - CookieAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Profile photo deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Profile photo deleted successfully.
 *
 *       400:
 *         description: No profile photo exists or invalid Cloudinary URL.
 *
 *       401:
 *         description: Authentication required.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Failed to delete profile photo.
 *
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: |
 *       Clears the authentication cookie and
 *       logs the user out of the application.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - CookieAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User successfully logged out
 *
 *       500:
 *         description: Internal server error.
 *
 */
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset OTP
 *     description: |
 *       Sends a one-time password (OTP) to the user's
 *       registered email address.
 *
 *       The OTP expires after **10 minutes**.
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Password reset code sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset code sent to email.
 *               data:
 *                 email: john@gmail.com
 *                 expiresAt: 2026-08-10T14:00:00Z
 *
 *       400:
 *         description: Email is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       404:
 *         description: User not found.
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
 *
 */
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset account password
 *     description: |
 *       Resets a user's password using a valid OTP
 *       that was previously sent to their email.
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset successfully.
 *
 *       400:
 *         description: Invalid request, expired OTP or invalid OTP.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *       404:
 *         description: User not found.
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
 *
 */