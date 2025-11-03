<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'text';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: classes = '',
		children,
		type = 'button',
		...restProps
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

	const variantClasses = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
		secondary:
			'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600',
		danger:
			'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
		ghost:
			'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
		text: 'bg-transparent text-blue-600 hover:text-blue-900 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
		md: 'px-4 py-2 text-sm rounded-md gap-2',
		lg: 'px-6 py-3 text-base rounded-lg gap-2.5'
	};

	const buttonClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${classes}`
	);
</script>

<button class={buttonClasses} {type} {...restProps}>
	{@render children()}
</button>
