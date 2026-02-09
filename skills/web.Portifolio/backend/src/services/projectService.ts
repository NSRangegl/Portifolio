import prisma from '../config/database';
import { CreateProjectInput } from '../validators/schemas';

export class ProjectService {
    static async getAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    files: {
                        select: {
                            id: true,
                            filename: true,
                            mimetype: true,
                            size: true,
                            createdAt: true,
                        },
                    },
                },
            }),
            prisma.project.count(),
        ]);

        return {
            projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    static async getById(id: string) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                files: {
                    select: {
                        id: true,
                        filename: true,
                        mimetype: true,
                        size: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    static async create(data: any) {
        return prisma.project.create({
            data,
            include: { files: true },
        });
    }

    static async update(id: string, data: any) {
        return prisma.project.update({
            where: { id },
            data,
            include: { files: true },
        });
    }

    static async delete(id: string) {
        return prisma.project.delete({
            where: { id },
        });
    }
}
