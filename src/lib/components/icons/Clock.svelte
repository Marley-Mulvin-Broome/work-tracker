<script lang="ts">
	import type { IconProps } from './IconProps';

	const { class: classes = '', width = 24, height = 24 }: IconProps = $props();
</script>

<svg class={classes} {width} {height} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
	></path>
</svg>
