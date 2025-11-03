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
		class="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
	/>
	<Button variant="secondary" type="submit">
		{submitLabel}
	</Button>
</form>
