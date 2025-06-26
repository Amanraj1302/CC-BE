import { Project } from "../models/projectFormModel";

// Create Project Controller
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
