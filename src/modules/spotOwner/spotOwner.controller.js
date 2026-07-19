import {asyncHandler} from '../../lib/util.js';
import * as authService from './auth.service.js';
import {Validator} from '../../lib/validator.js';
import {CreateSpotOwnerRequest, UpdateSpotOwnerRequest} from './create-spotOwner.request.js';
import { AuthSpotOwnerRequest } from './auth-spotOwner.request.js';
import { ValidationError, NotFoundError } from '../../lib/error-definitions.js';
import {SpotOwner} from './spotOwner.schema.js';
import {v2 as cloudinary} from 'cloudinary';
import {sendEmail} from '../../lib/emailService.js';
import { deleteSpotOwnerById } from './spotOwner.service.js';
import config from '../../config/app.config.js';
import { UnauthorizedError } from '../../lib/error-definitions.js';
import crypto from 'crypto';
//import { createNotification } from "../notifications/notification.service.js";
import {User} from "../auth/user.schema.js";
import { ProfileView } from './spotOwner.schema.js';
//import {Follow} from "./spotOwner.schema.js";




//function to generate a 4-digit OTP

function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit OTP
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateReferralCode = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
};

const generateUniqueReferralCode = async () => {
    let code;
    let exists;

    do {
        code = generateReferralCode();
        exists = await SpotOwner.findOne({referralCode: code});
    } while (exists);

    return code;
};

export const createSpotOwnerAccount = asyncHandler(async (req, res) => {
    const validator = new Validator();
    const { value, errors } = validator.validate(CreateSpotOwnerRequest, req.body);

    if (errors) {
        throw new ValidationError(
            'The request failed with the following errors',
            errors
        );
    }

    let profilePhotoUrl = '';

    if (req.file) {
        profilePhotoUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) return reject(new Error('Image upload failed'));
                    resolve(result.secure_url);
                }
            );
            uploadStream.end(req.file.buffer);
        });
    }

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const referralCode = await generateUniqueReferralCode();

    let referrer = null;
    let referrerModel = null;

    if (value.referralCode) {
        const [spotOwnerReferrer, userReferrer] = await Promise.all([
            SpotOwner.findOne({referralCode: value.referralCode}),
            User.findOne({referralCode: value.referralCode}),
        ]);

        if (spotOwnerReferrer) {
            referrer = spotOwnerReferrer;
            referrerModel = 'SpotOwner';
        } else if (userReferrer) {
            referrer = userReferrer;
            referrerModel = "User";
        } else {
            throw new ValidationError("Invalid referral code");
        }
    }

    const spotOwnerData = {
    ...value,
    profilePhoto: profilePhotoUrl,
    referralCode,
    referredBy: referrer
        ? {
              id: referrer._id,
              model: referrerModel,
          }
        : undefined,
    emailVerificationCode: otpCode,
    emailCodeExpiry: otpExpiry,
    isEmailVerified: false,
};
await authService.registerSpotOwner(spotOwnerData);

    if (referrer !== null) {
    await referrer.updateOne({
        $inc: { spotPoints: 1 }
    });
}


    /*if (referrer) {
        referrer.spotPoints += 1;
        await referrer.save()
    }*/

    try {
        await sendEmail({
            to: value.email,
            subject: 'Your verification code',
            html: `
                <p>Thank you for registering!</p>
                <p>Your verification code is: <strong>${otpCode}</strong></p>
                <p>This code expires in 10 minutes.</p>
            `
        });
        console.log('OTP email sent successfully.');
    } catch (err) {
        console.warn('Failed to send OTP email', err.message);
    }

    return res.status(201).json({
        message: 'Spot Owner registered successfully. OTP sent to email.',
        data: {
            email: value.email,
            expiresAt: otpExpiry
        }
    });
});

export const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const spotOwner = await SpotOwner.findOne({ email });
  if (!spotOwner) {
    return res.status(404).json({ message: 'Spot Owner not found.' });
  }

  if (spotOwner.isEmailVerified) {
    return res.status(400).json({ message: 'Email is already verified.' });
  }

  const now = new Date();
  if (spotOwner.emailVerificationCode !== otp || now > spotOwner.emailCodeExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  spotOwner.isEmailVerified = true;
  spotOwner.emailVerificationCode = null;
  spotOwner.emailCodeExpiry = null;

  await spotOwner.save();

  return res.status(200).json({ message: 'Email verified successfully.' });
});

export const authenticateSpotOwner = asyncHandler(async(req, res) => {
  const validator = new Validator();
  const {value, errors} = validator.validate(AuthSpotOwnerRequest, req.body);
  if (errors) throw new ValidationError('the request failed with the following errors', errors);

  const spotOwner = await SpotOwner.findOne({email: value.email});
  if (!spotOwner) {
    return res.status(404).json({message: 'Spot Owner not found'});
  }

  // check if banned 
  if (spotOwner.isBanned) {
    return res.status(403).json({
      success: false,
      massage: "Your account has been banned.",
      data: {
        bannedAt: spotOwner.bannedAt,
        reason: spotOwner.banReason
      }
    });
  }
  if (!spotOwner.isEmailVerified) {
    //generate new OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 minutes

    spotOwner.emailVerificationCode = otpCode;
    spotOwner.emailCodeExpiry = otpExpiry;
    await spotOwner.save();

    try {
      await sendEmail({
        to: spotOwner.email,
        subject: 'Verify your email',
        html: `
            <p>Your email is not verified.</p>
            <p>Your new verification code is: <strong>${otpCode}</strong></p>
            <p>This code expires in 10 minutes. </p>`
      });
      console.log('verification OTP resent');

    } catch (err) {
      console.warn('Failed to send verification email', err.message);
    }
    return res.status(403).json({
      message: 'Email not verified. A new OTP has been sent to your email.',
      data: {
        email: spotOwner.email,
        expiresAt: otpExpiry
      }
    });
  }
  const token = await authService.authenticateSpotOwner(value, req);
  res.cookie("authentication", token);
  return res.status(200).json({success: true, message: "Spot Owner successfully logged in"});

});

export const getAuthenticatedSpotOwner = asyncHandler(async(req, res) =>
{
    const spotOwner = req.spotOwner;
    return res.status(200).json({
        success: true,
        message: "Spot Owner found successfully",
        data: {
            spotOwner
        },
    });
});

export const deleteSpotOwnerAccount = asyncHandler(async (req, res) => {
  const { spotOwnerId } = req.params;
  const requester = req.spotOwner;

  // Allow if requester is admin or super admin
  const isAdmin = ['admin'].includes(requester.role);

  //  Allow if requester is deleting their own account
  const isSelf = requester.id.toString() === spotOwnerId;

  if (!isAdmin && !isSelf) {
    throw new UnauthorizedError("You are not authorized to delete this account");
  }

  const deleted = await deleteSpotOwnerById(spotOwnerId);

  res.status(200).json({
    success: true,
    message: "Spot Owner account deleted successfully"
  });
});

export const logoutSpotOwner = asyncHandler(async (req, res) => {
  res.clearCookie('authentication', {
    httpOnly: true,
    secure: config.environment === 'production',
    sameSite: 'Strict'
  });

  return res.status(200).json({ success: true, message: 'Spot Owner successfully logged out' });
});

export const deleteSpotOwnerProfilePhoto = asyncHandler(async (req, res) => {
  const requester = req.spotOwner;

  // Ensure the requester is authenticated
  if (!requester) {
    throw new UnauthorizedError("You must be logged in to delete your profile photo.");
  }

  const spotOwner = await SpotOwner.findById(requester.id);
  if (!spotOwner) {
    return res.status(404).json({ message: "Spot Owner not found." });
  }

  // Check if profile photo exists
  if (!spotOwner.profilePhoto) {
    return res.status(400).json({ message: "No profile photo to delete." });
  }

  // Extract public_id from the Cloudinary URL
  const publicIdMatch = spotOwner.profilePhoto.match(/\/([^/]+)\.[a-z]+$/);
  if (!publicIdMatch) {
    return res.status(400).json({ message: "Invalid profile photo URL." });
  }

  const publicId = publicIdMatch[1];

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    spotOwner.profilePhoto = null;
    await spotOwner.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo deleted successfully."
    });
  } catch (error) {
    console.error("Failed to delete profile photo:", error.message);
    return res.status(500).json({ message: "Failed to delete profile photo." });
  }
});


export const updateSpotOwnerAccount = asyncHandler(async (req, res) => {
  const { spotOwnerId } = req.params;
  const requester = req.spotOwner;

  //const isAdmin = ['admin'].includes(requester.role);
  const isSelf = requester.id.toString() === spotOwnerId;

  if (!isSelf) {
    throw new UnauthorizedError("You are not authorized to update this account");
  }

  const validator = new Validator();
  const { value, errors } = validator.validate(UpdateSpotOwnerRequest, req.body);

  if (errors) {
    throw new ValidationError('The request failed with the following errors', errors);
  }

  const spotOwner = await SpotOwner.findById(spotOwnerId);
  if (!spotOwner) {
    return res.status(404).json({ message: "SpotOwner not found." });
  }

  // Update allowed fields
  Object.assign(spotOwner, value);

  // Handle profile photo update
  if (req.file) {
    // Delete old photo if exists
    if (spotOwner.profilePhoto) {
      const publicIdMatch = spotOwner.profilePhoto.match(/\/([^/]+)\.[a-z]+$/);
      if (publicIdMatch) {
        const publicId = publicIdMatch[1];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    // Upload new photo
    const profilePhotoUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(new Error('Image upload failed'));
          resolve(result.secure_url);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    spotOwner.profilePhoto = profilePhotoUrl;
  }

  await spotOwner.save();

  return res.status(200).json({
    success: true,
    message: "SpotOwner updated successfully",
    data: {
      spotOwner
    }
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const spotOwner = await SpotOwner.findOne({ email });
  if (!spotOwner) {
    return res.status(404).json({ message: 'SpotOwner not found.' });
  }

  const otpCode = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  spotOwner.passwordResetCode = otpCode;
  spotOwner.passwordResetExpiry = otpExpiry;
  await spotOwner.save();

  try {
    await sendEmail({
      to: spotOwner.email,
      subject: 'Password Reset Code',
      html: `
        <p>You requested to reset your password.</p>
        <p>Your password reset code is: <strong>${otpCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't initiate this, please ignore.</p>
      `
    });
    console.log('Password reset OTP sent.');
  } catch (err) {
    console.warn('Failed to send password reset email', err.message);
  }

  return res.status(200).json({
    message: 'Password reset code sent to email.',
    data: {
      email: spotOwner.email,
      expiresAt: otpExpiry
    }
  });
});


export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
  }

  const spotOwner = await SpotOwner.findOne({ email });
  if (!spotOwner) {
    return res.status(404).json({ message: 'SpotOwner not found.' });
  }

  const now = new Date();
  if (
    spotOwner.passwordResetCode !== otp ||
    !spotOwner.passwordResetExpiry ||
    now > spotOwner.passwordResetExpiry
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  spotOwner.password = newPassword;
  spotOwner.passwordResetCode = null;
  spotOwner.passwordResetExpiry = null;

  await spotOwner.save();

  return res.status(200).json({ message: 'Password reset successfully.' });
});

export const toggleFollow = asyncHandler(async (req, res) => {
    let follower;
    let followerModel;

    // Get authenticated account ID
    const authId =
        req.user?._id ||
        req.user?.id ||
        req.spotOwner?._id ||
        req.spotOwner?.id;

    if (!authId) {
        throw new UnauthorizedError("Unauthorized.");
    }

    // Determine whether authenticated account is a User or SpotOwner
    follower = await User.findById(authId);

    if (follower) {
        followerModel = "User";
    } else {
        follower = await SpotOwner.findById(authId);

        if (!follower) {
            throw new UnauthorizedError("Authenticated account not found.");
        }

        followerModel = "SpotOwner";
    }

    const { id } = req.params;

    // Prevent following yourself
    if (follower._id.toString() === id) {
        throw new ValidationError("You cannot follow yourself.");
    }

    // Find account to follow
    let following = await User.findById(id);
    let followingModel = "User";

    if (!following) {
        following = await SpotOwner.findById(id);
        followingModel = "SpotOwner";
    }

    if (!following) {
        throw new NotFoundError("Account not found.");
    }

    // Check if already following
    const alreadyFollowing = follower.following.some(
        (item) =>
            item.accountId.toString() === following._id.toString() &&
            item.accountModel === followingModel
    );

    // ==========================
    // UNFOLLOW
    // ==========================
    if (alreadyFollowing) {

        follower.following = follower.following.filter(
            (item) =>
                !(
                    item.accountId.toString() === following._id.toString() &&
                    item.accountModel === followingModel
                )
        );

        following.followers = following.followers.filter(
            (item) =>
                !(
                    item.accountId.toString() === follower._id.toString() &&
                    item.accountModel === followerModel
                )
        );

        await Promise.all([
            follower.save(),
            following.save(),
        ]);

        return res.status(200).json({
            success: true,
            action: "unfollowed",
            message: `You have unfollowed ${following.username}.`,
        });
    }

    // ==========================
    // FOLLOW
    // ==========================
    follower.following.push({
        accountId: following._id,
        accountModel: followingModel,
    });

    following.followers.push({
        accountId: follower._id,
        accountModel: followerModel,
    });

    await Promise.all([
        follower.save(),
        following.save(),
    ]);

    return res.status(200).json({
        success: true,
        action: "followed",
        message: `You are now following ${following.username}.`,
    });
});
