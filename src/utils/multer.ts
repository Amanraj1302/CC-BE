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
      const artistId = (req as any).artistId; 
      
      if (!artistId) {
        return cb(new Error("Artist ID is required"), "");
      }

      const userFolder = path.join(uploadRoot, artistId);

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

/* ----------------------------- Banner Storage ----------------------------- */
const bannerFolder = path.join(uploadRoot, "banner");

// Ensure banner folder exists
if (!fs.existsSync(bannerFolder)) {
  fs.mkdirSync(bannerFolder, { recursive: true });
}

const bannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, bannerFolder);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

