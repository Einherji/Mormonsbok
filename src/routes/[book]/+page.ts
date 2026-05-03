import { getBook } from '$lib/data/books';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const book = getBook(params.book);
	if (!book) throw error(404, 'Bók fannst ekki');
	return { book };
};
