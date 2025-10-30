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
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path>
</svg>
