import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { z } from 'zod';

const createProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    tags: z.array(z.string()).default([]),
});

const updateProjectSchema = createProjectSchema.partial();

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await ProjectService.getAll(page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await ProjectService.getById(req.params.id as string);
        if (!project) {
            res.status(404).json({ error: 'Projeto não encontrado' });
            return;
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = createProjectSchema.parse(req.body);
        const project = await ProjectService.create(data);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = updateProjectSchema.parse(req.body);
        const project = await ProjectService.update(req.params.id as string, data);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await ProjectService.delete(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
