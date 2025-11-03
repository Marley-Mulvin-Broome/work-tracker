export type PopoverVerticalOrigin = 'top' | 'bottom' | 'center';
export type PopoverHorizontalOrigin = 'left' | 'right' | 'center';

export type PopoverOrigin = {
	vertical: PopoverVerticalOrigin;
	horizontal: PopoverHorizontalOrigin;
	offsetX?: number;
	offsetY?: number;
};

interface PopoverStateOptions {
	anchorEl?: HTMLElement | null;
	targetEl?: HTMLElement | null;
	anchorOrigin?: PopoverOrigin;
}

/**
 * State management for a popover component.
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import PopoverState from '$lib/logic/state/popover.svelte';
 * 
 * const positionState = $derived(
		new PopoverState({
			anchorEl,
			targetEl,
			anchorOrigin: positionOptions
		})
	);
	 * </script>
	 * <div bind:this={anchorEl}>Anchor Element</div>
	 * <button popovertarget="myPopover"> Open Popover </button>
	 * <div
		bind:this={targetEl}
		popover="auto"
		id="myPopover"
		style="position: absolute; top: {positionState.top}px; left: {positionState.left}px;"
	>
		Popover Content
	</div>
 * ```
 */
export default class PopoverState {
	anchorElement: HTMLElement | null = $state(null);
	targetElement: HTMLElement | null = $state(null);
	anchorOrigin: PopoverOrigin = $state({
		vertical: 'bottom',
		horizontal: 'left'
	});

	targetElementSize = $state({ width: 0, height: 0 });
	position = $derived.by(() => {
		if (!this.anchorElement) return { top: 0, left: 0 };
		const rect = this.anchorElement.getBoundingClientRect();
		let top = 0;
		let left = 0;

		// Vertical position
		switch (this.anchorOrigin.vertical) {
			case 'top':
				top = rect.y - this.targetElementSize.height;
				break;
			case 'bottom':
				top = rect.y + rect.height;
				break;
			case 'center':
				top = rect.y + rect.height / 2 - this.targetElementSize.height / 2;
				break;
		}

		// Horizontal position
		switch (this.anchorOrigin.horizontal) {
			case 'left':
				left = rect.x - this.targetElementSize.width + rect.width;
				break;
			case 'right':
				left = rect.x + rect.width;
				break;
			case 'center':
				left = rect.x + rect.width / 2 - this.targetElementSize.width / 2;
				break;
		}

		top += window.scrollY;
		left += window.scrollX;

		// Apply offsets if any
		if (this.anchorOrigin.offsetX) {
			left += this.anchorOrigin.offsetX;
		}
		if (this.anchorOrigin.offsetY) {
			top += this.anchorOrigin.offsetY;
		}

		return { top, left };
	});

	constructor(options: PopoverStateOptions) {
		const { anchorEl = null, targetEl = null, anchorOrigin } = options;
		this.anchorElement = anchorEl;
		this.targetElement = targetEl;
		if (anchorOrigin) this.anchorOrigin = anchorOrigin;
	}
}
