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

	const displayValue = $derived(
		formatAsHours && typeof value === 'number' ? formatHours(value) : value
	);

	const colorClasses = {
		blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
		green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
		purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
		orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
		red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
	};

	const icons: Record<string, Component> = {
		clock: Clock,
		chart: BarChart,
		calendar: Calendar,
		trend: TrendUp
	};

	const IconComponent = $derived(icons[icon]);
</script>

<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
			<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
				{displayValue}
			</p>
		</div>
		<div class="rounded-full p-3 {colorClasses[color]}">
			<IconComponent class="h-6 w-6" />
		</div>
	</div>
</div>
