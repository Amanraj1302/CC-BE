import { Project } from "../models/projectFormModel";
import { Request, Response } from "express";
import { projectValidationSchema } from "../validation/projectValidation"; // Joi schema
import path from "path";
import fs from "fs";

export const createProject = async (req: Request, res: Response) => {
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

    // ✅ Validate request body with Joi
    const { error } = projectValidationSchema.validate(
      {
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
      },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((e) => ({
        field: e.path[0],
        message: e.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }

    // ✅ File validation
    if (
      !req.files ||
      Array.isArray(req.files) ||
      !('bannerPdf' in req.files) ||
      !('bannerImage' in req.files)
    ) {
      return res
        .status(400)
        .json({ error: "Both banner PDF and banner Image are required" });
    }

    const bannerPdfFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).bannerPdf[0];
    const bannerImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).bannerImage[0];

    if (!bannerPdfFile || !bannerImageFile) {
      return res.status(400).json({ error: "Invalid file uploads" });
    }

    // ✅ Date logical check
    if (new Date(castingEnd) < new Date(castingStart)) {
      return res
        .status(400)
        .json({ error: "Casting end date must be after casting start date" });
    }

    if (new Date(shootingEnd) < new Date(shootingStart)) {
      return res
        .status(400)
        .json({ error: "Shooting end date must be after shooting start date" });
    }

    // ✅ Create project
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
      bannerPdf: `/uploads/banner/${bannerPdfFile.filename}`, // Save PDF path
      bannerImage: `/uploads/banner/${bannerImageFile.filename}`, // Save Image path
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
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    // validation logic same as before ...

    const updateFields: any = {
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
    };

    if (req.files && !Array.isArray(req.files)) {
      if ("bannerPdf" in req.files) {
        const bannerPdfFile = (req.files as any).bannerPdf[0];
        updateFields.bannerPdf = `/uploads/banner/${bannerPdfFile.filename}`;
      }
      if ("bannerImage" in req.files) {
        const bannerImageFile = (req.files as any).bannerImage[0];
        updateFields.bannerImage = `/uploads/banner/${bannerImageFile.filename}`;
      }
    }

    const updated = await Project.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .select(
        "projectName typeOfProject description castingCity castingState castingStart castingEnd " +
        "castingCountry shootingStart shootingEnd shootingState shootingCountry role gender ageRange language bannerPdf bannerImage"
      );

    const formattedProjects = projects.map((project) => {
      const projectObj = project.toObject();

      return {
        _id: projectObj._id,
        projectName: projectObj.projectName,
        typeOfProject: projectObj.typeOfProject,
        description: projectObj.description,
        castingLocation: `${projectObj.castingState}, ${projectObj.castingCountry}`,
        castingStart: `${projectObj.castingStart}`,
        castingEnd: `${projectObj.castingEnd}`,
        shootingStart: `${projectObj.shootingStart}`,
        shootingEnd: `${projectObj.shootingEnd}`,
        shootingLocation: `${projectObj.shootingState}, ${projectObj.shootingCountry}`,
        role: projectObj.role,
        gender: projectObj.gender,
        ageRange: projectObj.ageRange,
        language: projectObj.language,
        bannerPdfUrl: projectObj.bannerPdf
          ? `http://localhost:5000${projectObj.bannerPdf}`
          : null,
        bannerImageUrl: projectObj.bannerImage
          ? `http://localhost:5000${projectObj.bannerImage}`
          : null,
      };
    });

    res.status(200).json({ projects: formattedProjects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    //delete uploaded files
    if (project.bannerImage) {
      const imagePath = path.join("uploads/banner", path.basename(project.bannerImage));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (project.bannerPdf) {
      const pdfPath = path.join("uploads/banner", path.basename(project.bannerPdf));
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
