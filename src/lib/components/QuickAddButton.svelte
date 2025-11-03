<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus } from '$lib/components/icons';
	import {
		FAB,
		Button,
		TextInput,
		TextareaInput,
		DateInput,
		RadioGroup,
		TimeInput,
		NumberInput
	} from '$lib/components';
	import { getTodayJST } from '$lib/utils/timezone';

	let showModal = $state(false);
	let inputMethod = $state('date-duration');

	function closeModal() {
		showModal = false;
		inputMethod = 'date-duration';
	}
</script>

<!-- Floating Action Button -->
{#if !showModal}
	<FAB onclick={() => (showModal = true)} aria-label="Quick add activity">
		<Plus class="h-6 w-6" />
	</FAB>
{/if}

<!-- Quick Add Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
		<!-- Background overlay -->
		<button
			class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
			onclick={closeModal}
			aria-label="Close modal"
		></button>

		<!-- Modal content wrapper -->
		<div class="flex min-h-screen items-center justify-center px-4">
			<div class="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl">
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
						<TextInput
							id="quick-name"
							name="name"
							label="Activity Name"
							required
							placeholder="What did you work on?"
						/>

						<TextareaInput
							id="quick-description"
							name="description"
							label="Description"
							placeholder="Optional details..."
						/>

						<DateInput id="quick-date" name="date" label="Date" required value={getTodayJST()} />

						<RadioGroup
							label="How would you like to log time?"
							name="inputMethod"
							bind:value={inputMethod}
							options={[
								{ value: 'date-duration', label: 'Just duration (quick!)' },
								{ value: 'start-duration', label: 'Start time & duration' },
								{ value: 'start-end', label: 'Start & end time' }
							]}
						/>

						<!-- Conditional Fields -->
						{#if inputMethod === 'start-end'}
							<div class="grid grid-cols-2 gap-4">
								<TimeInput id="quick-startTime" name="startTime" label="Start Time" required />
								<TimeInput id="quick-endTime" name="endTime" label="End Time" required />
							</div>
						{:else if inputMethod === 'start-duration'}
							<div class="grid grid-cols-2 gap-4">
								<TimeInput id="quick-startTime" name="startTime" label="Start Time" required />
								<NumberInput
									id="quick-duration"
									name="duration"
									label="Duration (hours)"
									step={0.25}
									min={0.25}
									required
									placeholder="1.5"
								/>
							</div>
						{:else if inputMethod === 'date-duration'}
							<NumberInput
								id="quick-duration"
								name="duration"
								label="Duration (hours)"
								step={0.25}
								min={0.25}
								required
								placeholder="e.g., 2 for 2 hours, 1.5 for 1.5 hours"
							/>
						{/if}
					</div>

					<div class="mt-5 grid grid-cols-2 gap-3">
						<Button
							variant="secondary"
							type="button"
							onclick={closeModal}
							class="inline-flex justify-center"
						>
							Cancel
						</Button>
						<Button type="submit" class="inline-flex justify-center">Add Activity</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
