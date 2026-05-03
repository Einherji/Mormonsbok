<script lang="ts">
	import '../app.css';
	import PlayerBar from '$lib/components/PlayerBar.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(console.error);
		}
	});
</script>

<div class="min-h-screen flex flex-col bg-background">
	<main class="flex-1 pb-32">
		{@render children()}
	</main>
	<PlayerBar />
</div>
