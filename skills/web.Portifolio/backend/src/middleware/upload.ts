import multer from 'multer';
import path from 'path';
import { generateUniqueFilename, sanitizeFilename } from '../utils/fileValidation';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600'); // 100MB default

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Sanitize original filename
        const sanitized = sanitizeFilename(file.originalname);
        // Generate unique filename
        const uniqueName = generateUniqueFilename(sanitized);
        cb(null, uniqueName);
    },
});

// File filter for additional validation
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Basic extension check (more validation happens in controller)
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.pbix', '.csv', '.xlsx', '.xls', '.png', '.jpg', '.jpeg', '.pdf', '.txt'];

    if (allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${ext} is not allowed`));
    }
};

// Create multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: parseInt(process.env.MAX_FILES_PER_UPLOAD || '10'),
    },
});
