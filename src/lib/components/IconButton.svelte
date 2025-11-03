<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'ghost',
		size = 'md',
		class: classes = '',
		children,
		type = 'button',
		...restProps
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
		ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
	};

	const sizeClasses = {
		sm: 'p-1 rounded',
		md: 'p-2 rounded-md',
		lg: 'p-3 rounded-lg'
	};

	const buttonClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${classes}`
	);
</script>

<button class={buttonClasses} {type} {...restProps}>
	{@render children()}
</button>
