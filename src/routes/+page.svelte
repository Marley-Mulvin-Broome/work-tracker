<script lang="ts">
	import type { PageProps } from './$types';
	import { formatHours, formatDate, formatTime } from '$lib/utils/formatters';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import { Clock, BarChart, Calendar, TrendUp, TrendDown, Minus } from '$lib/components/icons';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Welcome back, {data.user.username}!</h1>
			<p class="text-gray-600 mt-1">Here's your work summary</p>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Today's Hours -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Today's Hours</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">
							{formatHours(data.stats.todayHours)}
						</p>
					</div>
					<div class="bg-blue-100 rounded-full p-3">
						<Clock class="w-6 h-6 text-blue-600" />
					</div>
				</div>
			</div>

			<!-- This Week's Hours -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">This Week</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">
							{formatHours(data.stats.thisWeekHours)}
						</p>
					</div>
					<div class="bg-green-100 rounded-full p-3">
						<BarChart class="w-6 h-6 text-green-600" />
					</div>
				</div>
			</div>

			<!-- Last Week's Hours -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Last Week</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">
							{formatHours(data.stats.lastWeekHours)}
						</p>
					</div>
					<div class="bg-purple-100 rounded-full p-3">
						<Calendar class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>

			<!-- Week-over-Week Change -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Week-over-Week</p>
						<p
							class="text-3xl font-bold mt-2"
							class:text-green-600={data.stats.weekOverWeekChange > 0}
							class:text-red-600={data.stats.weekOverWeekChange < 0}
							class:text-gray-900={data.stats.weekOverWeekChange === 0}
						>
							{data.stats.weekOverWeekChange > 0 ? '+' : ''}{data.stats.weekOverWeekChange.toFixed(
								1
							)}%
						</p>
					</div>
					<div
						class="rounded-full p-3"
						class:bg-green-100={data.stats.weekOverWeekChange > 0}
						class:bg-red-100={data.stats.weekOverWeekChange < 0}
						class:bg-gray-100={data.stats.weekOverWeekChange === 0}
					>
						{#if data.stats.weekOverWeekChange > 0}
							<TrendUp class="w-6 h-6 text-green-600" />
						{:else if data.stats.weekOverWeekChange < 0}
							<TrendDown class="w-6 h-6 text-red-600" />
						{:else}
							<Minus class="w-6 h-6 text-gray-600" />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activities -->
		<div class="bg-white rounded-lg shadow">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-xl font-semibold text-gray-900">Recent Activities</h2>
			</div>
			<div class="overflow-x-auto">
				{#if data.recentActivities.length === 0}
					<div class="px-6 py-12 text-center">
						<p class="text-gray-500">No activities yet. Start tracking your work!</p>
					</div>
				{:else}
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Date
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Activity
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Start Time
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									End Time
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Duration
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each data.recentActivities as activity (activity.id)}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatDate(activity.date)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-900">
										<div class="font-medium">{activity.name}</div>
										{#if activity.description}
											<div class="text-gray-500 text-xs mt-1">{activity.description}</div>
										{/if}
									</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{activity.startTime ? formatTime(activity.startTime) : '-'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{activity.endTime ? formatTime(activity.endTime) : '-'}
								</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{formatHours(activity.duration)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
