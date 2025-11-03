<script lang="ts">
	interface Props {
		id: string;
		name: string;
		label: string;
		value?: string;
		required?: boolean;
		rows?: number;
		placeholder?: string;
		class?: string;
	}

	let {
		id,
		name,
		label,
		value = '',
		required = false,
		rows = 2,
		placeholder,
		class: className = ''
	}: Props = $props();
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	<textarea
		{id}
		{name}
		{value}
		{required}
		{rows}
		{placeholder}
		class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none {className}"
	></textarea>
</div>
