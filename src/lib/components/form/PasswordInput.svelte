<script lang="ts">
	import { Eye, EyeOff } from '$lib/components/icons';

	interface Props {
		id: string;
		name: string;
		label: string;
		value?: string;
		required?: boolean;
		showToggle?: boolean;
		minlength?: number;
		maxlength?: number;
		class?: string;
	}

	let {
		id,
		name,
		label,
		value = '',
		required = false,
		showToggle = true,
		minlength,
		maxlength,
		class: className = ''
	}: Props = $props();

	let showPassword = $state(false);
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	<div class="relative mt-1">
		<input
			type={showPassword ? 'text' : 'password'}
			{id}
			{name}
			{value}
			{required}
			{minlength}
			{maxlength}
			class="block w-full px-3 py-2 {showToggle
				? 'pr-10'
				: ''} rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none {className}"
		/>
		{#if showToggle}
			<button
				type="button"
				onclick={() => (showPassword = !showPassword)}
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				{#if showPassword}
					<EyeOff width={20} height={20} />
				{:else}
					<Eye width={20} height={20} />
				{/if}
			</button>
		{/if}
	</div>
</div>
