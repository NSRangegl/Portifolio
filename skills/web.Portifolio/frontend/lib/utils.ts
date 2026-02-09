export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

export function getFileIcon(mimetype: string): string {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.includes('csv')) return '📊';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📈';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('powerbi') || mimetype.includes('pbix')) return '📊';
    return '📁';
}

export function isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
}

export function isCSVFile(mimetype: string): boolean {
    return mimetype.includes('csv');
}

export function isPowerBIFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pbix');
}
