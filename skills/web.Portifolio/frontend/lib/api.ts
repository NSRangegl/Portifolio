import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
    AuthResponse,
    Project,
    ProjectsResponse,
    UploadResponse,
    ProjectFile,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.client = axios.create({
            baseURL: `${API_URL}/api`,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
            if (this.accessToken) {
                this.setAuthHeader(this.accessToken);
            }
        }

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as any;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve) => {
                            this.subscribeTokenRefresh((token: string) => {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                resolve(this.client(originalRequest));
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        this.logout();
                        return Promise.reject(error);
                    }

                    try {
                        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
                            refreshToken,
                        });

                        const newAccessToken = data.accessToken;
                        this.setAccessToken(newAccessToken);
                        this.isRefreshing = false;
                        this.onTokenRefreshed(newAccessToken);

                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.isRefreshing = false;
                        this.logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private subscribeTokenRefresh(cb: (token: string) => void) {
        this.refreshSubscribers.push(cb);
    }

    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.map((cb) => cb(token));
        this.refreshSubscribers = [];
    }

    private setAuthHeader(token: string) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    private setAccessToken(token: string) {
        this.accessToken = token;
        this.setAuthHeader(token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    }

    // Auth
    async login(username: string, password: string): Promise<{ pending2FA?: boolean; userId?: string; message?: string } & AuthResponse> {
        const { data } = await this.client.post('/auth/login', { username, password });
        if (!data.pending2FA) {
            this.setAccessToken(data.accessToken);
            if (typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        }
        return data;
    }

    async verify2FA(userId: string, code: string): Promise<AuthResponse & { refreshToken: string }> {
        const { data } = await this.client.post('/auth/verify-2fa', { userId, code });
        this.setAccessToken(data.accessToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data;
    }

    async register(username: string, password: string): Promise<AuthResponse & { refreshToken: string }> {
        const { data } = await this.client.post('/auth/register', { username, password });
        this.setAccessToken(data.accessToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data;
    }

    logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            this.client.post('/auth/logout', { refreshToken }).catch(() => { });
        }
        this.accessToken = null;
        delete this.client.defaults.headers.common['Authorization'];
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/admin/login';
        }
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    // Projects
    async getProjects(page = 1, limit = 10): Promise<ProjectsResponse> {
        const { data } = await this.client.get<ProjectsResponse>('/projects', {
            params: { page, limit },
        });
        return data;
    }

    async getProject(id: string): Promise<Project> {
        const { data } = await this.client.get<Project>(`/projects/${id}`);
        return data;
    }

    async createProject(project: {
        title: string;
        description: string;
        tags: string[];
    }): Promise<Project> {
        const { data } = await this.client.post<Project>('/projects', project);
        return data;
    }

    async updateProject(
        id: string,
        project: Partial<{ title: string; description: string; tags: string[] }>
    ): Promise<Project> {
        const { data } = await this.client.put<Project>(`/projects/${id}`, project);
        return data;
    }

    async deleteProject(id: string): Promise<void> {
        await this.client.delete(`/projects/${id}`);
    }

    // Files
    async uploadFiles(projectId: string, files: File[]): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('projectId', projectId);
        files.forEach((file) => {
            formData.append('files', file);
        });

        const { data } = await this.client.post<UploadResponse>(
            '/files/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    }

    getFileUrl(fileId: string): string {
        return `${API_URL}/api/files/${fileId}`;
    }

    getDownloadUrl(fileId: string): string {
        return `${API_URL}/api/files/${fileId}/download`;
    }

    async deleteFile(id: string): Promise<void> {
        await this.client.delete(`/files/${id}`);
    }
}

export const api = new ApiClient();
