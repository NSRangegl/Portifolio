'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { Loader2, ArrowRight, Sparkles, Database, BarChart3, Languages, Mail, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
    const { t, locale } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await api.getProjects(1, 20);
                setProjects(data.projects);
            } catch (err: any) {
                console.error('Error fetching projects:', err);
                setError(err.message || 'Falha ao carregar projetos');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#CCFF00] selection:text-[#0A0A0A]">
            <Navbar />

            <main>
                {/* Minimalist Hero Section */}
                <section className="relative min-h-[90vh] flex items-center pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-[1px] bg-[#CCFF00]"></div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                            {t('hero.title')}
                                        </span>
                                    </div>
                                    <h1 className="text-7xl lg:text-[120px] font-black text-white leading-[0.9] tracking-tighter">
                                        {t('hero.hello')}<span className="text-[#CCFF00]">.</span>
                                    </h1>
                                    <p className="text-xl text-neutral-400 font-medium max-w-md leading-relaxed">
                                        — {t('hero.subtitle')}
                                    </p>
                                </div>

                                <div className="flex items-start space-x-12">
                                    <div>
                                        <p className="text-4xl font-black text-white">+50</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{t('hero.metrics.dashboards')}</p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-white">+04</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{t('hero.metrics.experience')}</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href="#projetos"
                                        className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-white group"
                                    >
                                        {t('hero.scroll')} <span className="ml-3 group-hover:translate-y-2 transition-transform">↓</span>
                                    </a>
                                </div>
                            </div>

                            <div className="relative aspect-[4/5] lg:aspect-square group animate-fade-in">
                                <div className="absolute inset-0 bg-[#CCFF00]/10 rounded-[40px] translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                                <div className="relative h-full w-full overflow-hidden rounded-[40px] border border-white/10">
                                    <img
                                        src="/IMG-20250812-WA0070 (1).jpg"
                                        alt="Natan Rangel"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="sobre" className="py-32 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                            <div className="lg:col-span-4 space-y-6">
                                <h2 className="text-4xl font-black text-white tracking-tighter">{t('about.title')}</h2>
                                <p className="text-neutral-400 leading-relaxed font-medium">
                                    {t('hero.subtitle')}
                                </p>
                            </div>

                            <div className="lg:col-span-4 bg-[#141414] border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center space-y-6">
                                <div className="p-4 bg-[#0A0A0A] rounded-full border border-[#CCFF00]/20">
                                    <Database className="h-8 w-8 text-[#CCFF00]" />
                                </div>
                                <h3 className="text-6xl font-black text-[#CCFF00]">100%</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
                                    {t('about.precision')}
                                </p>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="mt-1 p-2 bg-[#CCFF00] rounded-full">
                                        <Sparkles className="h-3 w-3 text-[#0A0A0A]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{t('about.column1.title')}</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            {t('about.column1.description')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="mt-1 p-2 bg-[#CCFF00] rounded-full">
                                        <BarChart3 className="h-3 w-3 text-[#0A0A0A]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{t('about.column2.title')}</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            {t('about.column2.description')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Journey Section */}
                <section className="py-32 border-t border-white/5 bg-[#0f0f0f]/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-16">{t('experience.title')}</h2>
                        <div className="space-y-12">
                            {['engeman', 'pneumatic', 'camorim'].map((roleKey) => {
                                const role = t(`experience.roles.${roleKey}`);
                                return (
                                    <div key={roleKey} className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                        <div className="md:col-span-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] mb-2">{role.period}</p>
                                            <p className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">{role.company}</p>
                                        </div>
                                        <div className="md:col-span-1 hidden md:flex justify-center pt-1">
                                            <div className="w-2 h-2 rounded-full bg-[#1F1F1F] group-hover:bg-[#CCFF00] transition-colors shadow-[0_0_10px_rgba(204,255,0,0)] group-hover:shadow-[0_0_10px_rgba(204,255,0,0.4)]"></div>
                                        </div>
                                        <div className="md:col-span-8">
                                            <h3 className="text-xl font-black text-white tracking-tight mb-4">{role.title}</h3>
                                            <p className="text-neutral-400 leading-relaxed text-sm">{role.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Experience / Projects Header */}
                <section id="projetos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-[#CCFF00] text-lg">•</span>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">{t('projects.title')}</span>
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
                                Exploring My <br /> <span className="text-[#CCFF00]">Intelligence Works</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-start lg:items-end space-y-4">
                            <p className="text-neutral-400 max-w-sm text-sm lg:text-right leading-relaxed font-medium">
                                {t('about.column2.description')}
                            </p>
                            <Link
                                href="/admin/login"
                                className="text-xs font-black uppercase tracking-widest text-[#CCFF00] hover:underline"
                            >
                                Admin Access ↗
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-20 space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                            <p className="text-slate-400 font-medium animate-pulse">Buscando as melhores análises...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30">
                            <p className="text-red-600 dark:text-red-400 font-bold mb-2">Ops!</p>
                            <p className="text-slate-600 dark:text-slate-400">{error}</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-32 bg-slate-100/50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Database className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ainda não há projetos aqui</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                                O portfólio está sendo preparado. Volte em breve para ver novas análises incríveis!
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Login como Administrador
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, idx) => (
                                <div key={project.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up">
                                    <ProjectCard project={project} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Contact Section */}
                <section id="contato" className="py-32 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
                                    {t('contact.title').split(' ')[0]} <span className="text-[#CCFF00]">{t('contact.title').split(' ').slice(1).join(' ')}</span>
                                </h2>
                                <p className="text-xl text-neutral-400 font-medium tracking-tight">
                                    {t('contact.subtitle')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                <a
                                    href="https://wa.me/5522997832536"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-[#141414] border border-white/5 p-10 rounded-[40px] hover:border-[#CCFF00]/30 transition-all duration-500 text-left space-y-6"
                                >
                                    <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#CCFF00] transition-all duration-500">
                                        <Phone className="h-6 w-6 text-[#CCFF00] group-hover:text-[#0A0A0A] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{t('contact.phone')}</p>
                                        <p className="text-2xl font-black text-white">+55 (22) 99783-2536</p>
                                    </div>
                                    <div className="pt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        {t('contact.action')} <ArrowRight className="ml-2 h-3 w-3" />
                                    </div>
                                </a>

                                <a
                                    href="mailto:natansrangel@gmail.com"
                                    className="group bg-[#141414] border border-white/5 p-10 rounded-[40px] hover:border-[#CCFF00]/30 transition-all duration-500 text-left space-y-6"
                                >
                                    <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#CCFF00] transition-all duration-500">
                                        <Mail className="h-6 w-6 text-[#CCFF00] group-hover:text-[#0A0A0A] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{t('contact.email')}</p>
                                        <p className="text-2xl font-black text-white">natansrangel@gmail.com</p>
                                    </div>
                                    <div className="pt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        {t('nav.contact').split(' ')[0]} {t('nav.contact').split(' ')[1]} <ArrowRight className="ml-2 h-3 w-3" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Minimalist Footer */}
            <footer className="py-20 border-t border-white/5 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-8">
                    <div className="flex items-center space-x-6">
                        <a href="#" className="text-neutral-500 hover:text-white transition-colors"><MessageSquare className="h-5 w-5" /></a>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <BarChart3 className="h-6 w-6 text-[#CCFF00]" />
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <a href="https://wa.me/5522997832536" target="_blank" className="text-neutral-500 hover:text-white transition-colors"><Phone className="h-5 w-5" /></a>
                    </div>
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.5em]">
                        © {new Date().getFullYear()} Portfolio Natan dos S Rangel — Excellence in Data Analytics
                    </p>
                </div>
            </footer>
        </div>
    );
}
