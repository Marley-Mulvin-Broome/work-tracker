<script lang="ts">
	import { formatHours } from '$lib/utils/formatters';
	import { Clock, BarChart, Calendar, TrendUp } from '$lib/components/icons';
	import type { Component } from 'svelte';

	type Props = {
		title: string;
		value: number | string;
		icon: 'clock' | 'chart' | 'calendar' | 'trend';
		color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
		formatAsHours?: boolean;
	};

	let { title, value, icon, color = 'blue', formatAsHours = false }: Props = $props();

	const displayValue = $derived(formatAsHours && typeof value === 'number' ? formatHours(value) : value);

	const colorClasses = {
		blue: 'bg-blue-100 text-blue-600',
		green: 'bg-green-100 text-green-600',
		purple: 'bg-purple-100 text-purple-600',
		orange: 'bg-orange-100 text-orange-600',
		red: 'bg-red-100 text-red-600'
	};

	const icons: Record<string, Component> = {
		clock: Clock,
		chart: BarChart,
		calendar: Calendar,
		trend: TrendUp
	};

	const IconComponent = $derived(icons[icon]);
</script>

<div class="bg-white rounded-lg shadow p-6">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-medium text-gray-600">{title}</p>
			<p class="text-3xl font-bold text-gray-900 mt-2">
				{displayValue}
			</p>
		</div>
		<div class="rounded-full p-3 {colorClasses[color]}">
			<IconComponent class="w-6 h-6" />
		</div>
	</div>
</div>
