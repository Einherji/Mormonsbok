import type { Book, Chapter } from '$lib/data/books';
import { getAudioUrl } from '$lib/data/books';
import { browser } from '$app/environment';

const PROGRESS_KEY = 'mb_progress';
const LAST_PLAYED_KEY = 'mb_last_played';

interface ProgressMap {
	[key: string]: number;
}

interface LastPlayed {
	bookId: string;
	chapterNum: number;
}

function loadProgress(): ProgressMap {
	if (!browser) return {};
	try {
		return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
	} catch {
		return {};
	}
}

function persistProgress(p: ProgressMap) {
	if (!browser) return;
	localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

class PlayerStore {
	currentBook = $state<Book | null>(null);
	currentChapter = $state<Chapter | null>(null);
	isPlaying = $state(false);
	currentTime = $state(0);
	duration = $state(0);
	playbackRate = $state(1);
	progress = $state<ProgressMap>(loadProgress());

	get audioUrl(): string | null {
		if (!this.currentBook || !this.currentChapter) return null;
		return getAudioUrl(this.currentBook, this.currentChapter);
	}

	private get progressKey(): string | null {
		if (!this.currentBook || !this.currentChapter) return null;
		return `${this.currentBook.id}:${this.currentChapter.number}`;
	}

	getSavedTime(bookId: string, chapterNum: number): number {
		return this.progress[`${bookId}:${chapterNum}`] ?? 0;
	}

	saveCurrentTime() {
		const key = this.progressKey;
		if (!key || this.currentTime < 5) return;
		this.progress = { ...this.progress, [key]: this.currentTime };
		persistProgress(this.progress);
	}

	play(book: Book, chapter: Chapter) {
		const isSameChapter =
			this.currentBook?.id === book.id && this.currentChapter?.number === chapter.number;
		if (isSameChapter) {
			this.isPlaying = !this.isPlaying;
			return;
		}
		this.currentBook = book;
		this.currentChapter = chapter;
		this.isPlaying = true;
		this.setLastPlayed(book.id, chapter.number);
	}

	togglePlay() {
		this.isPlaying = !this.isPlaying;
	}

	playNext() {
		const { currentBook, currentChapter } = this;
		if (!currentBook || !currentChapter) return;
		const idx = currentBook.chapters.findIndex((c) => c.number === currentChapter.number);
		const next = currentBook.chapters[idx + 1];
		if (next) {
			this.currentChapter = next;
			this.currentTime = 0;
			this.duration = 0;
			this.isPlaying = true;
			this.setLastPlayed(currentBook.id, next.number);
		} else {
			this.isPlaying = false;
		}
	}

	getLastPlayed(): LastPlayed | null {
		if (!browser) return null;
		try {
			return JSON.parse(localStorage.getItem(LAST_PLAYED_KEY) || 'null');
		} catch {
			return null;
		}
	}

	setLastPlayed(bookId: string, chapterNum: number) {
		if (!browser) return;
		localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify({ bookId, chapterNum }));
	}
}

export const player = new PlayerStore();
