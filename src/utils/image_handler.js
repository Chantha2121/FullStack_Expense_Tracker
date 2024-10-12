import multer from "multer";
import path from "path";

// Set up storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');  // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// File filter to accept specific file types and log file information
const fileFilter = (req, file, cb) => {
    console.log('File info:', file);  // Log file details to debug
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/pjpeg"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Accept the file
    } else {
        cb(new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed."), false);  // Reject the file
    }
};

// Limit file size to 2MB
const fileSizeLimit = 1024 * 1024 * 2; // 2MB

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fileSizeLimit  // Set file size limit
    }
});
