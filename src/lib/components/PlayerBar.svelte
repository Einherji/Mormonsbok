<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Play, Pause, SkipBack, SkipForward } from 'lucide-svelte';
	import { player } from '$lib/stores/player.svelte';
	import { formatTime } from '$lib/utils';

	let audio: HTMLAudioElement | null = null;
	let saveInterval: ReturnType<typeof setInterval>;
	// Plain (non-reactive) variable — used only to detect URL changes inside the effect.
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
			// New track — load it first, then conditionally play
			loadedUrl = url ?? '';
			if (url) {
				audio.src = url;
				audio.load();
				if (isPlaying) audio.play().catch(console.error);
			} else {
				audio.pause();
				audio.src = '';
			}
		} else {
			// Same track — just toggle playback
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
		class="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated/95 backdrop-blur-xl border-t border-white/5"
	>
		<div class="max-w-lg mx-auto px-4 pt-3 pb-4">
			<!-- Progress bar -->
			<div class="flex items-center gap-2 mb-3">
				<span class="text-xs text-text-muted w-9 text-right tabular-nums shrink-0">
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
				<span class="text-xs text-text-muted w-9 tabular-nums shrink-0">
					{formatTime(player.duration)}
				</span>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-2">
				<!-- Track info -->
				<div class="min-w-0 flex-1">
					<p class="text-xs text-text-secondary truncate">{player.currentBook.title}</p>
					<p class="text-sm font-medium text-text-primary truncate">
						{player.currentChapter.title}
					</p>
				</div>

				<!-- Skip back 15s -->
				<button
					onclick={() => skip(-15)}
					class="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-overlay"
					aria-label="15 sek til baka"
				>
					<SkipBack size={20} />
				</button>

				<!-- Play / Pause -->
				<button
					onclick={() => player.togglePlay()}
					class="w-11 h-11 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors shrink-0"
					aria-label={player.isPlaying ? 'Hlé' : 'Spila'}
				>
					{#if player.isPlaying}
						<Pause size={20} class="text-background" />
					{:else}
						<Play size={20} class="text-background ml-0.5" />
					{/if}
				</button>

				<!-- Skip forward 15s -->
				<button
					onclick={() => skip(15)}
					class="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-overlay"
					aria-label="15 sek áfram"
				>
					<SkipForward size={20} />
				</button>

				<!-- Playback speed dropdown -->
				<select
					value={player.playbackRate}
					onchange={(e) => {
						player.playbackRate = parseFloat((e.target as HTMLSelectElement).value);
					}}
					class="text-xs font-semibold text-text-secondary hover:text-text-primary
					       bg-transparent border-none outline-none cursor-pointer
					       appearance-none w-10 text-center py-2 rounded-lg
					       hover:bg-surface-overlay transition-colors"
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
