'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FileUploader from '@/components/FileUploader';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { Plus, Loader2, Trash2, Pencil, Calendar, Tag, ChevronRight, LayoutDashboard, FileUp, FolderKanban, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewProject, setShowNewProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [deletingProject, setDeletingProject] = useState<string | null>(null);
    const [creatingProject, setCreatingProject] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tags: '',
    });

    useEffect(() => {
        if (!api.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        fetchProjects();
    }, [router]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await api.getProjects(1, 50);
            setProjects(data.projects);
        } catch (err) {
            console.error('Failed to load projects:', err);
            toast.error('Erro ao carregar projetos');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newProject.title.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        setCreatingProject(true);
        try {
            const projectData = {
                title: newProject.title,
                description: newProject.description,
                tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            if (editingProjectId) {
                const updatedProject = await api.updateProject(editingProjectId, projectData);
                setProjects(projects.map(p => p.id === editingProjectId ? updatedProject : p));
                toast.success('Projeto atualizado com sucesso!');
            } else {
                const project = await api.createProject(projectData);
                setProjects([project, ...projects]);
                toast.success('Projeto criado com sucesso!');
            }

            setNewProject({ title: '', description: '', tags: '' });
            setShowNewProject(false);
            setEditingProjectId(null);
        } catch (err) {
            console.error('Failed to save project:', err);
            toast.error(editingProjectId ? 'Erro ao atualizar projeto' : 'Erro ao criar projeto');
        } finally {
            setCreatingProject(false);
        }
    };

    const handleEditClick = (project: Project) => {
        setNewProject({
            title: project.title,
            description: project.description || '',
            tags: project.tags?.join(', ') || '',
        });
        setEditingProjectId(project.id);
        setShowNewProject(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setNewProject({ title: '', description: '', tags: '' });
        setEditingProjectId(null);
        setShowNewProject(false);
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Tem certeza que deseja excluir este projeto?')) {
            return;
        }

        setDeletingProject(projectId);
        try {
            await api.deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
            if (selectedProject === projectId) {
                setSelectedProject(null);
            }
            toast.success('Projeto excluído com sucesso!');
        } catch (err) {
            console.error('Failed to delete project:', err);
            toast.error('Erro ao excluir projeto');
        } finally {
            setDeletingProject(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-[#CCFF00] mb-4 font-black text-[10px] tracking-[0.3em] uppercase">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>{t('admin.center').split(' ')[0]} Admin</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">
                            {t('admin.center').split(' ')[0]} <span className="text-[#CCFF00]">{t('admin.center').split(' ')[1]}</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => {
                            if (showNewProject) {
                                cancelEdit();
                            } else {
                                setShowNewProject(true);
                            }
                        }}
                        className={`inline-flex items-center px-10 py-4 font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${showNewProject
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-white text-[#0A0A0A] hover:bg-[#CCFF00]'
                            }`}
                    >
                        {showNewProject ? (
                            <>
                                <X className="h-4 w-4 mr-2" />
                                {t('common.cancel') || 'Cancelar'}
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('admin.initiate')}
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Sidebar / List Section */}
                    <div className="lg:col-span-7 space-y-8">
                        {showNewProject && (
                            <div className="bg-[#141414] border border-white/5 rounded-[40px] p-10 animate-fade-in-up">
                                <h2 className="text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-10">
                                    {editingProjectId ? 'Editar Projeto' : t('admin.parameters')}
                                </h2>
                                <form onSubmit={handleFormSubmit} className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                                            {t('admin.title')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            placeholder="..."
                                            className="w-full px-6 py-5 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white font-medium focus:border-[#CCFF00]/50 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                                            {t('admin.brief')}
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            placeholder="..."
                                            className="w-full px-6 py-5 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white font-medium focus:border-[#CCFF00]/50 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                                            {t('admin.tags')}
                                        </label>
                                        <input
                                            type="text"
                                            value={newProject.tags}
                                            onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                            placeholder="SQL, PYTHON, ML"
                                            className="w-full px-6 py-5 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white font-medium focus:border-[#CCFF00]/50 transition-all outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={creatingProject}
                                        className="w-full py-5 bg-[#CCFF00] text-[#0A0A0A] font-black uppercase tracking-widest text-xs hover:bg-[#D9FF33] transition-all disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {creatingProject ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                                                ...
                                            </>
                                        ) : (
                                            editingProjectId ? 'Salvar Alterações' : t('admin.authenticate')
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="bg-[#141414] border border-white/5 rounded-[40px] p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center">
                                    <FolderKanban className="h-4 w-4 mr-3 text-[#CCFF00]" />
                                    {t('admin.database')}
                                </h2>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest px-4 py-2 bg-[#0A0A0A] border border-white/5 rounded-full">
                                    {projects.length} {t('admin.entries')}
                                </span>
                            </div>

                            {loading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <ProjectCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FolderKanban className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Sua galeria está vazia. Comece criando um novo projeto acima.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => setSelectedProject(project.id)}
                                            className={`group relative border rounded-3xl p-6 cursor-pointer transition-all duration-300 ${selectedProject === project.id
                                                ? 'bg-[#1a1a1a] border-[#CCFF00]/40'
                                                : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0 pr-8">
                                                    <h3 className="text-lg font-black text-white mb-2 truncate tracking-tighter">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-neutral-500 space-x-4">
                                                        <span className="flex items-center text-[#CCFF00]">
                                                            {project.files?.length || 0} Assets
                                                        </span>
                                                        <span>{formatDate(project.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(project);
                                                        }}
                                                        className="p-3 text-neutral-700 hover:text-[#CCFF00] hover:bg-[#CCFF00]/10 rounded-2xl transition-all"
                                                        title="Editar Projeto"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project.id);
                                                        }}
                                                        disabled={deletingProject === project.id}
                                                        className="p-3 text-neutral-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                                        title="Excluir Projeto"
                                                    >
                                                        {deletingProject === project.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel / Files Section */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-[#141414] border border-white/5 rounded-[40px] p-10">
                            <div className="flex items-center space-x-5 mb-12">
                                <div className="p-4 bg-[#CCFF00] rounded-2xl">
                                    <FileUp className="h-6 w-6 text-[#0A0A0A]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white tracking-tighter leading-tight">
                                        {t('admin.intake')}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Asset Management</p>
                                </div>
                            </div>

                            {projects.length === 0 ? (
                                <div className="py-12 px-6 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        Crie um projeto para começar a anexar seus arquivos de análise.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4 ml-1">
                                            Destination Entity
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedProject || ''}
                                                onChange={(e) => setSelectedProject(e.target.value)}
                                                className="w-full appearance-none px-6 py-5 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest focus:border-[#CCFF00]/50 transition-all outline-none cursor-pointer pr-12"
                                            >
                                                <option value="">{t('admin.identify')}</option>
                                                {projects.map((project) => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.title.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#CCFF00]">
                                                <ChevronRight className="h-4 w-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    {selectedProject && (
                                        <div className="animate-fade-in-up">
                                            <FileUploader
                                                projectId={selectedProject}
                                                onUploadComplete={fetchProjects}
                                            />
                                        </div>
                                    )}

                                    {!selectedProject && (
                                        <div className="py-12 text-center bg-[#CCFF00]/5 rounded-[32px] border border-dashed border-[#CCFF00]/20">
                                            <p className="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Identify an active entity <br /> from the index to enable assets intake.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
