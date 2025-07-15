import mongoose from "mongoose";

const ArtistInfoSchema = new mongoose.Schema({

  fullName: String,
  email: String,
  whatsapp: String,
  calling: String,
  shortBio: String,
  gender: String,
  language: String,
  homeCity: String,
  homeState: String,
  currentCity: String,
  currentState: String,
  instagram: String,
  youtube: String,
  twitter: String,
  linkedin: String,
  talentCategory: String,
  height: String,
  age: String,
  screenAge: String,
  videoReel: String,
  skills: { type: [String] },
  pastProjects: [
    {
      projectName: String,
      role: String,
      workLink: String,
    }
  ],
  photos: {
    headshot: String,
    smilingHeadshot: String,
    fullBody: String,
    threeQuarter: String,
    profile: String,
    artistDp: String
  },
  monologues: [
    { language: String, url: String }
  ]
}, { timestamps: true });

export const ArtistInfo = mongoose.model("ArtistInfo", ArtistInfoSchema);




