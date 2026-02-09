'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CSVViewer from '@/components/CSVViewer';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { Download, Calendar, Tag, Loader2, ArrowLeft, ExternalLink, FileText, Image as ImageIcon, Database } from 'lucide-react';
import { formatDate, formatFileSize, getFileIcon, isCSVFile, isImageFile, isPowerBIFile } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectPage() {
    const { t } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const data = await api.getProject(id);
                setProject(data);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.message || 'Falha ao carregar o projeto');
                toast.error('Erro ao carregar detalhes do projeto');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-[#CCFF00]" />
                    <p className="text-neutral-500 animate-pulse font-black uppercase tracking-widest text-xs">Processing Data...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="bg-[#141414] rounded-[32px] p-12 border border-white/5 shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">Resource Not Found</h2>
                        <p className="text-neutral-500 mb-8 font-medium">{error || "The requested data project could not be located."}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-10 py-4 bg-[#CCFF00] text-[#0A0A0A] font-black uppercase tracking-widest text-xs hover:bg-[#D9FF33] transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t('projectDetails.back').split(' ')[0]}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            {/* Professional Project Header */}
            <div className="relative pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-12 inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-3 w-3 mr-2 transition-transform group-hover:-translate-x-1" />
                        {t('projectDetails.back')}
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-8 animate-fade-in-up">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-8 h-[1px] bg-[#CCFF00]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">
                                    {t('projectDetails.caseStudy')}
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-[80px] font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 mb-12">
                                <div className="flex items-center text-neutral-400">
                                    <div className="w-2 h-2 bg-[#CCFF00] rounded-full mr-3"></div>
                                    <span className="text-xs font-black uppercase tracking-widest">{formatDate(project.createdAt)}</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CCFF00] opacity-60"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="max-w-3xl">
                                <p className="text-xl text-neutral-300 leading-relaxed font-medium whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <div className="bg-[#141414] border border-white/5 rounded-[40px] p-10 space-y-10">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center">
                                        <Database className="h-4 w-4 mr-3 text-[#CCFF00]" />
                                        {t('projectDetails.ledger')}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b border-white/5">
                                            <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{t('projectDetails.assets')}</span>
                                            <span className="text-white font-black">{project.files?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-4 border-b border-white/5">
                                            <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{t('projectDetails.released')}</span>
                                            <span className="text-white font-black text-xs">{formatDate(project.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href="#arquivos"
                                    className="block w-full text-center py-5 bg-white text-[#0A0A0A] font-black uppercase tracking-widest text-xs hover:bg-[#CCFF00] transition-all"
                                >
                                    {t('projectDetails.access')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Assets Section */}
            <section id="arquivos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-white/5">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        {t('projectDetails.dataAssets')}
                    </h2>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">
                        {t('projectDetails.vault')}: {project.files?.length || 0}
                    </div>
                </div>

                {project.files && project.files.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {project.files.map((file) => {
                            const isCSV = isCSVFile(file.mimetype);
                            const isImg = isImageFile(file.mimetype);
                            const isPBI = isPowerBIFile(file.filename);

                            return (
                                <div
                                    key={file.id}
                                    className="group bg-[#141414] border border-white/5 rounded-[32px] p-8 hover:border-[#CCFF00]/40 transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="p-4 bg-[#0A0A0A] rounded-2xl border border-white/5 group-hover:border-[#CCFF00]/20 transition-colors text-neutral-500 group-hover:text-[#CCFF00]">
                                            {isImg ? <ImageIcon className="h-6 w-6" /> :
                                                isPBI ? <Database className="h-6 w-6" /> :
                                                    <FileText className="h-6 w-6" />}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">
                                                {file.mimetype.split('/')[1]?.toUpperCase() || 'DATA'}
                                            </p>
                                            <p className="text-[10px] font-black text-white">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-8">
                                        <h4 className="text-lg font-black text-white truncate mb-2" title={file.filename}>
                                            {file.filename}
                                        </h4>
                                        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                                            INDEXED: {formatDate(file.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-white/5">
                                        {isCSV && (
                                            <CSVViewer
                                                fileUrl={api.getFileUrl(file.id)}
                                                filename={file.filename}
                                            />
                                        )}

                                        {isImg && (
                                            <a
                                                href={api.getFileUrl(file.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white hover:text-[#CCFF00] transition-colors"
                                            >
                                                {t('projectDetails.preview')}
                                            </a>
                                        )}

                                        <a
                                            href={api.getDownloadUrl(file.id)}
                                            download
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#CCFF00] hover:underline ml-auto"
                                        >
                                            {t('projectDetails.download')} ↓
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-[#141414] rounded-[40px] p-24 text-center border border-dashed border-white/10">
                        <FileText className="h-12 w-12 text-neutral-700 mx-auto mb-6" />
                        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">{t('projectDetails.empty')}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
