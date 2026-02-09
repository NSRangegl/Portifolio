// API Types
export interface User {
    id: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    files?: ProjectFile[];
}

export interface ProjectFile {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    createdAt: string;
}

export interface ProjectsResponse {
    projects: Project[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface UploadResponse {
    message: string;
    files: Array<{
        id: string;
        filename: string;
        size: number;
        mimetype: string;
    }>;
}

export interface ErrorResponse {
    error: string;
    details?: any;
}
