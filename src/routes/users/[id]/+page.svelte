<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeft } from '$lib/components/icons';
	import { Link, UserProfile } from '$lib/components';

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

		<UserProfile
			stats={data.stats}
			recentActivities={data.recentActivities}
			yearActivities={data.yearActivities}
		/>
	</div>
</div>
