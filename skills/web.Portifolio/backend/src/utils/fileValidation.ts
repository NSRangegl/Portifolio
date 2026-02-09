import path from 'path';
import { z } from 'zod';

// Allowed file extensions (whitelist)
const ALLOWED_EXTENSIONS = [
    '.pbix',  // Power BI
    '.csv',   // CSV
    '.xlsx',  // Excel
    '.xls',   // Excel (old)
    '.png',   // Image
    '.jpg',   // Image
    '.jpeg',  // Image
    '.pdf',   // PDF
    '.txt',   // Text
] as const;

// MIME type mapping for validation
const MIME_TYPE_MAP: Record<string, string[]> = {
    '.pbix': ['application/octet-stream', 'application/x-zip-compressed'],
    '.csv': ['text/csv', 'application/vnd.ms-excel'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.xls': ['application/vnd.ms-excel'],
    '.png': ['image/png'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.pdf': ['application/pdf'],
    '.txt': ['text/plain'],
};

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates file extension against whitelist
 */
export const validateFileExtension = (filename: string): FileValidationResult => {
    const ext = path.extname(filename).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
        return {
            isValid: false,
            error: `File type ${ext} is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
        };
    }

    return { isValid: true };
};

/**
 * Validates MIME type matches the file extension
 */
export const validateMimeType = (filename: string, mimetype: string): FileValidationResult => {
    const ext = path.extname(filename).toLowerCase();
    const allowedMimes = MIME_TYPE_MAP[ext];

    if (!allowedMimes) {
        return {
            isValid: false,
            error: `No MIME type mapping found for ${ext}`,
        };
    }

    if (!allowedMimes.includes(mimetype)) {
        return {
            isValid: false,
            error: `MIME type ${mimetype} does not match expected types for ${ext}: ${allowedMimes.join(', ')}`,
        };
    }

    return { isValid: true };
};

/**
 * Validates file size
 */
export const validateFileSize = (size: number, maxSize: number): FileValidationResult => {
    if (size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        const fileSizeMB = (size / (1024 * 1024)).toFixed(2);
        return {
            isValid: false,
            error: `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB`,
        };
    }

    return { isValid: true };
};

/**
 * Sanitizes filename to prevent path traversal and other attacks
 */
export const sanitizeFilename = (filename: string): string => {
    // Remove any path components
    const basename = path.basename(filename);

    // Remove special characters except dots, dashes, and underscores
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return sanitized;
};

/**
 * Generates a unique filename using UUID
 */
export const generateUniqueFilename = (originalFilename: string): string => {
    const ext = path.extname(originalFilename);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    return `${timestamp}-${random}${ext}`;
};

/**
 * Complete file validation
 */
export const validateFile = (
    file: Express.Multer.File,
    maxSize: number
): FileValidationResult => {
    // Validate extension
    const extValidation = validateFileExtension(file.originalname);
    if (!extValidation.isValid) return extValidation;

    // Validate MIME type
    const mimeValidation = validateMimeType(file.originalname, file.mimetype);
    if (!mimeValidation.isValid) return mimeValidation;

    // Validate size
    const sizeValidation = validateFileSize(file.size, maxSize);
    if (!sizeValidation.isValid) return sizeValidation;

    return { isValid: true };
};
