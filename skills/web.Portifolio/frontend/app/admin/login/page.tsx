'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldCheck, ArrowLeft, BarChart3, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = false;
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.login(username, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Acesso negado. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#CCFF00] selection:text-[#0A0A0A]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in">
                <Link
                    href="/"
                    className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group font-bold text-sm"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Voltar ao Portfólio
                </Link>

                <div className="glass rounded-[40px] p-10 shadow-2xl shadow-blue-500/10">
                    <div className="text-center mb-10">
                        <div className="bg-[#CCFF00] p-4 rounded-2xl inline-block shadow-xl shadow-[#CCFF00]/10 mb-6">
                            <BarChart3 className="h-8 w-8 text-[#0A0A0A]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            Área do <span className="text-gradient">Analista</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Faça login para gerenciar seus projetos
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 animate-shake">
                                <p className="text-red-600 dark:text-red-400 text-sm font-bold text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="username" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Usuário
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-4 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white placeholder:text-neutral-700 focus:ring-4 focus:ring-[#CCFF00]/5 focus:border-[#CCFF00] transition-all outline-none"
                                placeholder="Seu e-mail"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Senha de Acesso
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#0A0A0A] border border-white/5 rounded-2xl text-white placeholder:text-neutral-700 focus:ring-4 focus:ring-[#CCFF00]/5 focus:border-[#CCFF00] transition-all outline-none pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#CCFF00] transition-colors p-2"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 bg-[#CCFF00] text-[#0A0A0A] rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#CCFF00]/5 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-5 w-5 mr-3" />
                                    Acessar Painel
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-xs font-medium">
                    Acesso restrito para administradores do portfólio. <br />
                    Protegido por criptografia de ponta.
                </p>
            </div>
        </div>
    );
}
