// controllers/artistController.ts
import { Request, Response } from "express";
import { ArtistInfo } from "../models/artistModel";
import { personalSchema, professionalSchema, uploadPhotosSchema, monologueSchema } from "../validation/artistValidation";
import path from "path";
import fs from "fs";
import { User } from "../models/userModel";


export const submitArtistProfile = async (req: Request, res: Response) => {
  try {
    const { error } = personalSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      email, talentCategory,
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

    // Get uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

// Normalize uploaded file paths
const updatedPhotos: string[] = [];

["headshot", "smilingHeadshot", "fullBody", "threeQuarter", "profile"].forEach((field) => {
  const file = files[field]?.[0];
  if (file) {
    updatedPhotos.push(`${userId}/${file.filename}`);
  }
});

// Optionally remove old ones
if (existingArtist.photos?.length) {
  for (const oldPhoto of existingArtist.photos) {
    const oldPath = path.join(uploadRoot, oldPhoto);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }
}

// Save new photo references
existingArtist.photos = updatedPhotos;
await existingArtist.save();


    res.status(200).json({
      message: "Photos uploaded successfully",
      photos: updatedPhotos,
    });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
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
    const existingUser = await User.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

existingArtist.monologues = [
  { language: "Haryanvi", url: haryanvi },
  { language: "Rajasthani", url: rajasthani },
  { language: "Bhojpuri", url: bhojpuri },
  { language: "Awadhi", url: awadhi },
  { language: "Maithili", url: maithili }
] as any;
await existingArtist.save();

if (existingUser) {
  existingUser.artistId = existingArtist._id;
  await existingUser.save();
}

res.status(200).json({ message: "Profile images uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};

export const getAllArtistProfiles = async (req: Request, res: Response) => {
  try {
    const artists = await ArtistInfo.find().select("fullName currentCity currentState talentCategory headshot _id");

    const formattedArtists = artists.map(artist => {
      const artistObj = artist.toObject();
      return {
        name: artistObj.fullName,
        _id: artistObj._id,
        location: `${artistObj.currentCity || "N/A"}, ${artistObj.currentState || "N/A"}`,
        tags: artistObj.talentCategory ? [artistObj.talentCategory] : [],
        img: artistObj.photos && artistObj.photos.length > 0 ? `http://localhost:5000/uploads/${artistObj.photos[0]}` : null,
      };
    });

    res.status(200).json(formattedArtists);
  } catch (err) {
    console.error("Error fetching artist profiles:", err);
    res.status(500).json({ message: "Failed to fetch artist profiles" });
  }
};


export const getArtistByEmail = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const artist = await ArtistInfo.findOne({ _id });

    if (!artist) return res.status(404).json({ message: "Artist not found" });

    res.status(200).json(artist);
  } catch (err) {
    console.error("Failed to fetch artist:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const editsubmitArtistProfile = async (req: Request, res: Response) => {
  try {
    const { error } = personalSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      fullName, email, whatsapp, calling, shortBio, gender, language,
      homeCity, homeState, currentCity, currentState,
      instagram, youtube, twitter, linkedin
    } = req.body;
    console.log(req.body);
   
    const existingArtist = await ArtistInfo.findOne({ email });
    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    existingArtist.fullName = fullName;
    existingArtist.email = email;
    existingArtist.whatsapp = whatsapp;
    existingArtist.calling = calling;
    existingArtist.shortBio = shortBio;
    existingArtist.gender = gender;
    existingArtist.language = language;
    existingArtist.homeCity = homeCity;
    existingArtist.homeState = homeState;
    existingArtist.currentCity = currentCity;
    existingArtist.currentState = currentState;
    existingArtist.instagram = instagram;
    existingArtist.youtube = youtube;
    existingArtist.twitter = twitter;
    existingArtist.linkedin = linkedin;
    await existingArtist.save();


    res.status(201).json({ message: "Artist profile created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};