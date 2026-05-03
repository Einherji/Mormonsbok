<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Play, Pause, SkipBack, SkipForward } from 'lucide-svelte';
	import { player } from '$lib/stores/player.svelte';
	import { formatTime } from '$lib/utils';

	let audio: HTMLAudioElement | null = null;
	let saveInterval: ReturnType<typeof setInterval>;
	// Plain (non-reactive) variable - used only to detect URL changes inside the effect.
	// We intentionally don't want Svelte to track it as a dependency.
	let loadedUrl = '';

	onMount(() => {
		audio = new Audio();
		audio.preload = 'metadata';

		audio.addEventListener('timeupdate', () => {
			player.currentTime = audio!.currentTime;
		});

		audio.addEventListener('loadedmetadata', () => {
			player.duration = audio!.duration;
			const saved =
				player.currentBook && player.currentChapter
					? player.getSavedTime(player.currentBook.id, player.currentChapter.number)
					: 0;
			if (saved > 5) audio!.currentTime = saved;
		});

		audio.addEventListener('ended', () => {
			player.saveCurrentTime();
			player.playNext();
		});

		saveInterval = setInterval(() => {
			if (player.isPlaying) player.saveCurrentTime();
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(saveInterval);
		if (audio) {
			audio.pause();
			audio.src = '';
		}
	});

	// Single effect handles both URL changes and play/pause toggling.
	// Using one effect avoids the ordering race that two separate effects create.
	$effect(() => {
		if (!audio) return;

		const url = player.audioUrl; // reactive dep
		const isPlaying = player.isPlaying; // reactive dep

		if (url !== loadedUrl) {
			// New track - load it first, then conditionally play
			loadedUrl = url ?? '';
			if (url) {
				audio.src = url;
				audio.load();
				audio.playbackRate = player.playbackRate;
				if (isPlaying) audio.play().catch(console.error);
			} else {
				audio.pause();
				audio.src = '';
			}
		} else {
			// Same track - just toggle playback
			if (isPlaying) {
				audio.play().catch(console.error);
			} else {
				audio.pause();
			}
		}
	});

	$effect(() => {
		if (audio) audio.playbackRate = player.playbackRate;
	});

	function seek(e: Event) {
		const t = parseFloat((e.target as HTMLInputElement).value);
		if (audio) audio.currentTime = t;
		player.currentTime = t;
	}

	function skip(seconds: number) {
		if (!audio) return;
		audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
	}

	const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

	const pct = $derived(player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0);
</script>

{#if player.currentBook && player.currentChapter}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-surface-elevated/95 backdrop-blur-xl"
	>
		<div class="mx-auto max-w-lg px-4 pt-3 pb-4">
			<!-- Progress bar -->
			<div class="mb-3 flex items-center gap-2">
				<span class="w-9 shrink-0 text-right text-xs tabular-nums text-text-muted">
					{formatTime(player.currentTime)}
				</span>
				<input
					type="range"
					class="player-slider flex-1"
					min="0"
					max={player.duration || 100}
					value={player.currentTime}
					style="--pct: {pct}%"
					oninput={seek}
					aria-label="Framgangur"
				/>
				<span class="w-9 shrink-0 text-xs tabular-nums text-text-muted">
					{formatTime(player.duration)}
				</span>
			</div>

			<!-- Controls -->
			<div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
				<!-- Track info -->
				<div class="min-w-0">
					<p class="truncate text-xs text-text-secondary">{player.currentBook.title}</p>
					<p class="truncate text-sm font-medium text-text-primary">
						{player.currentChapter.title}
					</p>
				</div>

				<div class="flex items-center justify-center gap-2">
					<!-- Skip back 15s -->
					<button
						onclick={() => skip(-15)}
						class="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
						aria-label="15 sek til baka"
					>
						<SkipBack size={20} />
					</button>

					<!-- Play / Pause -->
					<button
						onclick={() => player.togglePlay()}
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent transition-colors hover:bg-accent-hover"
						aria-label={player.isPlaying ? 'Hlé' : 'Spila'}
					>
						{#if player.isPlaying}
							<Pause size={20} class="text-background" />
						{:else}
							<Play size={20} class="ml-0.5 text-background" />
						{/if}
					</button>

					<!-- Skip forward 15s -->
					<button
						onclick={() => skip(15)}
						class="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
						aria-label="15 sek áfram"
					>
						<SkipForward size={20} />
					</button>
				</div>

				<!-- Playback speed dropdown -->
				<select
					value={player.playbackRate}
					onchange={(e) => {
						player.playbackRate = parseFloat((e.target as HTMLSelectElement).value);
					}}
					class="justify-self-end rounded-lg bg-transparent py-2 text-center text-xs font-semibold text-text-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-text-primary cursor-pointer appearance-none border-none w-10"
					aria-label="Hraði"
				>
					{#each SPEEDS as speed}
						<option value={speed} class="bg-surface-elevated text-text-primary">
							{speed}x
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
{/if}
