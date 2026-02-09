import { Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { validateFile } from '../utils/fileValidation';
import { storageService } from '../services/storageService';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600');

export const uploadFiles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        const { projectId } = req.body;

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        if (!projectId) {
            res.status(400).json({ error: 'Project ID is required' });
            return;
        }

        // Verify project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            // Clean up uploaded files
            await Promise.all(files.map(file => fs.unlink(file.path)));
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        // Validate all files
        const validationErrors: string[] = [];
        for (const file of files) {
            const validation = validateFile(file, MAX_FILE_SIZE);
            if (!validation.isValid) {
                validationErrors.push(`${file.originalname}: ${validation.error}`);
            }
        }

        if (validationErrors.length > 0) {
            // Clean up uploaded files
            await Promise.all(files.map(file => fs.unlink(file.path)));
            res.status(400).json({
                error: 'File validation failed',
                details: validationErrors
            });
            return;
        }

        // Upload all files to Supabase and save metadata to database
        const fileRecords = await Promise.all(
            files.map(async (file) => {
                const publicUrl = await storageService.uploadFile(file);

                // Clean up local temp file after upload
                await fs.unlink(file.path).catch(() => { });

                return prisma.file.create({
                    data: {
                        filename: file.originalname,
                        storedName: path.basename(publicUrl),
                        mimetype: file.mimetype,
                        size: file.size,
                        path: publicUrl, // Storing the public URL as the path
                        projectId,
                    },
                });
            })
        );

        res.status(201).json({
            message: 'Files uploaded successfully',
            files: fileRecords.map(f => ({
                id: f.id,
                filename: f.filename,
                size: f.size,
                mimetype: f.mimetype,
            })),
        });
    } catch (error) {
        console.error('Upload error:', error);

        // Clean up uploaded files on error
        if (req.files) {
            const files = req.files as Express.Multer.File[];
            await Promise.all(files.map(file =>
                fs.unlink(file.path).catch(() => { })
            ));
        }

        res.status(500).json({ error: 'File upload failed' });
    }
};

export const getFile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const filePath = path.resolve(file.path);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            res.status(404).json({ error: 'File not found on disk' });
            return;
        }

        // Set appropriate headers
        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

        // Stream file
        res.sendFile(filePath);
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({ error: 'Failed to retrieve file' });
    }
};

export const downloadFile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        // Redirect to Supabase public URL for download
        res.redirect(file.path);
    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        // Delete from Supabase
        try {
            // Assuming we need to derive the storage path from the URL 
            // or we could have stored it in storedName
            const storagePath = `projects/${file.storedName}`;
            await storageService.deleteFile(storagePath);
        } catch (error) {
            console.error('Failed to delete file from Supabase:', error);
        }

        // Delete from database
        await prisma.file.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};
