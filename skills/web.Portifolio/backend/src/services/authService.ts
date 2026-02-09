import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthService {
    static async validateUser(username: string, pass: string) {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return null;

        const isValid = await bcrypt.compare(pass, user.password);
        if (!isValid) return null;

        return user;
    }

    static async registerUser(username: string, pass: string) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        return prisma.user.create({
            data: { username, password: hashedPassword },
        });
    }

    static async createSession(userId: string, username: string) {
        const accessToken = generateAccessToken({ userId, username });
        const refreshToken = generateRefreshToken({ userId, username });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return { accessToken, refreshToken };
    }

    static async refreshSession(token: string, payload: any) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return null;
        }

        return generateAccessToken({ userId: payload.userId, username: payload.username });
    }

    static async revokeSession(token: string) {
        return prisma.refreshToken.deleteMany({ where: { token } });
    }

    static async generateVerificationCode(userId: string) {
        const code = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: userId },
            data: {
                verificationCode: code,
                verificationExpires: expires,
            },
        });

        return code;
    }

    static async verifyCode(userId: string, code: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.verificationCode || !user.verificationExpires) {
            return false;
        }

        if (user.verificationCode !== code || user.verificationExpires < new Date()) {
            return false;
        }

        // Clear code after successful verification
        await prisma.user.update({
            where: { id: userId },
            data: {
                verificationCode: null,
                verificationExpires: null,
            },
        });

        return true;
    }
}
