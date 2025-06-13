import Joi from "joi";

export const personalSchema = Joi.object({
    fullName: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Too short",
        "string.max": "Too long"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email",
        "string.empty": "Email is required"
    }),
    whatsapp: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        "string.pattern.base": "Enter a valid phone number",
        "string.empty": "WhatsApp number is required"
    }),
    calling: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        "string.pattern.base": "Enter a valid phone number",
        "string.empty": "Calling number is required"
    }),
    shortBio: Joi.string().min(10).max(300).required().messages({
        "string.min": "Too short",
        "string.max": "Too long",
        "string.empty": "Short bio is required"
    }),
    gender: Joi.string().valid("male", "female", "other").required().messages({
        "any.only": "Invalid gender",
        "string.empty": "Gender is required"
    }),
    language: Joi.string().required().messages({ "string.empty": "Language is required" }),
    homeCity: Joi.string().required().messages({ "string.empty": "Home city is required" }),
    homeState: Joi.string().required().messages({ "string.empty": "Home state is required" }),
    currentCity: Joi.string().required().messages({ "string.empty": "Current city is required" }),
    currentState: Joi.string().required().messages({ "string.empty": "Current state is required" }),
    instagram: Joi.string().uri().required().messages({
        "string.uri": "Enter a valid URL",
        "string.empty": "Instagram link is required"
    }),
    youtube: Joi.string().uri().required().messages({
        "string.uri": "Enter a valid URL",
        "string.empty": "YouTube link is required"
    }),
    twitter: Joi.string().uri().required().messages({
        "string.uri": "Enter a valid URL",
        "string.empty": "Twitter link is required"
    }),
    linkedin: Joi.string().uri().required().messages({
        "string.uri": "Enter a valid URL",
        "string.empty": "LinkedIn link is required"
    })
});

export const professionalSchema = Joi.object({
    talentCategory: Joi.string().required().messages({ "string.empty": "Talent category is required" }),
    height: Joi.string().pattern(/^\d{2,3}\s?(cm|in)?$/).required().messages({
        "string.pattern.base": "Enter valid height like 170 cm",
        "string.empty": "Height is required"
    }),
    age: Joi.number().min(1).max(100).required().messages({
        "number.base": "Age must be a number",
        "number.empty": "Age is required"
    }),
    screenAge: Joi.number().min(1).max(100).required().messages({
        "number.base": "Screen age must be a number",
        "number.empty": "Screen age is required"
    }),
    videoReel: Joi.string().uri().required().messages({
        "string.uri": "Enter a valid video URL",
        "string.empty": "Video reel link is required"
    }),
    skills: Joi.array().items(Joi.string().min(2)).min(1).required().messages({
        "array.min": "Select at least one skill"
    }),
    pastProjects: Joi.array().items(
        Joi.object({
            projectName: Joi.string().required().messages({ "string.empty": "Project name is required" }),
            role: Joi.string().required().messages({ "string.empty": "Role is required" }),
            workLink: Joi.string().uri().required().messages({
                "string.uri": "Enter a valid work link",
                "string.empty": "Work link is required"
            })
        })
    )
});

export const uploadPhotosSchema = Joi.object({
    headshot: Joi.any().required().messages({ "any.required": "Headshot is required" }),
    smilingHeadshot: Joi.any().required().messages({ "any.required": "Smiling headshot is required" }),
    fullBody: Joi.any().required().messages({ "any.required": "Full body shot is required" }),
    threeQuarter: Joi.any().required().messages({ "any.required": "Three-quarter shot is required" }),
    profile: Joi.any().optional().allow(null)
});

export const monologueSchema = Joi.object({
    haryanvi: Joi.string().uri().optional().allow(null),
    rajasthani: Joi.string().uri().optional().allow(null),
    bhojpuri: Joi.string().uri().optional().allow(null),
    awadhi: Joi.string().uri().optional().allow(null),
    maithili: Joi.string().uri().optional().allow(null)
});
