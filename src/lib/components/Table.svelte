<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props {
		data: T[];
		emptyMessage?: string;
		emptyIcon?: Snippet;
		class?: string;
		headerSnippet: Snippet;
		rowSnippet: Snippet<[T]>;
	}

	let {
		data,
		emptyMessage = 'No data available',
		emptyIcon,
		class: className = '',
		headerSnippet,
		rowSnippet
	}: Props = $props();
</script>

<div
	class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-gray-900 {className}"
>
	<div class="overflow-x-auto">
		{#if data.length === 0}
			<div class="px-6 py-12 text-center">
				{#if emptyIcon}
					{@render emptyIcon()}
				{/if}
				<p class="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
			</div>
		{:else}
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-900">
					{@render headerSnippet()}
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
					{#each data as item (item)}
						{@render rowSnippet(item)}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
