<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		class?: string;
		children: Snippet;
	}

	let {
		position = 'bottom-right',
		class: classes = '',
		children,
		type = 'button',
		...restProps
	}: Props = $props();

	const positionClasses = {
		'bottom-right': 'bottom-6 right-6',
		'bottom-left': 'bottom-6 left-6',
		'top-right': 'top-6 right-6',
		'top-left': 'top-6 left-6'
	};

	const buttonClasses = $derived(
		`fixed ${positionClasses[position]} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full p-4 shadow-lg dark:shadow-gray-900 transition-all hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 cursor-pointer ${classes}`.trim()
	);
</script>

<button class={buttonClasses} {type} {...restProps}>
	{@render children()}
</button>
