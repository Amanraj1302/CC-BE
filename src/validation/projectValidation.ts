import Joi from "joi";

export const projectValidationSchema = Joi.object({
  projectName: Joi.string()
    .required()
    .messages({ "any.required": "Project name is required" }),

  typeOfProject: Joi.string()
    .valid("film", "ad", "web-series")
    .required()
    .messages({
      "any.required": "Type of project is required",
      "any.only": "Type of project must be one of film, ad, web-series",
    }),

  description: Joi.string()
    .required()
    .messages({ "any.required": "Description is required" }),

  castingStart: Joi.date()
    .required()
    .messages({ "any.required": "Casting start date is required" }),

  castingEnd: Joi.date()
    .required()
    .messages({ "any.required": "Casting end date is required" }),

  castingCity: Joi.string()
    .required()
    .messages({ "any.required": "Casting city is required" }),

  castingState: Joi.string()
    .required()
    .messages({ "any.required": "Casting state is required" }),

  castingCountry: Joi.string()
    .required()
    .messages({ "any.required": "Casting country is required" }),

  shootingStart: Joi.date()
    .required()
    .messages({ "any.required": "Shooting start date is required" }),

  shootingEnd: Joi.date()
    .required()
    .messages({ "any.required": "Shooting end date is required" }),

  shootingCity: Joi.string()
    .required()
    .messages({ "any.required": "Shooting city is required" }),

  shootingState: Joi.string()
    .required()
    .messages({ "any.required": "Shooting state is required" }),

  shootingCountry: Joi.string()
    .required()
    .messages({ "any.required": "Shooting country is required" }),

  role: Joi.string()
    .required()
    .messages({ "any.required": "Role is required" }),

  gender: Joi.string()
    .valid("Male", "Female")
    .required()
    .messages({
      "any.required": "Gender is required",
      "any.only": "Gender must be either Male or Female",
    }),

  ageRange: Joi.string()
    .valid("18-25", "26-40")
    .required()
    .messages({
      "any.required": "Age range is required",
      "any.only": "Age range must be either 18-25 or 26-40",
    }),

  language: Joi.string()
    .required()
    .messages({ "any.required": "Language is required" }),
});
