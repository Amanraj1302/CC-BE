import { Router, RequestHandler } from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controllers/projectController";   
import { uploadBanner } from "../utils/multer";


const router = Router();
router.post("/create",uploadBanner, createProject as unknown as RequestHandler);
router.get("/projects", getAllProjects as unknown as RequestHandler);
router.put("/update/:id",uploadBanner, updateProject as unknown as RequestHandler);
router.get("/:id", getProjectById as unknown as RequestHandler);
router.delete("/:id", deleteProject as unknown as RequestHandler);

export { router as ProjectFormRoutes };
