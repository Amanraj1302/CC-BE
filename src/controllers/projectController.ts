import { Project } from "../models/projectFormModel";
import { Request, Response } from "express";

export const createProject = async (req: any, res: any) => {

  try {
    const {
      projectName,
      typeOfProject,
      description,
      castingStart,
      castingEnd,
      castingCity,
      castingState,
      castingCountry,
      shootingStart,
      shootingEnd,
      shootingCity,
      shootingState,
      shootingCountry,
      role,
      gender,
      ageRange,
      language,
    } = req.body;

    // File validation
    if (!req.file) {
      return res.status(400).json({ error: "Banner file is required" });
    }

    // Date Validation
    if (new Date(castingEnd) < new Date(castingStart)) {
      return res.status(400).json({ error: "Casting end date must be after casting start date" });
    }
    if (new Date(shootingEnd) < new Date(shootingStart)) {
      return res.status(400).json({ error: "Shooting end date must be after shooting start date" });
    }

    const newProject = new Project({
      projectName,
      typeOfProject,
      description,
      castingStart,
      castingEnd,
      castingCity,
      castingState,
      castingCountry,
      shootingStart,
      shootingEnd,
      shootingCity,
      shootingState,
      shootingCountry,
      role,
      gender,
      ageRange,
      language,
      banner: `/uploads/banner/${req.file.filename}`, // save banner file path
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .select(
        "projectName typeOfProject description castingCity castingState castingStart castingEnd " +
        "castingCountry shootingStart shootingEnd  shootingState shootingCountry role gender ageRange language banner"
      );

    const formattedProjects = projects.map((project) => {
      const projectObj = project.toObject();

      return {
        _id: projectObj._id,
        projectName: projectObj.projectName,
        typeOfProject: projectObj.typeOfProject,
        description: projectObj.description,
        castingLocation: ` ${projectObj.castingState}, ${projectObj.castingCountry}`,
        castingStart: `${projectObj.castingStart}`,
        castingEnd: `${projectObj.castingEnd}`,
        shootingStart: `${projectObj.shootingStart}`,
        shootingEnd: ` ${projectObj.shootingEnd}`,
        shootingLocation: ` ${projectObj.shootingState}, ${projectObj.shootingCountry}`,
        role: projectObj.role,
        gender: projectObj.gender,
        ageRange: projectObj.ageRange,
        language: projectObj.language,
        banner: projectObj.banner
          ? `http://localhost:5000${projectObj.banner}`
          : null,
      };
    });

    res.status(200).json({ projects: formattedProjects }); // ✅ wrap in `{ projects: … }`
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
