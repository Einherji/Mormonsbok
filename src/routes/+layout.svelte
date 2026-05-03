<script lang="ts">
	import '../app.css';
	import PlayerBar from '$lib/components/PlayerBar.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-background">
	<main class="flex-1 pb-32">
		{@render children()}
	</main>
	<PlayerBar />
</div>
