<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAnchorAttributes, 'class'> {
		href: string;
		variant?: 'default' | 'nav' | 'card';
		active?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		href,
		variant = 'default',
		active = false,
		class: classes = '',
		children,
		...restProps
	}: Props = $props();

	const variantClasses = {
		default:
			'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition cursor-pointer',
		nav: 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition',
		card: 'block hover:bg-gray-50 dark:hover:bg-gray-800 transition'
	};

	const activeClasses = {
		default: '',
		nav: '!border-blue-500 !text-blue-600 dark:!text-blue-400',
		card: 'bg-blue-50 dark:bg-blue-900/20'
	};

	const linkClasses = $derived(
		`${variantClasses[variant]} ${active ? activeClasses[variant] : ''} ${classes}`.trim()
	);
</script>

<a {href} class={linkClasses} {...restProps}>
	{@render children()}
</a>
