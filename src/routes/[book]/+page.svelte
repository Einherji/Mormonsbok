<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Play, Pause } from 'lucide-svelte';
	import { player } from '$lib/stores/player.svelte';
	import type { Chapter } from '$lib/data/books';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const book = $derived(data.book);

	function playChapter(chapter: Chapter) {
		player.play(book, chapter);
	}

	const isCurrentBook = $derived(player.currentBook?.id === book.id);
</script>

<svelte:head>
	<title>{book.title} — Mormónsbók</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 pt-6 pb-4">
	<!-- Back -->
	<button
		onclick={() => goto('/')}
		class="flex items-center gap-1.5 text-text-secondary hover:text-text-primary mb-6 transition-colors -ml-1 py-1"
	>
		<ArrowLeft size={18} />
		<span class="text-sm">Til baka</span>
	</button>

	<!-- Book header -->
	<div class="flex items-center gap-4 mb-8">
		<div
			class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
			style="background-color: {book.color}28;"
		>
			<span class="text-2xl font-bold" style="color: {book.color};">{book.title[0]}</span>
		</div>
		<div>
			<h1 class="text-2xl font-bold text-text-primary tracking-tight">{book.title}</h1>
			<p class="text-sm text-text-secondary mt-0.5">
				{book.chapters.length}
				{book.chapters.length === 1 ? 'kafli' : 'kaflar'}
			</p>
		</div>
	</div>

	<!-- Chapter list -->
	<div class="space-y-0.5">
		{#each book.chapters as chapter}
			{@const isActive = isCurrentBook && player.currentChapter?.number === chapter.number}
			{@const savedTime = player.getSavedTime(book.id, chapter.number)}

			<button
				onclick={() => playChapter(chapter)}
				class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-left
				       {isActive ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'}"
			>
				<!-- Icon -->
				<div
					class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0
					       {isActive ? '' : 'bg-surface-overlay'}"
					style={isActive ? `background-color: ${book.color}22;` : ''}
				>
					{#if isActive && player.isPlaying}
						<Pause size={15} style="color: {book.color};" />
					{:else if isActive}
						<Play size={15} style="color: {book.color};" class="ml-0.5" />
					{:else}
						<span class="text-xs font-medium text-text-muted">{chapter.number}</span>
					{/if}
				</div>

				<!-- Chapter info -->
				<div class="min-w-0 flex-1">
					<p
						class="font-medium transition-colors"
						style={isActive ? `color: ${book.color};` : 'color: #f0ebe2;'}
					>
						{chapter.title}
					</p>
					{#if savedTime > 5}
						<p class="text-xs text-text-muted mt-0.5">Haldið áfram</p>
					{/if}
				</div>

				<!-- Progress dot -->
				{#if savedTime > 5}
					<div class="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0"></div>
				{/if}
			</button>
		{/each}
	</div>
</div>
