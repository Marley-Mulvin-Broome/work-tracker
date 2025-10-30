<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Button, Link } from '$lib/components';

	let { data, form }: PageProps = $props();

	let showUserModal = $state(false);
	let showApiKeyModal = $state(false);
	let showApiKeyValue = $state<string | null>(null);
	let searchQuery = $state(data.searchQuery);

	// Show API key after creation
	$effect(() => {
		if (form?.success && form?.apiKey) {
			showApiKeyValue = form.apiKey;
		}
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
		<p class="mt-2 text-sm text-gray-700">Manage users and API keys</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.message}
		<div
			class="mb-6 p-4 rounded-md"
			class:bg-green-50={form.success}
			class:bg-red-50={!form.success}
		>
			<p class:text-green-800={form.success} class:text-red-800={!form.success}>
				{form.message}
			</p>
		</div>
	{/if}

	<!-- User Management Section -->
	<div class="bg-white shadow rounded-lg mb-8">
		<div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
			<h2 class="text-xl font-semibold text-gray-900">Users</h2>
			<Button onclick={() => (showUserModal = true)}>
				Create User
			</Button>
		</div>

		<!-- Search -->
		<div class="px-6 py-4 border-b border-gray-200">
			<form method="get" class="flex gap-2">
				<input
					type="text"
					name="search"
					bind:value={searchQuery}
					placeholder="Search users..."
					class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button variant="secondary" type="submit">
					Search
				</Button>
			</form>
		</div>

		<!-- Users Table -->
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Username
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Role
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Created
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.users as user (user.id)}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<Link href="/users/{user.id}">
									{user.username}
								</Link>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								{#if user.isAdmin}
									<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
										Admin
									</span>
								{:else}
									<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
										User
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(user.createdAt).toLocaleDateString()}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm">
								{#if user.id !== data.user.id}
									<form method="post" action="?/deleteUser" use:enhance>
										<input type="hidden" name="userId" value={user.id} />
										<Button
											variant="text"
											size="sm"
											type="submit"
											class="text-red-600 hover:text-red-900"
											onclick={(e) => {
												if (!confirm(`Are you sure you want to delete ${user.username}?`)) {
													e.preventDefault();
												}
											}}
										>
											Delete
										</Button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- API Keys Section -->
	<div class="bg-white shadow rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
			<h2 class="text-xl font-semibold text-gray-900">API Keys</h2>
			<Button onclick={() => (showApiKeyModal = true)}>
				Create API Key
			</Button>
		</div>

		<!-- API Keys Table -->
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							User
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Last Used
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Created
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.apiKeys as apiKey (apiKey.id)}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{apiKey.name}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{apiKey.username}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(apiKey.createdAt).toLocaleDateString()}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm">
								<form method="post" action="?/deleteApiKey" use:enhance>
									<input type="hidden" name="apiKeyId" value={apiKey.id} />
									<Button
										variant="text"
										size="sm"
										type="submit"
										class="text-red-600 hover:text-red-900"
										onclick={(e) => {
											if (!confirm(`Are you sure you want to delete API key "${apiKey.name}"?`)) {
												e.preventDefault();
											}
										}}
									>
										Delete
									</Button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Create User Modal -->
{#if showUserModal}
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
			<form method="post" action="?/createUser" use:enhance>
				<div class="space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							required
							minlength="3"
							maxlength="31"
							pattern="[a-zA-Z0-9_]+"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							minlength="6"
							maxlength="255"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div class="flex items-center">
						<input
							type="checkbox"
							id="isAdmin"
							name="isAdmin"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label for="isAdmin" class="ml-2 block text-sm text-gray-700">Admin user</label>
					</div>
				</div>
				<div class="mt-6 flex gap-3">
					<Button type="submit" class="flex-1">
						Create User
					</Button>
					<Button variant="secondary" type="button" onclick={() => (showUserModal = false)} class="flex-1">
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Create API Key Modal -->
{#if showApiKeyModal}
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
			<form method="post" action="?/createApiKey" use:enhance>
				<div class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700">Key Name</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							placeholder="e.g., Mobile App Key"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="userId" class="block text-sm font-medium text-gray-700">User</label>
						<select
							id="userId"
							name="userId"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Select user (default: you)</option>
							{#each data.users as user (user.id)}
								<option value={user.id}>{user.username}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="mt-6 flex gap-3">
					<Button type="submit" class="flex-1">
						Create API Key
					</Button>
					<Button variant="secondary" type="button" onclick={() => (showApiKeyModal = false)} class="flex-1">
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Show API Key Value Modal -->
{#if showApiKeyValue}
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-lg w-full p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">API Key Created</h3>
			<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
				<p class="text-sm text-yellow-700">
					⚠️ Make sure to copy your API key now. You won't be able to see it again!
				</p>
			</div>
			<div class="bg-gray-50 p-4 rounded-md mb-4">
				<code class="text-sm font-mono break-all">{showApiKeyValue}</code>
			</div>
			<div class="flex gap-3">
				<Button
					type="button"
					onclick={() => {
						navigator.clipboard.writeText(showApiKeyValue || '');
					}}
					class="flex-1"
				>
					Copy to Clipboard
				</Button>
				<Button variant="secondary" type="button" onclick={() => (showApiKeyValue = null)} class="flex-1">
					Close
				</Button>
			</div>
		</div>
	</div>
{/if}
