<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import QuickAddButton from '$lib/components/QuickAddButton.svelte';
	import { Navigation } from '$lib/components';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.user}
	<!-- Authenticated Layout -->
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation -->
		<Navigation username={data.user.username} isAdmin={data.user.isAdmin} />

		<!-- Main Content -->
		{@render children?.()}

		<!-- Quick Add FAB -->
		<QuickAddButton />
	</div>
{:else}
	<!-- Unauthenticated Layout (Login page) -->
	{@render children?.()}
{/if}
