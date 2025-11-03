<script lang="ts">
	import type { IconProps } from './IconProps';

	const { class: classes = '', width = 24, height = 24 }: IconProps = $props();
</script>

<svg class={classes} {width} {height} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M10 19l-7-7m0 0l7-7m-7 7h18"
	></path>
</svg>
