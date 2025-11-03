<script lang="ts">
	import { Button } from '$lib/components';

	interface Props {
		name?: string;
		value: string;
		placeholder?: string;
		submitLabel?: string;
		class?: string;
	}

	let {
		name = 'search',
		value = $bindable(''),
		placeholder = 'Search...',
		submitLabel = 'Search',
		class: className = ''
	}: Props = $props();
</script>

<form method="get" class="flex gap-2 {className}">
	<input
		type="text"
		{name}
		bind:value
		{placeholder}
		class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400"
	/>
	<Button variant="secondary" type="submit">
		{submitLabel}
	</Button>
</form>
