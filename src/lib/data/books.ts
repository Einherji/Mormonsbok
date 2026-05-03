import { PUBLIC_AUDIO_BASE_URL } from '$env/static/public';

export interface Chapter {
	number: number;
	title: string;
	filename: string;
}

export interface Book {
	id: string;
	title: string;
	folder: string;
	color: string;
	chapters: Chapter[];
}

function chaps(bookName: string, count: number): Chapter[] {
	return Array.from({ length: count }, (_, i) => {
		const n = i + 1;
		return {
			number: n,
			title: `Kafli ${n}`,
			filename: `${bookName}_${String(n).padStart(2, '0')}.mp3`
		};
	});
}

export const BOOKS: Book[] = [
	{
		id: 'formali-og-vitni',
		title: 'Formáli og vitni',
		folder: 'Formáli og vitni',
		color: '#8b7355',
		chapters: [{ number: 1, title: 'Formáli og vitni', filename: 'Formáli og vitni.mp3' }]
	},
	{
		id: '1-nefi',
		title: '1 Nefí',
		folder: '1Nefí',
		color: '#7c6a9a',
		chapters: chaps('1Nefí', 22)
	},
	{
		id: '2-nefi',
		title: '2 Nefí',
		folder: '2Nefí',
		color: '#5a8a6a',
		chapters: chaps('2Nefí', 33)
	},
	{
		id: 'jakob',
		title: 'Jakob',
		folder: 'Jakob',
		color: '#9a6a5a',
		chapters: chaps('Jakob', 7)
	},
	{
		id: 'enos',
		title: 'Enos',
		folder: 'Enos',
		color: '#5a8a8a',
		chapters: [{ number: 1, title: 'Kafli 1', filename: 'Enos_01.mp3' }]
	},
	{
		id: 'jarom',
		title: 'Jarom',
		folder: 'Jarom',
		color: '#7a7a5a',
		chapters: [{ number: 1, title: 'Kafli 1', filename: 'Jarom_01.mp3' }]
	},
	{
		id: 'omni',
		title: 'Omní',
		folder: 'Omní',
		color: '#5a6a8a',
		chapters: [{ number: 1, title: 'Kafli 1', filename: 'Omní-1.mp3' }]
	},
	{
		id: 'ord-mormons',
		title: 'Orð Mormóns',
		folder: 'Ord Mormóns',
		color: '#7a8a5a',
		chapters: [{ number: 1, title: 'Orð Mormóns', filename: 'Ord Mormóns_01.mp3' }]
	},
	{
		id: 'mosia',
		title: 'Mósía',
		folder: 'Mósía',
		color: '#9a7a3a',
		chapters: chaps('Mósía', 29)
	},
	{
		id: 'alma',
		title: 'Alma',
		folder: 'Alma',
		color: '#3a7a9a',
		chapters: chaps('Alma', 63)
	},
	{
		id: 'helaman',
		title: 'Helaman',
		folder: 'Helaman',
		color: '#7a3a9a',
		chapters: chaps('Helaman', 16)
	},
	{
		id: '3-nefi',
		title: '3 Nefí',
		folder: '3Nefí',
		color: '#3a9a6a',
		chapters: chaps('3Nefí', 30)
	},
	{
		id: '4-nefi',
		title: '4 Nefí',
		folder: '4Nefí',
		color: '#9a3a6a',
		chapters: [{ number: 1, title: 'Kafli 1', filename: '4Nefí_01.mp3' }]
	},
	{
		id: 'mormon',
		title: 'Mormón',
		folder: 'Mormón',
		color: '#6a9a3a',
		chapters: chaps('Mormón', 9)
	},
	{
		id: 'eter',
		title: 'Eter',
		folder: 'Eter',
		color: '#9a8a3a',
		chapters: chaps('Eter', 15)
	},
	{
		id: 'moroni',
		title: 'Moróní',
		folder: 'Moróní',
		color: '#3a8a9a',
		chapters: chaps('Moróní', 10)
	}
];

export function getBook(id: string): Book | undefined {
	return BOOKS.find((b) => b.id === id);
}

export function getAudioUrl(book: Book, chapter: Chapter): string {
	const base = (PUBLIC_AUDIO_BASE_URL || '/audio').replace(/\/$/, '');
	const folderParts = book.folder.split('/').map(encodeURIComponent).join('/');
	const file = encodeURIComponent(chapter.filename);
	return `${base}/${folderParts}/${file}`;
}
