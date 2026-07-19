import Joi from "joi";

export const CreateSpotOwnerRequest = Joi.object({ 
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(32).required(),
    country: Joi.string().default("Nigeria"),
    bio: Joi.string().max(500).optional(),
    state: Joi.string()
    .valid(
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara"
    )
    .required(),
    location: Joi.string().required(),
    heardAboutUs: Joi.string()
    .valid(
        "Facebook",
        "Instagram",
        "TikTok",
        "Twitter/X",
        "Google Search",
        "YouTube",
        "Friend",
        "Family",
        "Referral",
        "Advertisement",
        "Other"
    )
    .default("Other"),
    referralCode: Joi.string().trim().uppercase().optional(),
    profilePhoto: Joi.string().uri().optional(),
});

export const UpdateSpotOwnerRequest = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  bio: Joi.string().max(500).optional(),
  profilePhoto: Joi.string().uri().optional(),
}).or('username', 'profilePhoto', 'bio'); // Ensures at least one field is provided


export const ChangeSpotOwnerPasswordRequest = Joi.object({
  oldPassword: Joi.string().min(6).max(32).required(),
  newPassword: Joi.string().min(6).max(32).required(),
});