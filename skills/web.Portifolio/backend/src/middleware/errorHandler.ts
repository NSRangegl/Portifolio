import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface ErrorResponse {
    error: string;
    details?: any;
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log internal error
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);

    // Zod errors (if they reach here)
    if (err instanceof z.ZodError) {
        res.status(400).json({
            error: 'Dados de entrada inválidos',
            details: err.errors
        });
        return;
    }

    // Multer errors
    if (err.message?.includes('File too large')) {
        res.status(413).json({ error: 'Arquivo muito grande (máximo 100MB)' });
        return;
    }

    if (err.message?.includes('File type')) {
        res.status(400).json({ error: 'Tipo de arquivo não permitido' });
        return;
    }

    // Authentication errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expirado' });
        return;
    }

    // Default error - Sanitized for production
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Ocorreu um erro interno no servidor'
        : err.message || 'Erro interno';

    res.status(status).json({
        error: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
