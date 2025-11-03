<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Button, TextInput, PasswordInput } from '$lib/components';

	let { form }: PageProps = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
		<div>
			<h1 class="text-center text-3xl font-bold text-gray-900">Work Tracker</h1>
			<p class="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
		</div>

		<form method="post" action="?/login" use:enhance class="mt-8 space-y-6">
			<div class="space-y-4">
				<TextInput id="username" name="username" label="Username" required />

				<PasswordInput id="password" name="password" label="Password" required />
			</div>

			{#if form?.message}
				<p class="text-center text-sm text-red-600">{form.message}</p>
			{/if}

			<Button type="submit" class="flex w-full justify-center">Sign in</Button>
		</form>
	</div>
</div>
