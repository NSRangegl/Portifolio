'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Download, X } from 'lucide-react';

interface CSVViewerProps {
    fileUrl: string;
    filename: string;
}

export default function CSVViewer({ fileUrl, filename }: CSVViewerProps) {
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    useEffect(() => {
        if (!isOpen) return;

        const fetchCSV = async () => {
            try {
                const response = await fetch(fileUrl);
                const text = await response.text();

                Papa.parse(text, {
                    complete: (results) => {
                        if (results.data.length > 0) {
                            setHeaders(results.data[0] as string[]);
                            setData(results.data.slice(1) as string[][]);
                        }
                        setLoading(false);
                    },
                    error: (err: any) => {
                        setError(err.message);
                        setLoading(false);
                    },
                });
            } catch (err: any) {
                setError('Failed to load CSV file');
                setLoading(false);
            }
        };

        fetchCSV();
    }, [fileUrl, isOpen]);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                📊 Pré-visualizar CSV
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {filename}
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Carregando dados...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8 text-red-600">
                            <p>Erro: {error}</p>
                        </div>
                    )}

                    {!loading && !error && data.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            {headers.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {currentData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td
                                                        key={cellIndex}
                                                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap"
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de{' '}
                                    {data.length} linhas
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href={fileUrl.replace('/files/', '/files/') + '/download'}
                        download
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar CSV
                    </a>
                </div>
            </div>
        </div>
    );
}
