'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, LogIn, LogOut, Upload, Menu, X, Languages } from 'lucide-react';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
    const { locale, setLocale, t } = useLanguage();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsAuthenticated(api.isAuthenticated());

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const handleLogout = () => {
        api.logout();
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <BarChart3 className="h-6 w-6 text-[#CCFF00] group-hover:scale-110 transition-transform" />
                            <span className="ml-3 text-lg font-black tracking-tighter text-white uppercase">
                                Portfolio Natan dos <span className="text-[#CCFF00]">S</span> Rangel
                            </span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link
                                href="/"
                                className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${pathname === '/'
                                    ? 'text-[#CCFF00]'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {t('nav.portfolio')}
                            </Link>
                            <Link
                                href="/#sobre"
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all"
                            >
                                {t('nav.about')}
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
                            className="flex items-center text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#CCFF00] transition-all group"
                        >
                            <Languages className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                            {locale === 'pt' ? 'EN' : 'PT'}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/admin/dashboard"
                                    className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[#0A0A0A] bg-[#CCFF00] hover:bg-[#D9FF33] transition-all"
                                >
                                    {t('nav.dashboard')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition-all"
                                >
                                    {t('nav.signOut')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/admin/login"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-all px-4"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    href="/#contato"
                                    className="px-8 py-3 text-xs font-black uppercase tracking-widest text-[#0A0A0A] bg-[#CCFF00] hover:bg-[#D9FF33] transition-all flex items-center group"
                                >
                                    {t('nav.contact')} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-4 pt-4 pb-6 space-y-4">
                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${pathname === '/' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Home className="h-5 w-5 mr-3" />
                        Início
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/admin/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <Upload className="h-5 w-5 mr-3" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="h-5 w-5 mr-3" />
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/#contato"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-neutral-300 hover:bg-neutral-800"
                            >
                                {t('nav.contact')}
                            </Link>
                            <Link
                                href="/admin/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-[#0A0A0A] bg-[#CCFF00]"
                            >
                                <LogIn className="h-5 w-5 mr-3" />
                                {t('nav.login')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
