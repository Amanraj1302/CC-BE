import { Request, Response, NextFunction } from "express";
import { ArtistInfo } from "../models/artistModel";

export const attachUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const email = req.query?.email as string;
     console.log(req.query);
     console.log(email);
    if (!email) {
      return res.status(400).json({ message: "Email is required in query params" });
    }

    let artist = await ArtistInfo.findOne({ email });
    if (!artist) {
     artist =  await ArtistInfo.create({ email });
    }

    (req as any).artistId = artist._id.toString();
    next();
  } catch (err) {
    console.error("Error in attachUserId middleware:", err);
    res.status(500).json({ message: "Server error" });
  }
};
