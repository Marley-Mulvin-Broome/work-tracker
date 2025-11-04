<script lang="ts">
	import * as d3 from 'd3';
	import { formatHours } from '$lib/utils/formatters';
	import { SvelteMap } from 'svelte/reactivity';

	type DayActivity = {
		date: Date;
		hours: number;
	};

	type Props = {
		data: DayActivity[];
		year?: number;
	};

	let { data, year = new Date().getFullYear() }: Props = $props();

	let containerRef: HTMLDivElement;
	let tooltipRef: HTMLDivElement;
	let isDarkMode = $state(false);

	// Detect dark mode
	$effect(() => {
		if (typeof window === 'undefined') return;

		const checkDarkMode = () => {
			isDarkMode = document.documentElement.classList.contains('dark');
		};

		// Initial check
		checkDarkMode();

		// Watch for changes
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

	// Calendar configuration
	const cellSize = 12;
	const cellPadding = 2;
	const weekHeight = cellSize + cellPadding;
	const monthLabelHeight = 20;

	// Color scales for light and dark themes
	const lightColorScale = d3.scaleThreshold<number, string>().domain([0.1, 2, 4, 6, 8]).range([
		'#ebedf0', // 0 hours (light gray)
		'#9cd5ff', // < 2 hours (light blue)
		'#58a6ff', // 2-4 hours (medium blue)
		'#1f6feb', // 4-6 hours (dark blue)
		'#0d419d' // 6+ hours (darkest blue)
	]);

	const darkColorScale = d3.scaleThreshold<number, string>().domain([0.1, 2, 4, 6, 8]).range([
		'#161b22', // 0 hours (dark gray)
		'#0a3069', // < 2 hours (dark blue)
		'#0d419d', // 2-4 hours (medium blue)
		'#1f6feb', // 4-6 hours (bright blue)
		'#58a6ff' // 6+ hours (brightest blue)
	]);

	// Create a map for quick lookup
	const activityMap = $derived.by(() => {
		const map = new SvelteMap<string, number>();
		data.forEach((d) => {
			const dateStr = d3.timeFormat('%Y-%m-%d')(d.date);
			map.set(dateStr, d.hours);
		});
		return map;
	});

	function getActivityForDate(date: Date): number {
		const dateStr = d3.timeFormat('%Y-%m-%d')(date);
		return activityMap.get(dateStr) || 0;
	}

	function showTooltip(event: MouseEvent, date: Date, hours: number) {
		const tooltip = tooltipRef;
		if (!tooltip) return;

		const dateStr = d3.timeFormat('%B %d, %Y')(date);
		tooltip.innerHTML = `
			<div class="font-medium">${dateStr}</div>
			<div class="text-sm">${formatHours(hours)}</div>
		`;

		tooltip.style.display = 'block';
		tooltip.style.left = `${event.pageX + 10}px`;
		tooltip.style.top = `${event.pageY - 10}px`;
	}

	function hideTooltip() {
		if (tooltipRef) {
			tooltipRef.style.display = 'none';
		}
	}

	$effect(() => {
		if (!containerRef) return;

		// Clear previous render
		d3.select(containerRef).selectAll('*').remove();

		// Get all weeks in the year
		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31);

		// Select appropriate color scale based on theme
		const colorScale = isDarkMode ? darkColorScale : lightColorScale;
		const strokeColor = isDarkMode ? '#30363d' : '#1b1f23';
		const textColor = isDarkMode ? '#c9d1d9' : '#24292f';

		// Calculate dimensions
		const weeksInYear = d3.timeWeeks(
			d3.timeWeek.floor(startDate),
			d3.timeWeek.ceil(endDate)
		).length;
		const width = weeksInYear * (cellSize + cellPadding) + 100;
		const height = 7 * weekHeight + monthLabelHeight + 20;

		// Create SVG
		const svg = d3
			.select(containerRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'activity-calendar');

		// Create main group
		const g = svg.append('g').attr('transform', `translate(50, ${monthLabelHeight})`);

		// Generate all days in the year
		const days = d3.timeDays(startDate, d3.timeDay.offset(endDate, 1));

		// Draw cells
		g.selectAll('rect')
			.data(days)
			.join('rect')
			.attr('width', cellSize)
			.attr('height', cellSize)
			.attr('x', (d: Date) => d3.timeWeek.count(d3.timeYear(d), d) * (cellSize + cellPadding))
			.attr('y', (d: Date) => d.getDay() * weekHeight)
			.attr('rx', 2)
			.attr('ry', 2)
			.attr('fill', (d: Date) => {
				const hours = getActivityForDate(d);
				return colorScale(hours);
			})
			.attr('stroke', strokeColor)
			.attr('stroke-width', 0.5)
			.attr('class', 'calendar-cell')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.on('mouseenter', function (this: d3.BaseType | SVGRectElement, event: any, d: Date) {
				d3.select(this as SVGRectElement).attr('stroke-width', 2);
				const hours = getActivityForDate(d);
				showTooltip(event, d, hours);
			})
			.on('mouseleave', function (this: d3.BaseType | SVGRectElement) {
				d3.select(this as SVGRectElement).attr('stroke-width', 0.5);
				hideTooltip();
			});

		// Add month labels
		const months = d3.timeMonths(startDate, endDate);
		g.selectAll('text.month')
			.data(months)
			.join('text')
			.attr('class', 'month')
			.attr('x', (d: Date) => d3.timeWeek.count(d3.timeYear(d), d) * (cellSize + cellPadding))
			.attr('y', -5)
			.attr('font-size', '10px')
			.attr('fill', textColor)
			.text((d: Date) => d3.timeFormat('%b')(d));

		// Add day labels (Mon, Wed, Fri)
		const dayLabels = ['Mon', 'Wed', 'Fri'];
		const dayIndices = [1, 3, 5];

		g.selectAll('text.day')
			.data(dayIndices)
			.join('text')
			.attr('class', 'day')
			.attr('x', -5)
			.attr('y', (d: number) => d * weekHeight + cellSize / 2)
			.attr('text-anchor', 'end')
			.attr('dominant-baseline', 'middle')
			.attr('font-size', '9px')
			.attr('fill', textColor)
			.text((d: number, i: number) => dayLabels[i]);
	});
</script>

<div class="activity-calendar-container">
	<div bind:this={containerRef} class="calendar-wrapper"></div>

	<div
		bind:this={tooltipRef}
		class="tooltip fixed z-50 rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:border dark:border-gray-600 dark:bg-gray-700"
		style="display: none; pointer-events: none;"
	></div>
</div>

<style>
	.activity-calendar-container {
		overflow-x: auto;
		padding: 1rem 0;
	}

	.calendar-wrapper {
		min-width: fit-content;
	}

	:global(.calendar-cell) {
		cursor: pointer;
		transition: stroke-width 0.1s ease;
	}

	:global(.activity-calendar) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
</style>
