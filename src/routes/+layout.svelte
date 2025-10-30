<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { enhance } from '$app/forms';
	import QuickAddButton from '$lib/components/QuickAddButton.svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	let mobileMenuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.user}
	<!-- Authenticated Layout -->
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation -->
		<nav class="bg-white shadow-sm">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex">
						<!-- Logo -->
						<div class="flex-shrink-0 flex items-center">
							<a href="/" class="text-xl font-bold text-blue-600">Work Tracker</a>
						</div>
						<!-- Desktop Navigation -->
						<div class="hidden sm:ml-8 sm:flex sm:space-x-8">
							<a
								href="/"
								class="border-transparent hover:border-gray-300 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition"
								class:!border-blue-500={page.url.pathname === '/'}
								class:!text-blue-600={page.url.pathname === '/'}
							>
								Dashboard
							</a>
							<a
								href="/activities"
								class="border-transparent hover:border-gray-300 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition"
								class:!border-blue-500={page.url.pathname === '/activities'}
								class:!text-blue-600={page.url.pathname === '/activities'}
							>
								Activities
							</a>
							<a
								href="/leaderboard"
								class="border-transparent hover:border-gray-300 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition"
								class:!border-blue-500={page.url.pathname === '/leaderboard'}
								class:!text-blue-600={page.url.pathname === '/leaderboard'}
							>
								Leaderboard
							</a>
						</div>
					</div>
					<!-- User Menu -->
					<div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
						<span class="text-sm text-gray-700">Welcome, {data.user.username}</span>
						<form method="post" action="/logout" use:enhance>
							<button
								type="submit"
								class="text-sm text-gray-700 hover:text-gray-900 font-medium transition"
							>
								Sign out
							</button>
						</form>
					</div>
					<!-- Mobile menu button -->
					<div class="flex items-center sm:hidden">
						<button
							type="button"
							class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
							onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						>
							<span class="sr-only">Open main menu</span>
							<svg
								class="block h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile menu -->
			{#if mobileMenuOpen}
				<div class="sm:hidden border-t border-gray-200">
					<div class="pt-2 pb-3 space-y-1">
						<a
							href="/"
							class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							class:!border-blue-500={page.url.pathname === '/'}
							class:!bg-blue-50={page.url.pathname === '/'}
							class:!text-blue-700={page.url.pathname === '/'}
						>
							Dashboard
						</a>
						<a
							href="/activities"
							class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							class:!border-blue-500={page.url.pathname === '/activities'}
							class:!bg-blue-50={page.url.pathname === '/activities'}
							class:!text-blue-700={page.url.pathname === '/activities'}
						>
							Activities
						</a>
						<a
							href="/leaderboard"
							class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							class:!border-blue-500={page.url.pathname === '/leaderboard'}
							class:!bg-blue-50={page.url.pathname === '/leaderboard'}
							class:!text-blue-700={page.url.pathname === '/leaderboard'}
						>
							Leaderboard
						</a>
					</div>
					<div class="pt-4 pb-3 border-t border-gray-200">
						<div class="flex items-center px-4">
							<div class="text-base font-medium text-gray-800">{data.user.username}</div>
						</div>
						<div class="mt-3 space-y-1">
							<form method="post" action="/logout" use:enhance>
								<button
									type="submit"
									class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
								>
									Sign out
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}
		</nav>

		<!-- Main Content -->
		{@render children?.()}

		<!-- Quick Add FAB -->
		<QuickAddButton />
	</div>
{:else}
	<!-- Unauthenticated Layout (Login page) -->
	{@render children?.()}
{/if}
