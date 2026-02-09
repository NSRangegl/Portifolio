import { Router } from 'express';
import { uploadFiles, getFile, downloadFile, deleteFile } from '../controllers/fileController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Upload files (protected)
router.post('/upload', authMiddleware, upload.array('files', 10), uploadFiles);

// Get/download files (public for viewing, can be made protected if needed)
router.get('/:id', getFile);
router.get('/:id/download', downloadFile);

// Delete file (protected)
router.delete('/:id', authMiddleware, deleteFile);

export default router;
