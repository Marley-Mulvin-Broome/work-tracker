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

	const desktopClasses = 'border-transparent hover:border-gray-300 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition';
	const desktopActiveClasses = '!border-blue-500 !text-blue-600';

	const mobileClasses = 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium';
	const mobileActiveClasses = '!border-blue-500 !bg-blue-50 !text-blue-700';

	const linkClasses = $derived(
		mobile
			? `${mobileClasses} ${isActive ? mobileActiveClasses : ''} ${classes}`.trim()
			: `${desktopClasses} ${isActive ? desktopActiveClasses : ''} ${classes}`.trim()
	);
</script>

<a {href} class={linkClasses}>
	{@render children()}
</a>
