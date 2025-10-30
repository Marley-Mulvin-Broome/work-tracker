<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function formatHours(hours: number): string {
		if (hours === 0) return '0h';
		const h = Math.floor(hours);
		const m = Math.round((hours - h) * 60);
		if (m === 0) return `${h}h`;
		return `${h}h ${m}m`;
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return '-';
		const [hours, minutes] = timeStr.split(':');
		const h = parseInt(hours);
		const ampm = h >= 12 ? 'PM' : 'AM';
		const displayHour = h % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3">
				<a href="/leaderboard" class="text-blue-600 hover:text-blue-800">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
				</a>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						{data.viewedUser.username}'s Profile
						{#if data.isOwnProfile}
							<span class="text-lg text-gray-500">(You)</span>
						{/if}
					</h1>
					<p class="text-gray-600 mt-1">View work activity and statistics</p>
				</div>
			</div>
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
						<svg
							class="w-6 h-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
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
						<svg
							class="w-6 h-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
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
						<svg
							class="w-6 h-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path>
						</svg>
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
							<svg
								class="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								></path>
							</svg>
						{:else if data.stats.weekOverWeekChange < 0}
							<svg
								class="w-6 h-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
								></path>
							</svg>
						{:else}
							<svg
								class="w-6 h-6 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 12h14"
								></path>
							</svg>
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
						<p class="text-gray-500">No activities yet.</p>
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
										{formatTime(activity.startTime)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatTime(activity.endTime)}
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
