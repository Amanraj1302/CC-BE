import { Router, RequestHandler } from "express";
import { upload } from "../utils/multer";
import { submitArtistProfile, professionalProfile, uploadProfile, monolouge } from "../controllers/artistController";
import { attachUserId } from "../middleware/attachUserId";
import { checkRole } from "../middleware/checkRole";
import { authentication } from "../middleware/authentication";

const router = Router();


router.post("/profile", authentication as RequestHandler, checkRole("artist") as RequestHandler, submitArtistProfile as RequestHandler);
router.put("/professional", checkRole("artist") as RequestHandler, professionalProfile as RequestHandler);
router.put("/upload", checkRole("artist") as RequestHandler, attachUserId as RequestHandler,
  upload.fields([
    { name: "headshot", maxCount: 1 },
    { name: "smilingHeadshot", maxCount: 1 },
    { name: "fullBody", maxCount: 1 },
    { name: "threeQuarter", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  uploadProfile as unknown as RequestHandler
);
router.put("/monologue", checkRole("artist") as RequestHandler, monolouge as RequestHandler);

export { router as artistRoutes };
