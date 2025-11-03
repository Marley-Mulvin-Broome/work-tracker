<script lang="ts">
	interface Props {
		id: string;
		name: string;
		label: string;
		checked?: boolean;
		value?: string;
		class?: string;
	}

	let { id, name, label, checked = false, value, class: className = '' }: Props = $props();
</script>

<div class="flex items-center {className}">
	<input
		type="checkbox"
		{id}
		{name}
		{checked}
		{value}
		class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
	/>
	<label for={id} class="ml-2 block text-sm text-gray-700">
		{label}
	</label>
</div>
