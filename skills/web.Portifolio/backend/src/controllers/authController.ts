import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthService } from '../services/authService';
import { emailService } from '../services/emailService';
import { verifyToken } from '../utils/jwt';
import { z } from 'zod';

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        const user = await AuthService.validateUser(username, password);
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        const session = await AuthService.createSession(user.id, user.username);
        res.json({
            ...session,
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        next(error);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        // This check could also be in the service, but let's keep it here for now or move it
        const user = await AuthService.registerUser(username, password);
        const session = await AuthService.createSession(user.id, user.username);

        res.status(201).json({
            ...session,
            user: { id: user.id, username: user.username },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Usuário já existe' });
            return;
        }
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token é obrigatório' });
            return;
        }

        const payload = verifyToken(refreshToken);
        const accessToken = await AuthService.refreshSession(refreshToken, payload);

        if (!accessToken) {
            res.status(401).json({ error: 'Refresh token expirado ou inválido' });
            return;
        }

        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ error: 'Refresh token inválido' });
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await AuthService.revokeSession(refreshToken);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, code } = z.object({
            userId: z.string(),
            code: z.string().length(6),
        }).parse(req.body);

        const isValid = await AuthService.verifyCode(userId, code);
        if (!isValid) {
            res.status(401).json({ error: 'Código inválido ou expirado' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        const session = await AuthService.createSession(user.id, user.username);
        res.json({
            ...session,
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        next(error);
    }
};
