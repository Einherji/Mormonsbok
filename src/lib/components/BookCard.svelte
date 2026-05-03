<script lang="ts">
	import { goto } from '$app/navigation';
	import { ChevronRight } from 'lucide-svelte';
	import type { Book } from '$lib/data/books';
	import { player } from '$lib/stores/player.svelte';

	let { book }: { book: Book } = $props();

	const hasProgress = $derived(
		book.chapters.some((c) => player.getSavedTime(book.id, c.number) > 5)
	);
	const isActive = $derived(player.currentBook?.id === book.id);
</script>

<button
	onclick={() => goto(`/${book.id}`)}
	class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-left group
	       {isActive ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'}"
>
	<!-- Book icon -->
	<div
		class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
		style="background-color: {book.color}28;"
	>
		<span class="text-lg font-bold" style="color: {book.color};">{book.title[0]}</span>
	</div>

	<!-- Info -->
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="font-medium text-text-primary">{book.title}</p>
			{#if hasProgress}
				<div class="w-1.5 h-1.5 rounded-full bg-accent/70 shrink-0"></div>
			{/if}
		</div>
		<p class="text-sm text-text-secondary">
			{book.chapters.length}
			{book.chapters.length === 1 ? 'kafli' : 'kaflar'}
		</p>
	</div>

	<ChevronRight
		size={18}
		class="text-text-muted group-hover:text-text-secondary transition-colors shrink-0"
	/>
</button>
