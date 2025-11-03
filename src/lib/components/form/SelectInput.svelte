<script lang="ts">
	interface SelectOption {
		value: string;
		label: string;
	}

	interface Props {
		id: string;
		name: string;
		label: string;
		value?: string;
		required?: boolean;
		options: SelectOption[];
		defaultOption?: string;
		class?: string;
	}

	let {
		id,
		name,
		label,
		value = '',
		required = false,
		options,
		defaultOption,
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
	<select
		{id}
		{name}
		{value}
		{required}
		class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none {className}"
	>
		{#if defaultOption}
			<option value="">{defaultOption}</option>
		{/if}
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
