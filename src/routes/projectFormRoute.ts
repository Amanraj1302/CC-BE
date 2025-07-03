import { Router, RequestHandler } from "express";
import { createProject, getAllProjects } from "../controllers/projectController";   
import { uploadBanner } from "../utils/multer";


const router = Router();
router.post("/create",uploadBanner.single("banner"), createProject );
router.get("/projects", getAllProjects as unknown as RequestHandler);

export { router as ProjectFormRoutes };
