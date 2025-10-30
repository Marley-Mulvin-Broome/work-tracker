<script lang="ts">
	import type { IconProps } from './IconProps';

	const { class: classes = '', width = 24, height = 24 }: IconProps = $props();
</script>

<svg
	class={classes}
	width={width}
	height={height}
	fill="none"
	stroke="currentColor"
	viewBox="0 0 24 24"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
	></path>
</svg>
