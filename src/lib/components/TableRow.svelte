<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		hoverable?: boolean;
	}

	let { children, class: className = '', hoverable = true }: Props = $props();
</script>

<tr class="{hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''} {className}">
	{@render children()}
</tr>
