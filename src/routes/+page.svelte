<script lang="ts">
	import type { PageProps } from './$types';
	import { UserProfile } from '$lib/components';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				Welcome back, {data.user.username}!
			</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-400">Here's your work summary</p>
		</div>

		<UserProfile
			stats={data.stats}
			recentActivities={data.recentActivities}
			yearActivities={data.yearActivities}
			emptyMessage="No activities yet. Start tracking your work!"
		/>
	</div>
</div>
