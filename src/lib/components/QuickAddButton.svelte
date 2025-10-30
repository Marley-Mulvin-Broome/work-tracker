<script lang="ts">
	import { enhance } from '$app/forms';

	let showModal = $state(false);
	let inputMethod = $state('date-duration');

	function closeModal() {
		showModal = false;
		inputMethod = 'date-duration';
	}
</script>

<!-- Floating Action Button -->
{#if !showModal}
	<button
		onclick={() => (showModal = true)}
		class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
		aria-label="Quick add activity"
	>
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 4v16m8-8H4"
			></path>
		</svg>
	</button>
{/if}

<!-- Quick Add Modal -->
{#if showModal}
	<div class="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
		<!-- Background overlay -->
		<button
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			onclick={closeModal}
			aria-label="Close modal"
		></button>

		<!-- Modal content wrapper -->
		<div class="flex items-center justify-center min-h-screen px-4">
			<div
				class="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-10"
			>
				<form
					method="post"
					action="/activities?/create"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								closeModal();
							}
							await update();
						};
					}}
					class="px-4 pt-5 pb-4 sm:p-6"
				>
					<div class="mb-6">
						<h3 class="text-lg leading-6 font-medium text-gray-900">Quick Add Activity</h3>
					</div>

					<input type="hidden" name="inputMethod" value={inputMethod} />

					<div class="space-y-4">
						<!-- Name -->
						<div>
							<label for="quick-name" class="block text-sm font-medium text-gray-700">
								Activity Name *
							</label>
							<input
								type="text"
								id="quick-name"
								name="name"
								required
								placeholder="What did you work on?"
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<!-- Description -->
						<div>
							<label for="quick-description" class="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								id="quick-description"
								name="description"
								rows="2"
								placeholder="Optional details..."
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							></textarea>
						</div>

						<!-- Date -->
						<div>
							<label for="quick-date" class="block text-sm font-medium text-gray-700"
								>Date *</label
							>
							<input
								type="date"
								id="quick-date"
								name="date"
								required
								value={new Date().toISOString().split('T')[0]}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<!-- Input Method Selection -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								How would you like to log time?
							</label>
							<div class="space-y-2">
								<label class="flex items-center cursor-pointer">
									<input
										type="radio"
										bind:group={inputMethod}
										value="date-duration"
										class="mr-2"
									/>
									<span class="text-sm">Just duration (quick!)</span>
								</label>
								<label class="flex items-center cursor-pointer">
									<input
										type="radio"
										bind:group={inputMethod}
										value="start-duration"
										class="mr-2"
									/>
									<span class="text-sm">Start time & duration</span>
								</label>
								<label class="flex items-center cursor-pointer">
									<input
										type="radio"
										bind:group={inputMethod}
										value="start-end"
										class="mr-2"
									/>
									<span class="text-sm">Start & end time</span>
								</label>
							</div>
						</div>

						<!-- Conditional Fields -->
						{#if inputMethod === 'start-end'}
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="quick-startTime" class="block text-sm font-medium text-gray-700">
										Start Time *
									</label>
									<input
										type="time"
										id="quick-startTime"
										name="startTime"
										required
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label for="quick-endTime" class="block text-sm font-medium text-gray-700">
										End Time *
									</label>
									<input
										type="time"
										id="quick-endTime"
										name="endTime"
										required
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						{:else if inputMethod === 'start-duration'}
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="quick-startTime" class="block text-sm font-medium text-gray-700">
										Start Time *
									</label>
									<input
										type="time"
										id="quick-startTime"
										name="startTime"
										required
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label for="quick-duration" class="block text-sm font-medium text-gray-700">
										Duration (hours) *
									</label>
									<input
										type="number"
										id="quick-duration"
										name="duration"
										step="0.25"
										min="0.25"
										required
										placeholder="1.5"
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						{:else if inputMethod === 'date-duration'}
							<div>
								<label for="quick-duration" class="block text-sm font-medium text-gray-700">
									Duration (hours) *
								</label>
								<input
									type="number"
									id="quick-duration"
									name="duration"
									step="0.25"
									min="0.25"
									required
									placeholder="e.g., 2 for 2 hours, 1.5 for 1.5 hours"
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						{/if}
					</div>

					<div class="mt-5 grid grid-cols-2 gap-3">
						<button
							type="button"
							onclick={closeModal}
							class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
						>
							Add Activity
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
