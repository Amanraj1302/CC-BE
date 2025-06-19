// controllers/artistController.ts
import { Request, Response } from "express";
import { ArtistInfo } from "../models/artistModel";
import { personalSchema, professionalSchema, uploadPhotosSchema, monologueSchema } from "../validation/artistValidation";
import path from "path";
import fs from "fs";


export const submitArtistProfile = async (req: Request, res: Response) => {
  try {
    const { error } = personalSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const {
      fullName, email, whatsapp, calling, shortBio, gender, language,
      homeCity, homeState, currentCity, currentState,
      instagram, youtube, twitter, linkedin
    } = req.body;
    console.log(req.body);
   
    const artistInfo = new ArtistInfo({
      fullName, email, whatsapp, calling, shortBio, gender, language,
      homeCity, homeState, currentCity, currentState, instagram, youtube, twitter, linkedin
    });
    await artistInfo.save();
    console.log(artistInfo);


    res.status(201).json({ message: "Artist profile created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const professionalProfile = async (req: Request, res: Response) => {
  try {
    const { error } = professionalSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const {
      email,
      talentCategory,
      height,
      age,
      screenAge,
      videoReel,
      skills,
      pastProjects
    } = req.body;

    const existingArtist = await ArtistInfo.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist profile not found. Please complete personal info first." });
    }

    existingArtist.talentCategory = talentCategory;
    existingArtist.height = height;
    existingArtist.age = age;
    existingArtist.screenAge = screenAge;
    existingArtist.videoReel = videoReel;
    existingArtist.skills = skills;
    existingArtist.pastProjects = pastProjects;

    await existingArtist.save();

    res.status(200).json({ message: "Professional profile updated successfully" });

  } catch (err) {
    console.error("Error updating talent:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Define the allowed image field names
type ImageField = "headshot" | "smilingHeadshot" | "fullBody" | "threeQuarter" | "profile";

const uploadRoot = path.join(__dirname, "../../uploads"); 

export const uploadProfile = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingArtist = await ArtistInfo.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const userId = existingArtist._id.toString();

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }

    const updateFields: Partial<Record<ImageField, string>> = {};

    const updateField = (fieldName: ImageField) => {
       const file = files[fieldName]?.[0];
        if (file) {
    const oldValue = existingArtist[fieldName as keyof typeof existingArtist];

    if (typeof oldValue === "string") {
      const oldPath = path.join(uploadRoot, oldValue);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

      updateFields[fieldName] = `${userId}/${file.filename}`;
    }
  };
  
      
      const imageFields: ImageField[] = ["headshot", "smilingHeadshot", "fullBody", "threeQuarter", "profile"];
      imageFields.forEach(updateField);

    if (Object.keys(updateFields).length > 0) {
      await ArtistInfo.updateOne(
        { _id: existingArtist._id },
        { $set: updateFields }
      );

      return res.status(200).json({
        message: "Profile images updated successfully",
        updatedFields: Object.keys(updateFields)
      });
    }

    return res.status(400).json({ message: "No valid files were uploaded" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

export const monolouge = async (req: Request, res: Response) => {
  try {
    const { error } = monologueSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const { email, haryanvi, rajasthani, bhojpuri, awadhi, maithili } = req.body;
    const existingArtist = await ArtistInfo.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    existingArtist.haryanvi = haryanvi;
    existingArtist.rajasthani = rajasthani;
    existingArtist.bhojpuri = bhojpuri;
    existingArtist.awadhi = awadhi;
    existingArtist.maithili = maithili;
    await existingArtist.save();
    res.status(200).json({ message: "Profile images uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};


