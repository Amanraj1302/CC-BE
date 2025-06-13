// controllers/artistController.ts
import { Request, Response } from "express";
import { ArtistInfo } from "../models/artistModel";
import { personalSchema, professionalSchema, uploadPhotosSchema, monologueSchema } from "../validation/artistValidation";


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
export const uploadProfile = async (req: Request, res: Response) => {
  try {
    const { error } = uploadPhotosSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingArtist = await ArtistInfo.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files.headshot) existingArtist.headshot = files.headshot[0].filename;
    if (files.smilingHeadshot) existingArtist.smilingHeadshot = files.smilingHeadshot[0].filename;
    if (files.fullBody) existingArtist.fullBody = files.fullBody[0].filename;
    if (files.threeQuarter) existingArtist.threeQuarter = files.threeQuarter[0].filename;
    if (files.profile) existingArtist.profile = files.profile[0].filename;

    await existingArtist.save();

    res.status(200).json({ message: "Profile images uploaded successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
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


