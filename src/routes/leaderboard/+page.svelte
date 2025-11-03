<script lang="ts">
	import type { PageProps } from './$types';
	import { formatHours, formatDate } from '$lib/utils/formatters';
	import { Link } from '$lib/components';

	let { data }: PageProps = $props();

	function getRankIcon(rank: number): string {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `#${rank}`;
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h1>
		<p class="mt-1 text-gray-600 dark:text-gray-400">
			Week of {formatDate(data.weekStart)} - {formatDate(data.weekEnd)}
		</p>
	</div>

	<!-- Leaderboard -->
	<div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-gray-900">
		{#if data.leaderboard.length === 0}
			<div class="px-6 py-12 text-center">
				<p class="text-gray-500 dark:text-gray-400">No data available for this week.</p>
			</div>
		{:else}
			<div class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.leaderboard as entry (entry.userId)}
					<Link
						href="/users/{entry.userId}"
						variant="card"
						class="block px-6 py-4 {entry.userId === data.user.id
							? 'bg-blue-50 dark:bg-blue-900/20'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div class="flex flex-1 items-center space-x-4">
								<!-- Rank Badge -->
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
									class:bg-yellow-100={entry.rank === 1}
									class:dark:bg-yellow-900={entry.rank === 1}
									class:text-yellow-600={entry.rank === 1}
									class:dark:text-yellow-300={entry.rank === 1}
									class:bg-gray-200={entry.rank === 2}
									class:dark:bg-gray-700={entry.rank === 2}
									class:text-gray-600={entry.rank === 2}
									class:dark:text-gray-300={entry.rank === 2}
									class:bg-orange-100={entry.rank === 3}
									class:dark:bg-orange-900={entry.rank === 3}
									class:text-orange-600={entry.rank === 3}
									class:dark:text-orange-300={entry.rank === 3}
									class:bg-gray-100={entry.rank > 3}
									class:dark:bg-gray-800={entry.rank > 3}
									class:text-gray-500={entry.rank > 3}
									class:dark:text-gray-400={entry.rank > 3}
								>
									{getRankIcon(entry.rank)}
								</div>

								<!-- User Info -->
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
											{entry.username}
										</p>
										{#if entry.userId === data.user.id}
											<span
												class="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
											>
												You
											</span>
										{/if}
									</div>
								</div>

								<!-- Hours -->
								<div class="shrink-0">
									<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
										{formatHours(entry.totalHours)}
									</p>
								</div>
							</div>
						</div>

						<!-- Progress Bar (optional visual) -->
						{#if data.leaderboard[0]?.totalHours > 0}
							<div class="mt-2">
								<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
									<div
										class="h-2 rounded-full transition-all"
										class:bg-yellow-500={entry.rank === 1}
										class:dark:bg-yellow-400={entry.rank === 1}
										class:bg-gray-400={entry.rank === 2}
										class:dark:bg-gray-500={entry.rank === 2}
										class:bg-orange-400={entry.rank === 3}
										class:dark:bg-orange-500={entry.rank === 3}
										class:bg-blue-500={entry.rank > 3}
										class:dark:bg-blue-400={entry.rank > 3}
										style:width="{(entry.totalHours / data.leaderboard[0].totalHours) * 100}%"
									></div>
								</div>
							</div>
						{/if}
					</Link>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Stats Summary -->
	{#if data.leaderboard.length > 0}
		<div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:shadow-gray-900">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Top Performer</p>
				<p class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
					{data.leaderboard[0]?.username}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{formatHours(data.leaderboard[0]?.totalHours)}
				</p>
			</div>

			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:shadow-gray-900">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Your Rank</p>
				<p class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
					{data.leaderboard.find((e) => e.userId === data.user.id)?.rank ?? '-'}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{formatHours(data.leaderboard.find((e) => e.userId === data.user.id)?.totalHours ?? 0)}
				</p>
			</div>

			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:shadow-gray-900">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Team Total</p>
				<p class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
					{formatHours(data.leaderboard.reduce((sum, e) => sum + e.totalHours, 0))}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">{data.leaderboard.length} members</p>
			</div>
		</div>
	{/if}
</div>
