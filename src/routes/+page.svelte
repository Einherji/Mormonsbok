<script lang="ts">
	import { BOOKS, getBook } from '$lib/data/books';
	import { player } from '$lib/stores/player.svelte';
	import BookCard from '$lib/components/BookCard.svelte';
	import { Play, Pause } from 'lucide-svelte';

	// Last saved position — read once from localStorage on mount (non-reactive by design)
	const lastPlayed = player.getLastPlayed();
	const savedBook = lastPlayed ? getBook(lastPlayed.bookId) : null;
	const savedChapter =
		savedBook?.chapters.find((c) => c.number === lastPlayed?.chapterNum) ?? null;

	// Reactively prefer whatever is currently loaded in the player,
	// falling back to the last saved position when nothing is active.
	const continueBook = $derived(player.currentBook ?? savedBook);
	const continueChapter = $derived(player.currentChapter ?? savedChapter);
	const isActive = $derived(player.currentBook !== null);
</script>

<svelte:head>
	<title>Mormónsbók</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 pt-10 pb-4">
	<!-- Header -->
	<div class="mb-8">
		<p class="text-text-secondary text-xs font-semibold tracking-widest uppercase mb-1.5">
			Íslenska hljóðbók
		</p>
		<h1 class="text-3xl font-bold text-text-primary tracking-tight">Mormónsbók</h1>
	</div>

	<!-- Continue / Now playing -->
	{#if continueBook && continueChapter}
		<div class="mb-6">
			<p class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
				{isActive ? 'Núna í spilun' : 'Halda áfram'}
			</p>
			<button
				onclick={() => player.play(continueBook!, continueChapter!)}
				class="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-elevated border border-white/5
				       hover:bg-surface-overlay transition-all text-left group"
			>
				<div
					class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
					style="background-color: {continueBook.color}28;"
				>
					{#if isActive && player.isPlaying}
						<Pause size={20} style="color: {continueBook.color};" />
					{:else}
						<Play size={20} style="color: {continueBook.color};" class="ml-0.5" />
					{/if}
				</div>
				<div class="min-w-0">
					<p class="font-semibold text-text-primary truncate">{continueBook.title}</p>
					<p class="text-sm text-text-secondary">{continueChapter.title}</p>
				</div>
			</button>
		</div>
	{/if}

	<!-- All books -->
	<div>
		<p class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Bækur</p>
		<div class="space-y-0.5">
			{#each BOOKS as book}
				<BookCard {book} />
			{/each}
		</div>
	</div>
</div>
