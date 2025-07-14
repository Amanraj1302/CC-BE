import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    typeOfProject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    castingStart: {
      type: Date,
      required: true,
    },
    castingEnd: {
      type: Date,
      required: true,
    },
    castingCity: {
      type: String,
      required: true,
    },
    castingState: {
      type: String,
      required: true,
    },
    castingCountry: {
      type: String,
      required: true,
    },

    shootingStart: {
      type: Date,
      required: true,
    },
    shootingEnd: {
      type: Date,
      required: true,
    },
    shootingCity: {
      type: String,
      required: true,
    },
    shootingState: {
      type: String,
      required: true,
    },
    shootingCountry: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    ageRange: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },

    bannerPdf: String,
    bannerImage: String,
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
