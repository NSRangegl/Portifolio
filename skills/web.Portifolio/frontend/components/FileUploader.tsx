'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, FileType, FileText, Database, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';
import toast from 'react-hot-toast';

interface FileUploaderProps {
    projectId: string;
    onUploadComplete?: () => void;
}

export default function FileUploader({ projectId, onUploadComplete }: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
        setUploadStatus('idle');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/octet-stream': ['.pbix'],
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        maxSize: 100 * 1024 * 1024, // 100MB
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setUploadStatus('idle');
        setErrorMessage('');

        try {
            await api.uploadFiles(projectId, files);
            setUploadStatus('success');
            setFiles([]);
            toast.success('Arquivos enviados com sucesso!');
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error: any) {
            setUploadStatus('error');
            const msg = error.response?.data?.error || 'Erro no upload';
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`group relative border-2 border-dashed rounded-[40px] p-16 text-center cursor-pointer transition-all duration-300 ${isDragActive
                    ? 'border-[#CCFF00] bg-[#CCFF00]/5 scale-[1.01]'
                    : 'border-white/5 hover:border-[#CCFF00]/40 bg-[#0A0A0A]'
                    }`}
            >
                <input {...getInputProps()} />
                <div className={`p-5 bg-[#141414] border border-white/5 rounded-2xl inline-block mb-8 transition-transform group-hover:scale-110 ${isDragActive ? 'text-[#CCFF00]' : 'text-neutral-500'}`}>
                    <Upload className="h-6 w-6" />
                </div>

                {isDragActive ? (
                    <p className="text-[#CCFF00] font-black uppercase tracking-[0.2em] text-xs animate-pulse">
                        Release to Process Pipeline
                    </p>
                ) : (
                    <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest mb-3">
                            Initiate Data Ingestion
                        </p>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] max-w-xs mx-auto">
                            Supports .PBIX, .CSV, .XLSX, .PDF, .PNG (MAX 100MB)
                        </p>
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center">
                            <Database className="h-3 w-3 mr-3 text-[#CCFF00]" />
                            Ingestion Buffer ({files.length})
                        </h4>
                        <button
                            onClick={() => setFiles([])}
                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                        >
                            Flush
                        </button>
                    </div>

                    <div className="space-y-3">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-5 bg-[#0A0A0A] border border-white/5 rounded-2xl group"
                            >
                                <div className="flex items-center space-x-5 min-w-0">
                                    <div className="p-3 bg-[#141414] rounded-xl border border-white/5">
                                        <FileType className="h-4 w-4 text-neutral-500 group-hover:text-[#CCFF00] transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white truncate tracking-tighter">
                                            {file.name}
                                        </p>
                                        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-5 bg-[#CCFF00] text-[#0A0A0A] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 flex justify-center items-center"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-3" />
                                Execute Upload
                            </>
                        )}
                    </button>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="flex items-center p-6 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl animate-fade-in">
                    <div className="p-3 bg-[#CCFF00] rounded-xl mr-5">
                        <CheckCircle className="h-4 w-4 text-[#0A0A0A]" />
                    </div>
                    <div>
                        <p className="text-[#CCFF00] font-black text-[10px] uppercase tracking-widest mb-1">
                            Status: Validated
                        </p>
                        <p className="text-neutral-400 text-[10px] uppercase tracking-widest">Assets merged into project ledger.</p>
                    </div>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="flex items-center p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl animate-fade-in">
                    <div className="p-2 bg-red-500 rounded-lg mr-4">
                        <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-red-900 dark:text-red-200 font-bold text-sm">
                            Falha no Processamento
                        </p>
                        <p className="text-red-700 dark:text-red-400 text-xs">{errorMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
