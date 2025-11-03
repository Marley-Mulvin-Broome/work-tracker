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
	import { Link } from '$lib/components';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3">
				<Link href="/leaderboard" class="text-blue-600 hover:text-blue-800">
					<ArrowLeft class="h-6 w-6" />
				</Link>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						{data.viewedUser.username}'s Profile
						{#if data.isOwnProfile}
							<span class="text-lg text-gray-500">(You)</span>
						{/if}
					</h1>
					<p class="mt-1 text-gray-600">View work activity and statistics</p>
				</div>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- Today's Hours -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Today's Hours</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{formatHours(data.stats.todayHours)}
						</p>
					</div>
					<div class="rounded-full bg-blue-100 p-3">
						<Clock class="h-6 w-6 text-blue-600" />
					</div>
				</div>
			</div>

			<!-- This Week's Hours -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">This Week</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{formatHours(data.stats.thisWeekHours)}
						</p>
					</div>
					<div class="rounded-full bg-green-100 p-3">
						<BarChart class="h-6 w-6 text-green-600" />
					</div>
				</div>
			</div>

			<!-- Last Week's Hours -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Last Week</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{formatHours(data.stats.lastWeekHours)}
						</p>
					</div>
					<div class="rounded-full bg-purple-100 p-3">
						<Calendar class="h-6 w-6 text-purple-600" />
					</div>
				</div>
			</div>

			<!-- Week-over-Week Change -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Week-over-Week</p>
						<p
							class="mt-2 text-3xl font-bold"
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
							<TrendUp class="h-6 w-6 text-green-600" />
						{:else if data.stats.weekOverWeekChange < 0}
							<TrendDown class="h-6 w-6 text-red-600" />
						{:else}
							<Minus class="h-6 w-6 text-gray-600" />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activities -->
		<div class="rounded-lg bg-white shadow">
			<div class="border-b border-gray-200 px-6 py-4">
				<h2 class="text-xl font-semibold text-gray-900">Recent Activities</h2>
			</div>
			<div class="overflow-x-auto">
				{#if data.recentActivities.length === 0}
					<div class="px-6 py-12 text-center">
						<p class="text-gray-500">No activities yet.</p>
					</div>
				{:else}
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Date
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Activity
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Start Time
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									End Time
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Duration
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.recentActivities as activity (activity.id)}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
										{formatDate(activity.date)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-900">
										<div class="font-medium">{activity.name}</div>
										{#if activity.description}
											<div class="mt-1 text-xs text-gray-500">{activity.description}</div>
										{/if}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{formatTime(activity.startTime)}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{formatTime(activity.endTime)}
									</td>
									<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
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
