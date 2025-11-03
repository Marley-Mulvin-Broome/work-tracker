<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const errorMessages = {
		404: {
			title: 'Page Not Found',
			description: "The page you're looking for doesn't exist or has been moved."
		},
		403: {
			title: 'Access Denied',
			description: "You don't have permission to access this resource."
		},
		500: {
			title: 'Internal Server Error',
			description: 'Something went wrong on our end. Please try again later.'
		},
		503: {
			title: 'Service Unavailable',
			description: 'The service is temporarily unavailable. Please try again in a few moments.'
		}
	} as const;

	const status = $derived(page.status);
	const errorInfo = $derived(
		errorMessages[status as keyof typeof errorMessages] || {
			title: 'Something Went Wrong',
			description: 'An unexpected error occurred.'
		}
	);
	const isDevelopment = import.meta.env.DEV;
</script>

<div
	class="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4"
>
	<div class="w-full max-w-2xl">
		<!-- Error Card -->
		<div class="rounded-2xl bg-white p-8 shadow-xl md:p-12">
			<!-- Status Code -->
			<div class="mb-8 text-center">
				<div class="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
					<svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h1 class="mb-2 text-6xl font-bold text-slate-800">{status}</h1>
				<h2 class="mb-3 text-2xl font-semibold text-slate-700">{errorInfo.title}</h2>
				<p class="text-lg text-slate-600">{errorInfo.description}</p>
			</div>

			<!-- Development Error Details -->
			{#if isDevelopment && page.error}
				<div class="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
					<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
						<svg
							width={16}
							height={16}
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Error Details (Development Only)
					</h3>
					<pre
						class="overflow-x-auto font-mono text-xs wrap-break-word whitespace-pre-wrap text-slate-600">{page
							.error?.message || String(page.error)}</pre>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
				<button
					onclick={() => window.history.back()}
					class="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
				>
					<svg
						width={20}
						height={20}
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Go Back
				</button>
				<a
					href={resolve('/')}
					class="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg
						width={20}
						height={20}
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					Go Home
				</a>
			</div>

			<!-- Help Text -->
			<div class="mt-8 border-t border-slate-200 pt-6 text-center">
				<p class="text-sm text-slate-500">
					If this problem persists, please contact your administrator or try refreshing the page.
				</p>
			</div>
		</div>

		<!-- Additional Info -->
		<div class="mt-6 text-center text-sm text-slate-600">
			<p>Error occurred at {new Date().toLocaleString()}</p>
		</div>
	</div>
</div>
