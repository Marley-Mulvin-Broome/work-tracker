<script lang="ts">
	interface RadioOption {
		value: string;
		label: string;
	}

	interface Props {
		label: string;
		name: string;
		options: RadioOption[];
		value: string;
		class?: string;
	}

	let { label, name, options, value = $bindable(), class: className = '' }: Props = $props();
</script>

<div class={className}>
	<div
		class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
		role="group"
		aria-label={label}
	>
		{label}
	</div>
	<div class="space-y-2">
		{#each options as option (option.value)}
			<label class="flex cursor-pointer items-center">
				<input
					type="radio"
					bind:group={value}
					value={option.value}
					{name}
					class="mr-2 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:focus:ring-blue-400"
				/>
				<span class="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
			</label>
		{/each}
	</div>
</div>
