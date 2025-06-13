import express, { Router, RequestHandler } from "express";
import { upload } from "../utils/multer";
import { submitArtistProfile, professionalProfile, uploadProfile, monolouge} from "../controllers/artistController";



const router = Router();

router.post("/profile", submitArtistProfile as RequestHandler);
router.put("/professional", professionalProfile as RequestHandler);
router.put(
  "/upload",
  upload.fields([
    { name: "headshot", maxCount: 1 },
    { name: "smilingHeadshot", maxCount: 1 },
    { name: "fullBody", maxCount: 1 },
    { name: "threeQuarter", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  uploadProfile as RequestHandler
);
router.put("/monologue", monolouge as RequestHandler);

export { router as artistRoutes };
