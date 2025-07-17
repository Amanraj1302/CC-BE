// controllers/artistController.ts
import { Request, Response } from "express";
import { ArtistInfo } from "../models/artistModel";
import { personalSchema, professionalSchema, uploadPhotosSchema, monologueSchema } from "../validation/artistValidation";
import path from "path";
import fs from "fs";
import { User } from "../models/userModel";
import { exit } from "process";


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

    let artistInfo = await ArtistInfo.findOne({ email }); // use email or userId if your ArtistInfo links to User

    if (artistInfo) {
      // Update existing
      artistInfo.fullName = fullName;
      artistInfo.whatsapp = whatsapp;
      artistInfo.calling = calling;
      artistInfo.shortBio = shortBio;
      artistInfo.gender = gender;
      artistInfo.language = language;
      artistInfo.homeCity = homeCity;
      artistInfo.homeState = homeState;
      artistInfo.currentCity = currentCity;
      artistInfo.currentState = currentState;
      artistInfo.instagram = instagram;
      artistInfo.youtube = youtube;
      artistInfo.twitter = twitter;
      artistInfo.linkedin = linkedin;

      await artistInfo.save();

      return res.status(200).json({ message: "Artist profile updated successfully" });
    } else {
      // Create new
      artistInfo = new ArtistInfo({
        fullName, email, whatsapp, calling, shortBio, gender, language,
        homeCity, homeState, currentCity, currentState,
        instagram, youtube, twitter, linkedin
      });
      await artistInfo.save();

      return res.status(201).json({ message: "Artist profile created successfully" });
    }
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

    const existingArtist = await ArtistInfo.findOne({ email }) as any;

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const userId = existingArtist._id.toString();

    // Get uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updatedPhotos = {} as any;

    const fields = ["headshot", "smilingHeadshot", "fullBody", "threeQuarter", "profile", "artistDp"];

    fields.forEach((field, index) => {
      const file = files[field]?.[0];
      if (file) {
        updatedPhotos[field] = `${userId}/${file.filename}`;
      } else if (existingArtist?.photos?.[field]) {
        // Preserve existing photo if no new one uploaded
        updatedPhotos[field] = existingArtist.photos[field];
      }
    });

    // Delete only replaced files
    if (existingArtist.photos?.length) {
      Object.keys(existingArtist.photos).forEach((key, idx) => {
        const oldPhoto = existingArtist.photos[key];
        const wasReplaced = updatedPhotos[idx] !== oldPhoto;
        if (wasReplaced) {
          const oldPath = path.join(uploadRoot, oldPhoto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      });
    }

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
    const { email, monologues } = req.body;

    if (!email || !monologues) {
      return res.status(400).json({ message: "Email and monologues are required" });
    }

    const existingArtist = await ArtistInfo.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    existingArtist.monologues = monologues;
    await existingArtist.save();

    if (existingUser) {
      existingUser.artistId = existingArtist._id;
      await existingUser.save();
    }

    res.status(200).json({ message: "Monologues saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllArtistProfiles = async (req: Request, res: Response) => {
  try {
    const artists = await ArtistInfo.find().select("fullName currentCity currentState talentCategory photos _id");

    const formattedArtists = artists.map(artist => {
      const artistObj = artist.toObject();
      const profileImg = artist?.photos?.artistDp;

      return {
        name: artistObj.fullName,
        _id: artistObj._id,
        location: `${artistObj.currentCity || "N/A"}, ${artistObj.currentState || "N/A"}`,
        tags: artistObj.talentCategory ? [artistObj.talentCategory] : [],
        img: profileImg ? `http://localhost:5000/uploads/${profileImg}` : null,
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

export const artistDp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let existingArtist = await ArtistInfo.findOne({ email }) as any;

    if (!existingArtist) {
      const artist = new ArtistInfo({
        email,
      });
      existingArtist = await artist.save();
    }

    const userId = existingArtist._id.toString();

    const uploadRoot = path.join(__dirname, "../../uploads");

    // Get uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Check if new DP is uploaded
    const dpFile = files?.artistDp?.[0];

    if (dpFile) {
      const newDpPath = `${userId}/${dpFile.filename}`;

      // Delete old DP if exists
      if (existingArtist.photos?.artistDp) {
        const oldDpPath = path.join(uploadRoot, existingArtist.photos.artistDp);
        if (fs.existsSync(oldDpPath)) {
          fs.unlinkSync(oldDpPath);
        }
      }

      // Replace DP (first slot)
      existingArtist.photos.artistDp = newDpPath;
    }

    await existingArtist.save();

    res.status(200).json({
      message: dpFile ? "Artist DP updated successfully" : "No new DP uploaded, keeping existing",
      dp: existingArtist.photos.artistDp || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProfile = async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };
  console.log(email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const existingArtist = await ArtistInfo.findOne({ email });

  if (!existingArtist) {
    return res.status(404).json({ message: "Artist not found" });
  }

  try {
    const profile = await ArtistInfo.findOne({ email }).select(
      "fullName email whatsapp calling shortBio gender language homeCity homeState currentCity currentState instagram youtube twitter linkedin"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {

    return res.status(500).json({ message: "Server Error", error });
  }
};
export const getProfessionalProfile = async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const profile = await ArtistInfo.findOne({ email }).select(
      "talentCategory height age screenAge videoReel skills pastProjects"
    );

    if (!profile) {
      return res.status(404).json({ message: "Professional profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching professional profile:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
export const getUploadPhotos = async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const artist = await ArtistInfo.findOne({ email }).select("photos");

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.status(200).json({ photos: artist.photos || {} });
  } catch (error) {
    console.error("Error fetching uploaded photos:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};



export const getMonologueData = async (req: Request, res: Response) => {
  const { email } = req.query as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const artist = await ArtistInfo.findOne({ email }).select(
      "monologues"
    );

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching monologue data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
export const getArtistDp = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingArtist = await ArtistInfo.findOne({ email });
    if (!existingArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const dpPath = existingArtist?.photos?.artistDp;

    if (!dpPath) {
      return res.status(404).json({ message: "No DP found for this artist" });
    }

    const absolutePath = path.join(__dirname, "../../uploads", dpPath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "DP file not found on server" });
    }

    res.status(200).json({
      message: "Artist DP fetched successfully",
      dp: dpPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
