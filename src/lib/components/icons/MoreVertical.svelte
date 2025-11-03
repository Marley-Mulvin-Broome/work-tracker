<script lang="ts">
	import type { IconProps } from './IconProps';

	const { class: classes = '', width = 24, height = 24 }: IconProps = $props();
</script>

<svg class={classes} {width} {height} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<circle cx="12" cy="12" r="1" fill="currentColor"></circle>
	<circle cx="12" cy="5" r="1" fill="currentColor"></circle>
	<circle cx="12" cy="19" r="1" fill="currentColor"></circle>
</svg>
