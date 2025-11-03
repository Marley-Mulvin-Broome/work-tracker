<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { NavLink, Link, Button, IconButton } from '$lib/components';
	import { Menu } from '$lib/components/icons';

	interface Props {
		username: string;
		isAdmin: boolean;
	}

	let { username, isAdmin }: Props = $props();

	let mobileMenuOpen = $state(false);
	let isDarkMode = $state(false);

	// Initialize dark mode from localStorage or system preference
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('theme');
			if (stored === 'dark') {
				isDarkMode = true;
				document.documentElement.classList.add('dark');
			} else if (stored === 'light') {
				isDarkMode = false;
				document.documentElement.classList.remove('dark');
			} else {
				// Use system preference if no stored preference
				isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				if (isDarkMode) {
					document.documentElement.classList.add('dark');
				}
			}
		}
	});

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<nav class="bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<!-- Logo -->
				<div class="flex shrink-0 items-center">
					<Link href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400"
						>Work Tracker</Link
					>
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
				<span class="text-sm text-gray-700 dark:text-gray-300">Welcome, {username}</span>
				<!-- Dark Mode Toggle -->
				<button
					onclick={toggleDarkMode}
					class="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
					aria-label="Toggle dark mode"
				>
					{#if isDarkMode}
						<!-- Sun icon for light mode -->
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					{:else}
						<!-- Moon icon for dark mode -->
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					{/if}
				</button>
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
		<div class="border-t border-gray-200 sm:hidden dark:border-gray-700">
			<div class="space-y-1 pt-2 pb-3">
				<NavLink href="/" mobile>Dashboard</NavLink>
				<NavLink href="/activities" mobile>Activities</NavLink>
				<NavLink href="/leaderboard" mobile>Leaderboard</NavLink>
				{#if isAdmin}
					<NavLink href="/admin" mobile>Admin</NavLink>
				{/if}
			</div>
			<div class="border-t border-gray-200 pt-4 pb-3 dark:border-gray-700">
				<div class="flex items-center px-4">
					<div class="text-base font-medium text-gray-800 dark:text-gray-200">{username}</div>
				</div>
				<div class="mt-3 space-y-1">
					<!-- Dark Mode Toggle for Mobile -->
					<button
						onclick={toggleDarkMode}
						class="flex w-full items-center justify-between px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
					>
						<span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
						{#if isDarkMode}
							<!-- Sun icon -->
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						{:else}
							<!-- Moon icon -->
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
								/>
							</svg>
						{/if}
					</button>
					<form method="post" action="/logout" use:enhance>
						<Button
							variant="text"
							type="submit"
							class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
						>
							Sign out
						</Button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</nav>
