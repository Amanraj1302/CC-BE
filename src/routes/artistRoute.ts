import { Router, RequestHandler } from "express";
import { upload } from "../utils/multer";
import {
  submitArtistProfile, professionalProfile, uploadProfile,
  monolouge, getAllArtistProfiles, getArtistByEmail, editsubmitArtistProfile,
  artistDp, getProfile, getProfessionalProfile, getUploadPhotos
  , getMonologueData
} from "../controllers/artistController";
import { attachUserId } from "../middleware/attachUserId";
import { checkRole } from "../middleware/checkRole";
import { authentication } from "../middleware/authentication";

const router = Router();


router.post("/profile", authentication as RequestHandler, checkRole("artist") as RequestHandler, submitArtistProfile as RequestHandler);
router.put("/profile", authentication as RequestHandler, checkRole("artist") as RequestHandler, editsubmitArtistProfile as RequestHandler);
router.post("/artistDp", authentication as RequestHandler, checkRole("artist") as RequestHandler, attachUserId as RequestHandler,
  upload.fields([
    { name: "artistDp", maxCount: 1 }
  ]),
  artistDp as RequestHandler);
router.put("/professional", authentication as RequestHandler, checkRole("artist") as RequestHandler, professionalProfile as RequestHandler);
router.put(
  "/upload",
  authentication as RequestHandler,
  checkRole("artist") as RequestHandler,
  attachUserId as RequestHandler,
  upload.fields([
    { name: "headshot", maxCount: 1 },
    { name: "smilingHeadshot", maxCount: 1 },
    { name: "fullBody", maxCount: 1 },
    { name: "threeQuarter", maxCount: 1 },
    { name: "profile", maxCount: 1 }
  ]),
  uploadProfile as unknown as RequestHandler
);

router.put("/monologue", checkRole("artist") as RequestHandler, monolouge as RequestHandler);
router.get("/artists", getAllArtistProfiles);
router.get('/profile', authentication as RequestHandler, getProfile as unknown as RequestHandler);
router.get("/professional", authentication as RequestHandler, getProfessionalProfile as unknown as RequestHandler);
router.get("/upload", authentication as RequestHandler, attachUserId as RequestHandler, getUploadPhotos as unknown as RequestHandler);
router.get("/monologue", authentication as RequestHandler, attachUserId as RequestHandler, getMonologueData as unknown as RequestHandler);
router.get("/:_id", getArtistByEmail as RequestHandler);


export { router as artistRoutes };
