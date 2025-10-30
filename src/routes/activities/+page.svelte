<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let showModal = $state(false);
	let editingActivity = $state<any>(null);
	let inputMethod = $state('start-end');

	function formatHours(hours: number): string {
		if (hours === 0) return '0h';
		const h = Math.floor(hours);
		const m = Math.round((hours - h) * 60);
		if (m === 0) return `${h}h`;
		return `${h}h ${m}m`;
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return '-';
		const [hours, minutes] = timeStr.split(':');
		const h = parseInt(hours);
		const ampm = h >= 12 ? 'PM' : 'AM';
		const displayHour = h % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	}

	function openCreateModal() {
		editingActivity = null;
		inputMethod = 'start-end';
		showModal = true;
	}

	function openEditModal(activity: any) {
		editingActivity = activity;
		// Determine input method based on existing data
		if (activity.startTime && activity.endTime) {
			inputMethod = 'start-end';
		} else if (activity.startTime && !activity.endTime) {
			inputMethod = 'start-duration';
		} else {
			inputMethod = 'date-duration';
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingActivity = null;
	}

	function canEdit(dateStr: string): boolean {
		const today = new Date().toISOString().split('T')[0];
		return dateStr === today;
	}

	// Close modal on successful submission
	$effect(() => {
		if (form?.success) {
			closeModal();
		}
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8 flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Activities</h1>
			<p class="text-gray-600 mt-1">Manage your work activities</p>
		</div>
		<button
			onclick={openCreateModal}
			class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				></path>
			</svg>
			Add Activity
		</button>
	</div>

	<!-- Activities List -->
	<div class="bg-white rounded-lg shadow overflow-hidden">
		{#if data.activities.length === 0}
			<div class="px-6 py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					></path>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No activities</h3>
				<p class="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
				<div class="mt-6">
					<button
						onclick={openCreateModal}
						class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
					>
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							></path>
						</svg>
						New Activity
					</button>
				</div>
			</div>
		{:else}
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Activity
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Time
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Duration
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.activities as activity (activity.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{formatDate(activity.date)}
							</td>
							<td class="px-6 py-4 text-sm text-gray-900">
								<div class="font-medium">{activity.name}</div>
								{#if activity.description}
									<div class="text-gray-500 text-xs mt-1">{activity.description}</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{#if activity.startTime || activity.endTime}
									<div>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</div>
								{:else}
									<div class="text-gray-400">No specific time</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{formatHours(activity.duration)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								{#if canEdit(activity.date)}
									<button
										onclick={() => openEditModal(activity)}
										class="text-blue-600 hover:text-blue-900"
									>
										Edit
									</button>
									<form method="post" action="?/delete" use:enhance class="inline">
										<input type="hidden" name="id" value={activity.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											onclick={(e) => {
												if (!confirm('Are you sure you want to delete this activity?')) {
													e.preventDefault();
												}
											}}
										>
											Delete
										</button>
									</form>
								{:else}
									<span class="text-gray-400">-</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog">
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<!-- Background overlay -->
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={closeModal}
			></div>

			<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
			>
				<form
					method="post"
					action={editingActivity ? '?/update' : '?/create'}
					use:enhance
					class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
				>
					<div class="mb-6">
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							{editingActivity ? 'Edit Activity' : 'Create Activity'}
						</h3>
					</div>

					{#if editingActivity}
						<input type="hidden" name="id" value={editingActivity.id} />
					{/if}

					<input type="hidden" name="inputMethod" value={inputMethod} />

					{#if form?.message}
						<div class="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
							{form.message}
						</div>
					{/if}

					<div class="space-y-4">
						<!-- Name -->
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700">
								Activity Name *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								value={editingActivity?.name ?? ''}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<!-- Description -->
						<div>
							<label for="description" class="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								id="description"
								name="description"
								rows="2"
								value={editingActivity?.description ?? ''}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							></textarea>
						</div>

						<!-- Date -->
						<div>
							<label for="date" class="block text-sm font-medium text-gray-700">Date *</label>
							<input
								type="date"
								id="date"
								name="date"
								required
								value={editingActivity?.date ?? new Date().toISOString().split('T')[0]}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<!-- Input Method Selection -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Input Method</label>
							<div class="space-y-2">
								<label class="flex items-center">
									<input
										type="radio"
										bind:group={inputMethod}
										value="start-end"
										class="mr-2"
									/>
									Start & End Time
								</label>
								<label class="flex items-center">
									<input
										type="radio"
										bind:group={inputMethod}
										value="start-duration"
										class="mr-2"
									/>
									Start Time & Duration
								</label>
								<label class="flex items-center">
									<input
										type="radio"
										bind:group={inputMethod}
										value="date-duration"
										class="mr-2"
									/>
									Duration Only
								</label>
							</div>
						</div>

						<!-- Conditional Fields -->
						{#if inputMethod === 'start-end'}
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="startTime" class="block text-sm font-medium text-gray-700">
										Start Time *
									</label>
									<input
										type="time"
										id="startTime"
										name="startTime"
										required
										value={editingActivity?.startTime ?? ''}
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label for="endTime" class="block text-sm font-medium text-gray-700">
										End Time *
									</label>
									<input
										type="time"
										id="endTime"
										name="endTime"
										required
										value={editingActivity?.endTime ?? ''}
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						{:else if inputMethod === 'start-duration'}
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="startTime" class="block text-sm font-medium text-gray-700">
										Start Time *
									</label>
									<input
										type="time"
										id="startTime"
										name="startTime"
										required
										value={editingActivity?.startTime ?? ''}
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label for="duration" class="block text-sm font-medium text-gray-700">
										Duration (hours) *
									</label>
									<input
										type="number"
										id="duration"
										name="duration"
										step="0.25"
										min="0.25"
										required
										value={editingActivity?.duration ?? ''}
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						{:else if inputMethod === 'date-duration'}
							<div>
								<label for="duration" class="block text-sm font-medium text-gray-700">
									Duration (hours) *
								</label>
								<input
									type="number"
									id="duration"
									name="duration"
									step="0.25"
									min="0.25"
									required
									value={editingActivity?.duration ?? ''}
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						{/if}
					</div>

					<div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
						<button
							type="submit"
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
						>
							{editingActivity ? 'Update' : 'Create'}
						</button>
						<button
							type="button"
							onclick={closeModal}
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
