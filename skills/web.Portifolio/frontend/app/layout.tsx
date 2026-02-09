import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
    title: 'Portfólio',
    description: 'Projetos e análises de dados de Natan Rangel',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="antialiased">
                <LanguageProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#141414',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.05)',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#CCFF00',
                                    secondary: '#0A0A0A',
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </LanguageProvider>
            </body>
        </html>
    );
}
