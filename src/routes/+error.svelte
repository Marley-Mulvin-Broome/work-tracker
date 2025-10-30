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
  )
	const isDevelopment = import.meta.env.DEV;
</script>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
	<div class="max-w-2xl w-full">
		<!-- Error Card -->
		<div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
			<!-- Status Code -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
					<svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h1 class="text-6xl font-bold text-slate-800 mb-2">{status}</h1>
				<h2 class="text-2xl font-semibold text-slate-700 mb-3">{errorInfo.title}</h2>
				<p class="text-slate-600 text-lg">{errorInfo.description}</p>
			</div>

			<!-- Development Error Details -->
			{#if isDevelopment && page.error}
				<div class="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
					<h3 class="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
						<svg width={16} height={16} class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Error Details (Development Only)
					</h3>
					<pre class="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap wrap-break-word font-mono">{page.error?.message || String(page.error)}</pre>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<button
					onclick={() => window.history.back()}
					class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
				>
					<svg width={20} height={20} class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Go Back
				</button>
				<a
					href={resolve('/')}
					class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
				>
					<svg width={20} height={20} class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
					Go Home
				</a>
			</div>

			<!-- Help Text -->
			<div class="mt-8 pt-6 border-t border-slate-200 text-center">
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
