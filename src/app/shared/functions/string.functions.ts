export function normalizeString(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N')
        .replace(/[^a-zA-Z0-9\-_\s]/g, '')
        .trim();
}