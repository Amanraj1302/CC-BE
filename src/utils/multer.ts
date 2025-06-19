import multer from "multer";
import path from "path";
import fs from "fs";

const uploadRoot = "uploads/";

// the root upload directory exists
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = (req as any).userId; 
      if (!userId) {
        return cb(new Error("User ID is required"), "");
      }

      const userFolder = path.join(uploadRoot, userId);

      // check if user-specific folder exists (don't delete old images)
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      cb(null, userFolder);
    } catch (err) {
      cb(err as Error, "");
    }
  },

  filename: (_req, file, cb) => {
  const ext = path.extname(file.originalname); // Get file extension
  const fixedName = `${file.fieldname}${ext}`; // Always same name, e.g., avatar.png
  cb(null, fixedName);
},
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"));
    }
  },
});
