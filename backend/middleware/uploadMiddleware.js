import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from 'cloudinary';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Temporary local storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// Generic upload handler
const handleUpload = async (files, req) => {
  try {
    const uploadPromises = files.map(file => 
      cloudinary.v2.uploader.upload(file.path, {
        folder: "Houses",
        width: 500,
        crop: "scale"
      })
    );

    const results = await Promise.all(uploadPromises);
    
    // Cleanup files
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    return results;
  } catch (error) {
    // Cleanup any remaining files on error
    files?.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    throw error;
  }
};

// Middleware for single file upload
// export const uploadSingle = (req, res, next) => {
//   upload.single('image')(req, res, async (err) => {
//     if (err) return next(err);
//     if (!req.file) return next(new Error('Please upload an image file'));

//     try {
//       req.cloudinaryResult = await handleUpload([req.file], req);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
// };

// Middleware for multiple file upload
export const uploadMultiple = (req, res, next) => {
  upload.array('images', 5)(req, res, async (err) => {
    if (err) return next(err);
    if (!req.files?.length) return next(new Error('Please upload image files'));

    try {
      req.cloudinaryResults.url = await handleUpload(req.files, req);
      next();
    } catch (error) {
      next(error);
    }
  });
};
