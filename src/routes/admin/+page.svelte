<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import {
		Button,
		Link,
		SearchInput,
		TextInput,
		PasswordInput,
		CheckboxInput,
		SelectInput,
		Table,
		TableRow,
		TableHeader,
		TableCell
	} from '$lib/components';
	import { MoreVertical } from '$lib/components/icons';
	import PopoverState from '$lib/state/popover.svelte';

	let { data, form }: PageProps = $props();

	let showUserModal = $state(false);
	let showApiKeyModal = $state(false);
	let showApiKeyValue = $state<string | null>(null);
	let selectedUserId = $state<string | null>(null);
	let selectedUsername = $state<string>('');
	let searchQuery = $state(data.searchQuery);

	// Debounce search to avoid too many requests
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearchChange(value: string) {
		searchQuery = value;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			// Update URL with search query
			const url = new URL(window.location.href);
			if (value) {
				url.searchParams.set('search', value);
			} else {
				url.searchParams.delete('search');
			}
			window.location.href = url.toString();
		}, 500);
	}

	// Store anchor elements and popover states for each user menu
	let userMenuAnchors = $state<Record<string, HTMLElement | null>>({});
	let userMenuTargets = $state<Record<string, HTMLElement | null>>({});
	let userMenuStates = $derived.by(() => {
		const states: Record<string, PopoverState> = {};
		for (const userId in userMenuAnchors) {
			states[userId] = new PopoverState({
				anchorEl: userMenuAnchors[userId],
				targetEl: userMenuTargets[userId],
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'left',
					offsetY: 4
				}
			});
		}
		return states;
	});

	// Show API key after creation
	$effect(() => {
		if (form?.success && form?.apiKey) {
			showApiKeyValue = form.apiKey;
		}
	});

	// Update target element sizes when they change
	$effect(() => {
		for (const userId in userMenuTargets) {
			const target = userMenuTargets[userId];
			if (target) {
				const rect = target.getBoundingClientRect();
				if (userMenuStates[userId]) {
					userMenuStates[userId].targetElementSize = {
						width: rect.width,
						height: rect.height
					};
				}
			}
		}
	});

	function openPasswordModal(userId: string, username: string, popoverId: string) {
		selectedUserId = userId;
		selectedUsername = username;
		// Close the menu popover
		const menuPopover = document.getElementById(popoverId);
		if (menuPopover) {
			menuPopover.hidePopover();
		}
		// Open password modal
		const passwordModal = document.getElementById('password-modal');
		if (passwordModal) {
			passwordModal.showPopover();
		}
	}

	function closePasswordModal() {
		const passwordModal = document.getElementById('password-modal');
		if (passwordModal) {
			passwordModal.hidePopover();
		}
		selectedUserId = null;
		selectedUsername = '';
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
		<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Manage users and API keys</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.message}
		<div
			class="mb-6 rounded-md p-4"
			class:bg-green-50={form.success}
			class:dark:bg-green-950={form.success}
			class:bg-red-50={!form.success}
			class:dark:bg-red-950={!form.success}
		>
			<p
				class:text-green-800={form.success}
				class:dark:text-green-200={form.success}
				class:text-red-800={!form.success}
				class:dark:text-red-200={!form.success}
			>
				{form.message}
			</p>
		</div>
	{/if}

	<!-- User Management Section -->
	<div class="mb-8 rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div
			class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
		>
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Users</h2>
			<Button onclick={() => (showUserModal = true)}>Create User</Button>
		</div>

		<!-- Search -->
		<div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
			<SearchInput
				name="search"
				value={searchQuery}
				oninput={(e) => handleSearchChange(e.currentTarget.value)}
				placeholder="Search users..."
			/>
		</div>

		<!-- Users Table -->
		<div class="overflow-x-auto">
			<Table data={data.users} emptyMessage="No users found." class="rounded-none shadow-none">
				{#snippet headerSnippet()}
					<tr>
						<TableHeader>Username</TableHeader>
						<TableHeader>Role</TableHeader>
						<TableHeader>Created</TableHeader>
						<TableHeader class="text-right">Actions</TableHeader>
					</tr>
				{/snippet}

				{#snippet rowSnippet(user)}
					<TableRow hoverable={false}>
						<TableCell class="whitespace-nowrap">
							<Link href="/users/{user.id}">
								{user.username}
							</Link>
						</TableCell>
						<TableCell class="whitespace-nowrap">
							{#if user.isAdmin}
								<span
									class="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200"
								>
									Admin
								</span>
							{:else}
								<span
									class="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									User
								</span>
							{/if}
						</TableCell>
						<TableCell class="whitespace-nowrap text-gray-500 dark:text-gray-400">
							{new Date(user.createdAt).toLocaleDateString()}
						</TableCell>
						<TableCell class="text-right whitespace-nowrap">
							<div class="relative">
								<button
									type="button"
									popovertarget="user-menu-{user.id}"
									bind:this={userMenuAnchors[user.id]}
									class="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label="User options"
								>
									<MoreVertical width={20} height={20} class="text-gray-600 dark:text-gray-400" />
								</button>

								<div
									popover
									id="user-menu-{user.id}"
									bind:this={userMenuTargets[user.id]}
									style="top: {userMenuStates[user.id]?.position.top ?? 0}px; left: {userMenuStates[
										user.id
									]?.position.left ?? 0}px;"
									class="m-0 w-48 rounded-md border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
								>
									<div class="py-1">
										<button
											type="button"
											onclick={() =>
												openPasswordModal(user.id, user.username, 'user-menu-{user.id}')}
											class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
										>
											Change Password
										</button>
										{#if user.id !== data.user.id}
											<form method="post" action="?/deleteUser" use:enhance>
												<input type="hidden" name="userId" value={user.id} />
												<button
													type="submit"
													class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
													onclick={(e) => {
														if (!confirm(`Are you sure you want to delete ${user.username}?`)) {
															e.preventDefault();
														}
													}}
												>
													Delete User
												</button>
											</form>
										{/if}
									</div>
								</div>
							</div>
						</TableCell>
					</TableRow>
				{/snippet}
			</Table>
		</div>
	</div>

	<!-- API Keys Section -->
	<div class="rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-gray-900">
		<div
			class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
		>
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">API Keys</h2>
			<Button onclick={() => (showApiKeyModal = true)}>Create API Key</Button>
		</div>

		<!-- API Keys Table -->
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-900">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							Name
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							User
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							Last Used
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							Created
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
					{#each data.apiKeys as apiKey (apiKey.id)}
						<tr>
							<td
								class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100"
							>
								{apiKey.name}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
								{apiKey.username}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
								{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
								{new Date(apiKey.createdAt).toLocaleDateString()}
							</td>
							<td class="px-6 py-4 text-right text-sm whitespace-nowrap">
								<form method="post" action="?/deleteApiKey" use:enhance>
									<input type="hidden" name="apiKeyId" value={apiKey.id} />
									<Button
										variant="text"
										size="sm"
										type="submit"
										class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
	<div
		class="bg-opacity-75 dark:bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-gray-500 p-4 backdrop-blur-sm dark:bg-gray-900"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:shadow-gray-900"
		>
			<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Create New User</h3>
			<form method="post" action="?/createUser" use:enhance>
				<div class="space-y-4">
					<TextInput
						id="username"
						name="username"
						label="Username"
						required
						minlength={3}
						maxlength={31}
						pattern="[a-zA-Z0-9_]+"
					/>

					<PasswordInput
						id="password"
						name="password"
						label="Password"
						required
						minlength={6}
						maxlength={255}
						showToggle={false}
					/>

					<CheckboxInput id="isAdmin" name="isAdmin" label="Admin user" />
				</div>
				<div class="mt-6 flex gap-3">
					<Button type="submit" class="flex-1">Create User</Button>
					<Button
						variant="secondary"
						type="button"
						onclick={() => (showUserModal = false)}
						class="flex-1"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Create API Key Modal -->
{#if showApiKeyModal}
	<div
		class="bg-opacity-75 dark:bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-gray-500 p-4 backdrop-blur-sm dark:bg-gray-900"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:shadow-gray-900"
		>
			<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
				Create New API Key
			</h3>
			<form method="post" action="?/createApiKey" use:enhance>
				<div class="space-y-4">
					<TextInput
						id="name"
						name="name"
						label="Key Name"
						required
						placeholder="e.g., Mobile App Key"
					/>

					<SelectInput
						id="userId"
						name="userId"
						label="User"
						options={data.users.map((u) => ({ value: u.id, label: u.username }))}
						defaultOption="Select user (default: you)"
					/>
				</div>
				<div class="mt-6 flex gap-3">
					<Button type="submit" class="flex-1">Create API Key</Button>
					<Button
						variant="secondary"
						type="button"
						onclick={() => (showApiKeyModal = false)}
						class="flex-1"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Show API Key Value Modal -->
{#if showApiKeyValue}
	<div
		class="bg-opacity-75 dark:bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-gray-500 p-4 backdrop-blur-sm dark:bg-gray-900"
	>
		<div
			class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:shadow-gray-900"
		>
			<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">API Key Created</h3>
			<div
				class="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-yellow-950"
			>
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					⚠️ Make sure to copy your API key now. You won't be able to see it again!
				</p>
			</div>
			<div class="mb-4 rounded-md bg-gray-50 p-4 dark:bg-gray-900">
				<code class="font-mono text-sm break-all text-gray-900 dark:text-gray-100"
					>{showApiKeyValue}</code
				>
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
				<Button
					variant="secondary"
					type="button"
					onclick={() => (showApiKeyValue = null)}
					class="flex-1"
				>
					Close
				</Button>
			</div>
		</div>
	</div>
{/if}

<!-- Change Password Modal -->
<div popover id="password-modal" class="m-0 w-full max-w-md border-0 p-0">
	<div class="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:shadow-gray-900">
		<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
			Change Password for {selectedUsername}
		</h3>
		<form method="post" action="?/changePassword" use:enhance>
			<input type="hidden" name="userId" value={selectedUserId} />
			<div class="space-y-4">
				<PasswordInput
					id="newPassword"
					name="newPassword"
					label="New Password"
					required
					minlength={6}
					maxlength={255}
					showToggle={true}
				/>
			</div>
			<div class="mt-6 flex gap-3">
				<Button type="submit" class="flex-1">Change Password</Button>
				<Button variant="secondary" type="button" onclick={closePasswordModal} class="flex-1">
					Cancel
				</Button>
			</div>
		</form>
	</div>
</div>

<style>
	/* Password modal centering */
	#password-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}

	/* Menu popover positioning - will be overridden by inline styles */
	[id^='user-menu-'] {
		position: absolute;
		margin: 0;
	}
</style>
