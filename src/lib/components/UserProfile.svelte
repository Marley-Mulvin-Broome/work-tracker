<script lang="ts">
	import { formatHours, formatDate, formatTime } from '$lib/utils/formatters';
	import { Clock, BarChart, Calendar, TrendUp, TrendDown, Minus } from '$lib/components/icons';
	import { Table, TableRow, TableHeader, TableCell, ActivityCalendar } from '$lib/components';
	import type { Snippet } from 'svelte';

	type Stats = {
		todayHours: number;
		thisWeekHours: number;
		lastWeekHours: number;
		weekOverWeekChange: number;
	};

	type Activity = {
		date: Date;
		name: string;
		description: string | null;
		startTime: string | null;
		endTime: string | null;
		duration: number;
	};

	type YearActivity = {
		date: Date;
		hours: number;
	};

	type Props = {
		stats: Stats;
		recentActivities: Activity[];
		yearActivities?: YearActivity[];
		emptyMessage?: string;
		headerSnippet?: Snippet;
	};

	let {
		stats,
		recentActivities,
		yearActivities = [],
		emptyMessage = 'No activities yet.',
		headerSnippet
	}: Props = $props();
</script>

<!-- Stats Grid -->
<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
	<!-- Today's Hours -->
	<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Hours</p>
				<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
					{formatHours(stats.todayHours)}
				</p>
			</div>
			<div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
				<Clock class="h-6 w-6 text-blue-600 dark:text-blue-300" />
			</div>
		</div>
	</div>

	<!-- This Week's Hours -->
	<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
				<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
					{formatHours(stats.thisWeekHours)}
				</p>
			</div>
			<div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
				<BarChart class="h-6 w-6 text-green-600 dark:text-green-300" />
			</div>
		</div>
	</div>

	<!-- Last Week's Hours -->
	<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Last Week</p>
				<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
					{formatHours(stats.lastWeekHours)}
				</p>
			</div>
			<div class="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
				<Calendar class="h-6 w-6 text-purple-600 dark:text-purple-300" />
			</div>
		</div>
	</div>

	<!-- Week-over-Week Change -->
	<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Week-over-Week</p>
				<p
					class="mt-2 text-3xl font-bold"
					class:text-green-600={stats.weekOverWeekChange > 0}
					class:dark:text-green-400={stats.weekOverWeekChange > 0}
					class:text-red-600={stats.weekOverWeekChange < 0}
					class:dark:text-red-400={stats.weekOverWeekChange < 0}
					class:text-gray-900={stats.weekOverWeekChange === 0}
					class:dark:text-gray-100={stats.weekOverWeekChange === 0}
				>
					{stats.weekOverWeekChange > 0 ? '+' : ''}{stats.weekOverWeekChange.toFixed(1)}%
				</p>
			</div>
			<div
				class="rounded-full p-3"
				class:bg-green-100={stats.weekOverWeekChange > 0}
				class:dark:bg-green-900={stats.weekOverWeekChange > 0}
				class:bg-red-100={stats.weekOverWeekChange < 0}
				class:dark:bg-red-900={stats.weekOverWeekChange < 0}
				class:bg-gray-100={stats.weekOverWeekChange === 0}
				class:dark:bg-gray-700={stats.weekOverWeekChange === 0}
			>
				{#if stats.weekOverWeekChange > 0}
					<TrendUp class="h-6 w-6 text-green-600 dark:text-green-300" />
				{:else if stats.weekOverWeekChange < 0}
					<TrendDown class="h-6 w-6 text-red-600 dark:text-red-300" />
				{:else}
					<Minus class="h-6 w-6 text-gray-600 dark:text-gray-400" />
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Header Section (optional) -->
{#if headerSnippet}
	{@render headerSnippet()}
{/if}

<!-- Activity Calendar -->
{#if yearActivities.length > 0}
	<div class="mb-8">
		<div class="mb-4">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
				{new Date().getFullYear()} Activity
			</h2>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
				Hours worked each day throughout the year
			</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
			<ActivityCalendar data={yearActivities} />
		</div>
	</div>
{/if}

<!-- Recent Activities -->
<div>
	<div class="mb-4">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Activities</h2>
	</div>

	<Table data={recentActivities} {emptyMessage}>
		{#snippet headerSnippet()}
			<tr>
				<TableHeader>Date</TableHeader>
				<TableHeader>Activity</TableHeader>
				<TableHeader>Start Time</TableHeader>
				<TableHeader>End Time</TableHeader>
				<TableHeader>Duration</TableHeader>
			</tr>
		{/snippet}

		{#snippet rowSnippet(activity)}
			<TableRow>
				<TableCell class="whitespace-nowrap text-gray-900 dark:text-gray-100">
					{formatDate(activity.date)}
				</TableCell>
				<TableCell class="text-gray-900 dark:text-gray-100">
					<div class="font-medium">{activity.name}</div>
					{#if activity.description}
						<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							{activity.description}
						</div>
					{/if}
				</TableCell>
				<TableCell class="whitespace-nowrap text-gray-500 dark:text-gray-400">
					{activity.startTime ? formatTime(activity.startTime) : '-'}
				</TableCell>
				<TableCell class="whitespace-nowrap text-gray-500 dark:text-gray-400">
					{activity.endTime ? formatTime(activity.endTime) : '-'}
				</TableCell>
				<TableCell class="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
					{formatHours(activity.duration)}
				</TableCell>
			</TableRow>
		{/snippet}
	</Table>
</div>
