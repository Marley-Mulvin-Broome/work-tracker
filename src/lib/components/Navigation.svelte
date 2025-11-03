<script lang="ts">
	import { enhance } from '$app/forms';
	import { NavLink, Link, Button, IconButton } from '$lib/components';
	import { Menu } from '$lib/components/icons';

	interface Props {
		username: string;
		isAdmin: boolean;
	}

	let { username, isAdmin }: Props = $props();

	let mobileMenuOpen = $state(false);
</script>

<nav class="bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<!-- Logo -->
				<div class="flex shrink-0 items-center">
					<Link href="/" class="text-xl font-bold text-blue-600">Work Tracker</Link>
				</div>
				<!-- Desktop Navigation -->
				<div class="hidden sm:ml-8 sm:flex sm:space-x-8">
					<NavLink href="/">Dashboard</NavLink>
					<NavLink href="/activities">Activities</NavLink>
					<NavLink href="/leaderboard">Leaderboard</NavLink>
					{#if isAdmin}
						<NavLink href="/admin">Admin</NavLink>
					{/if}
				</div>
			</div>
			<!-- User Menu -->
			<div class="hidden space-x-4 sm:ml-6 sm:flex sm:items-center">
				<span class="text-sm text-gray-700">Welcome, {username}</span>
				<form method="post" action="/logout" use:enhance>
					<Button variant="text" type="submit" class="text-sm">Sign out</Button>
				</form>
			</div>
			<!-- Mobile menu button -->
			<div class="flex items-center sm:hidden">
				<IconButton
					variant="ghost"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Open main menu"
				>
					<Menu class="block h-6 w-6" />
				</IconButton>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-gray-200 sm:hidden">
			<div class="space-y-1 pt-2 pb-3">
				<NavLink href="/" mobile>Dashboard</NavLink>
				<NavLink href="/activities" mobile>Activities</NavLink>
				<NavLink href="/leaderboard" mobile>Leaderboard</NavLink>
				{#if isAdmin}
					<NavLink href="/admin" mobile>Admin</NavLink>
				{/if}
			</div>
			<div class="border-t border-gray-200 pt-4 pb-3">
				<div class="flex items-center px-4">
					<div class="text-base font-medium text-gray-800">{username}</div>
				</div>
				<div class="mt-3 space-y-1">
					<form method="post" action="/logout" use:enhance>
						<Button
							variant="text"
							type="submit"
							class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Sign out
						</Button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</nav>
