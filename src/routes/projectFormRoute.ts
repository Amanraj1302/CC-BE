import { Router, RequestHandler } from "express";
import { createProject } from "../controllers/projectController";   
import { uploadBanner } from "../utils/multer";


const router = Router();
router.post("/create",uploadBanner.single("banner"), createProject );


export { router as ProjectFormRoutes };
