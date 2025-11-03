<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Button, TextInput, PasswordInput } from '$lib/components';

	let { form }: PageProps = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
	<div
		class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 dark:shadow-gray-900"
	>
		<div>
			<h1 class="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">Work Tracker</h1>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
				Create the administrator account
			</p>
			<p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-500">
				This page is only available when no users exist in the system
			</p>
		</div>

		<form method="post" action="?/register" use:enhance class="mt-8 space-y-6">
			<div class="space-y-4">
				<TextInput id="username" name="username" label="Username" required />

				<PasswordInput id="password" name="password" label="Password" required />

				<PasswordInput
					id="confirmPassword"
					name="confirmPassword"
					label="Confirm Password"
					required
				/>
			</div>

			{#if form?.message}
				<p class="text-center text-sm text-red-600 dark:text-red-400">{form.message}</p>
			{/if}

			<Button type="submit" class="flex w-full justify-center">Create Admin Account</Button>
		</form>
	</div>
</div>
