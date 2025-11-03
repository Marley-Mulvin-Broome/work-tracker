<script lang="ts">
	import type { PageProps } from './$types';
	import { formatHours, formatDate, formatTime } from '$lib/utils/formatters';
	import {
		ArrowLeft,
		Clock,
		BarChart,
		Calendar,
		TrendUp,
		TrendDown,
		Minus
	} from '$lib/components/icons';
	import { Link, Table, TableRow, TableHeader, TableCell } from '$lib/components';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3">
				<Link
					href="/leaderboard"
					class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
				>
					<ArrowLeft class="h-6 w-6" />
				</Link>
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						{data.viewedUser.username}'s Profile
						{#if data.isOwnProfile}
							<span class="text-lg text-gray-500 dark:text-gray-400">(You)</span>
						{/if}
					</h1>
					<p class="mt-1 text-gray-600 dark:text-gray-400">View work activity and statistics</p>
				</div>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- Today's Hours -->
			<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-900">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Hours</p>
						<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
							{formatHours(data.stats.todayHours)}
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
							{formatHours(data.stats.thisWeekHours)}
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
							{formatHours(data.stats.lastWeekHours)}
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
							class:text-green-600={data.stats.weekOverWeekChange > 0}
							class:dark:text-green-400={data.stats.weekOverWeekChange > 0}
							class:text-red-600={data.stats.weekOverWeekChange < 0}
							class:dark:text-red-400={data.stats.weekOverWeekChange < 0}
							class:text-gray-900={data.stats.weekOverWeekChange === 0}
							class:dark:text-gray-100={data.stats.weekOverWeekChange === 0}
						>
							{data.stats.weekOverWeekChange > 0 ? '+' : ''}{data.stats.weekOverWeekChange.toFixed(
								1
							)}%
						</p>
					</div>
					<div
						class="rounded-full p-3"
						class:bg-green-100={data.stats.weekOverWeekChange > 0}
						class:dark:bg-green-900={data.stats.weekOverWeekChange > 0}
						class:bg-red-100={data.stats.weekOverWeekChange < 0}
						class:dark:bg-red-900={data.stats.weekOverWeekChange < 0}
						class:bg-gray-100={data.stats.weekOverWeekChange === 0}
						class:dark:bg-gray-700={data.stats.weekOverWeekChange === 0}
					>
						{#if data.stats.weekOverWeekChange > 0}
							<TrendUp class="h-6 w-6 text-green-600 dark:text-green-300" />
						{:else if data.stats.weekOverWeekChange < 0}
							<TrendDown class="h-6 w-6 text-red-600 dark:text-red-300" />
						{:else}
							<Minus class="h-6 w-6 text-gray-600 dark:text-gray-400" />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activities -->
		<div>
			<div class="mb-4">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Activities</h2>
			</div>

			<Table data={data.recentActivities} emptyMessage="No activities yet.">
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
							{formatTime(activity.startTime)}
						</TableCell>
						<TableCell class="whitespace-nowrap text-gray-500 dark:text-gray-400">
							{formatTime(activity.endTime)}
						</TableCell>
						<TableCell class="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
							{formatHours(activity.duration)}
						</TableCell>
					</TableRow>
				{/snippet}
			</Table>
		</div>
	</div>
</div>
