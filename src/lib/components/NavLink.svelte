<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		href: string;
		mobile?: boolean;
		class?: string;
		children: Snippet;
	}

	let { href, mobile = false, class: classes = '', children }: Props = $props();

	const isActive = $derived(page.url.pathname === href);

	const desktopClasses =
		'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition';
	const desktopActiveClasses = '!border-blue-500 !text-blue-600 dark:!text-blue-400';

	const mobileClasses =
		'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium';
	const mobileActiveClasses =
		'!border-blue-500 !bg-blue-50 dark:!bg-blue-900/20 !text-blue-700 dark:!text-blue-300';

	const linkClasses = $derived(
		mobile
			? `${mobileClasses} ${isActive ? mobileActiveClasses : ''} ${classes}`.trim()
			: `${desktopClasses} ${isActive ? desktopActiveClasses : ''} ${classes}`.trim()
	);
</script>

<a {href} class={linkClasses}>
	{@render children()}
</a>
