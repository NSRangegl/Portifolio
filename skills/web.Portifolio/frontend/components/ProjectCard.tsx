import Link from 'next/link';
import { Calendar, Tag, ArrowRight, FileText } from 'lucide-react';
import type { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const { t } = useLanguage();
    const fileCount = project.files?.length || 0;

    return (
        <Link href={`/projects/${project.id}`} className="group block h-full">
            <div className="bg-[#141414] rounded-[24px] border border-white/5 p-8 h-full flex flex-col transition-all duration-500 hover:border-[#CCFF00]/40 hover:-translate-y-2 relative overflow-hidden">
                {/* Minimalist dot indicator */}
                <div className="absolute top-8 right-8 w-2 h-2 bg-[#CCFF00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="mb-6">
                    <div className="flex items-center text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                        {formatDate(project.createdAt)}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#CCFF00] transition-colors tracking-tighter">
                    {project.title}
                </h3>

                <p className="text-neutral-400 mb-8 flex-grow line-clamp-2 text-sm leading-relaxed font-medium">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-0 py-1 text-[10px] font-black uppercase tracking-widest text-[#CCFF00] opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-white">{fileCount}</span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                            {fileCount === 1 ? t('projects.assets').split('(')[0] : t('projects.assets')}
                        </span>
                    </div>
                    <div className="flex items-center text-white font-black text-[10px] uppercase tracking-widest group-hover:text-[#CCFF00] transition-colors">
                        {t('projects.viewDetails')}
                        <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
