import mongoose from "mongoose";

import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;
// At least 5 characters, one uppercase, one lowercase, and one digit

export const userValidation = Joi.object({
  userName: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 5 characters long",
    }),

 
     email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base": "Please enter a strong password",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "string.empty": "Confirm Password is required",
    }),
  role: Joi.string()
    .valid("artist", "director")
    .required()
    .messages({
      "any.only": "Role must be either 'artist' or 'director'",
      "string.empty": "Role is required",
    })
});

