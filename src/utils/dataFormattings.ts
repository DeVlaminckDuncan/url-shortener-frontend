export const capitalize = (s: string): string => `${s[0].toUpperCase()}${s.slice(1)}`;

export const addPaddingZeros = (time: number): string => time.toString().padStart(2, '0');

export const formatDate = (d: Date): string => `${addPaddingZeros(d.getHours())}:${addPaddingZeros(d.getMinutes())} ${addPaddingZeros(d.getDate())}/${addPaddingZeros(d.getMonth() + 1)}/${d.getFullYear()}`;
