<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { formatHours, formatDate, formatTime } from '$lib/utils/formatters';
	import type { Activity } from '$lib/server/db/schema';
	import { Plus, Clipboard } from '$lib/components/icons';
	import {
		Button,
		TextInput,
		TextareaInput,
		DateInput,
		RadioGroup,
		TimeInput,
		NumberInput,
		Table,
		TableRow,
		TableHeader,
		TableCell
	} from '$lib/components';
	import { getTodayJST, isTodayJST } from '$lib/utils/timezone';

	let { data, form }: PageProps = $props();

	let showModal = $state(false);
	let editingActivity = $state<Activity | null>(null);
	let inputMethod = $state('start-end');

	function openCreateModal() {
		editingActivity = null;
		inputMethod = 'start-end';
		showModal = true;
	}

	function openEditModal(activity: Activity) {
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

	function canEdit(date: Date): boolean {
		return isTodayJST(date);
	}

	// Close modal on successful submission
	$effect(() => {
		if (form?.success) {
			closeModal();
		}
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Activities</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-400">Manage your work activities</p>
		</div>
		<Button onclick={openCreateModal} class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			Add Activity
		</Button>
	</div>

	<!-- Activities List -->
	<Table data={data.activities} emptyMessage="">
		{#snippet emptyIcon()}
			<div class="flex flex-col items-center">
				<Clipboard class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
				<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No activities</h3>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					Get started by creating a new activity.
				</p>
				<div class="mt-6">
					<Button onclick={openCreateModal} class="inline-flex items-center">
						<Plus class="mr-2 h-5 w-5" />
						New Activity
					</Button>
				</div>
			</div>
		{/snippet}

		{#snippet headerSnippet()}
			<tr>
				<TableHeader>Date</TableHeader>
				<TableHeader>Activity</TableHeader>
				<TableHeader>Time</TableHeader>
				<TableHeader>Duration</TableHeader>
				<TableHeader>Actions</TableHeader>
			</tr>
		{/snippet}

		{#snippet rowSnippet(activity)}
			<TableRow>
				<TableCell class="whitespace-nowrap text-gray-900 dark:text-gray-100">
					{formatDate(activity.date)}
				</TableCell>
				<TableCell class="text-gray-900 dark:text-gray-100">
					<div class="font-medium">{activity.name}</div>
					{#if activity.description}
						<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{activity.description}</div>
					{/if}
				</TableCell>
				<TableCell class="whitespace-nowrap text-gray-500 dark:text-gray-400">
					{#if activity.startTime || activity.endTime}
						<div>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</div>
					{:else}
						<div class="text-gray-400 dark:text-gray-500">No specific time</div>
					{/if}
				</TableCell>
				<TableCell class="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
					{formatHours(activity.duration)}
				</TableCell>
				<TableCell class="space-x-2 font-medium whitespace-nowrap">
					{#if canEdit(activity.date)}
						<Button variant="text" size="sm" onclick={() => openEditModal(activity)}>Edit</Button>
						<form method="post" action="?/delete" use:enhance class="inline">
							<input type="hidden" name="id" value={activity.id} />
							<Button
								variant="text"
								size="sm"
								type="submit"
								class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
								onclick={(e) => {
									if (!confirm('Are you sure you want to delete this activity?')) {
										e.preventDefault();
									}
								}}
							>
								Delete
							</Button>
						</form>
					{:else}
						<span class="text-gray-400 dark:text-gray-500">-</span>
					{/if}
				</TableCell>
			</TableRow>
		{/snippet}
	</Table>
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog">
		<div
			class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Background overlay -->
			<button
				class="bg-opacity-75 dark:bg-opacity-80 fixed inset-0 bg-gray-500 transition-opacity dark:bg-gray-900"
				onclick={closeModal}
				aria-label="Close modal"
			></button>

			<span class="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

			<div
				class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle dark:bg-gray-800 dark:shadow-gray-900"
			>
				<form
					method="post"
					action={editingActivity ? '?/update' : '?/create'}
					use:enhance
					class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800"
				>
					<div class="mb-6">
						<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
							{editingActivity ? 'Edit Activity' : 'Create Activity'}
						</h3>
					</div>

					{#if editingActivity}
						<input type="hidden" name="id" value={editingActivity.id} />
					{/if}

					<input type="hidden" name="inputMethod" value={inputMethod} />

					{#if form?.message}
						<div class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
							{form.message}
						</div>
					{/if}

					<div class="space-y-4">
						<TextInput
							id="name"
							name="name"
							label="Activity Name"
							required
							value={editingActivity?.name ?? ''}
						/>

						<TextareaInput
							id="description"
							name="description"
							label="Description"
							value={editingActivity?.description ?? ''}
						/>

						<DateInput
							id="date"
							name="date"
							label="Date"
							required
							value={editingActivity?.date
								? editingActivity.date instanceof Date
									? editingActivity.date.toISOString().split('T')[0]
									: editingActivity.date
								: getTodayJST()}
						/>

						<RadioGroup
							label="Input Method"
							name="inputMethod"
							bind:value={inputMethod}
							options={[
								{ value: 'start-end', label: 'Start & End Time' },
								{ value: 'start-duration', label: 'Start Time & Duration' },
								{ value: 'date-duration', label: 'Duration Only' }
							]}
						/>

						<!-- Conditional Fields -->
						{#if inputMethod === 'start-end'}
							<div class="grid grid-cols-2 gap-4">
								<TimeInput
									id="startTime"
									name="startTime"
									label="Start Time"
									required
									value={editingActivity?.startTime ?? ''}
								/>

								<TimeInput
									id="endTime"
									name="endTime"
									label="End Time"
									required
									value={editingActivity?.endTime ?? ''}
								/>
							</div>
						{:else if inputMethod === 'start-duration'}
							<div class="grid grid-cols-2 gap-4">
								<TimeInput
									id="startTime"
									name="startTime"
									label="Start Time"
									required
									value={editingActivity?.startTime ?? ''}
								/>

								<NumberInput
									id="duration"
									name="duration"
									label="Duration (hours)"
									required
									step={0.25}
									min={0.25}
									value={editingActivity?.duration ?? ''}
								/>
							</div>
						{:else if inputMethod === 'date-duration'}
							<NumberInput
								id="duration"
								name="duration"
								label="Duration (hours)"
								required
								step={0.25}
								min={0.25}
								value={editingActivity?.duration ?? ''}
							/>
						{/if}
					</div>

					<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
						<Button type="submit" class="inline-flex w-full justify-center sm:col-start-2">
							{editingActivity ? 'Update' : 'Create'}
						</Button>
						<Button
							variant="secondary"
							type="button"
							onclick={closeModal}
							class="mt-3 inline-flex w-full justify-center sm:col-start-1 sm:mt-0"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
