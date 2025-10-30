<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Button } from '$lib/components';

	let { form }: PageProps = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
		<div>
			<h1 class="text-3xl font-bold text-center text-gray-900">Work Tracker</h1>
			<p class="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
		</div>

		<form method="post" action="?/login" use:enhance class="mt-8 space-y-6">
			<div class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>

			{#if form?.message}
				<p class="text-red-600 text-sm text-center">{form.message}</p>
			{/if}

			<Button type="submit" class="w-full flex justify-center">
				Sign in
			</Button>
		</form>
	</div>
</div>
