<script lang="ts" module>
	import { writable, type Writable } from 'svelte/store';

	export interface Toast {
		id: string;
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
		duration?: number;
	}

	export const toasts: Writable<Toast[]> = writable([]);

	export function toast(message: string, type: Toast['type'] = 'info', duration: number = 5000) {
		const id = Math.random().toString(36).substring(7);
		const newToast: Toast = { id, message, type, duration };

		toasts.update((all) => [...all, newToast]);

		if (duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, duration);
		}

		return id;
	}

	export function removeToast(id: string) {
		toasts.update((all) => all.filter((t) => t.id !== id));
	}
</script>

<script lang="ts">
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let allToasts = $state<Toast[]>([]);

	toasts.subscribe((value) => {
		allToasts = value;
	});


	function getColorClasses(type: Toast['type']) {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'info':
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	}

	function getIconColorClass(type: Toast['type']) {
		switch (type) {
			case 'success':
				return 'text-green-600';
			case 'error':
				return 'text-red-600';
			case 'warning':
				return 'text-yellow-600';
			case 'info':
				return 'text-blue-600';
		}
	}
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
	{#each allToasts as toast (toast.id)}
		<div
			transition:fly={{ y: -20, duration: 300 }}
			class="flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-md {getColorClasses(toast.type)}"
		>
			{#if toast.type === 'success'}
				<CheckCircle size={20} class={getIconColorClass(toast.type)} />
			{:else if toast.type === 'error'}
				<XCircle size={20} class={getIconColorClass(toast.type)} />
			{:else if toast.type === 'warning'}
				<AlertTriangle size={20} class={getIconColorClass(toast.type)} />
			{:else}
				<Info size={20} class={getIconColorClass(toast.type)} />
			{/if}
			<p class="flex-1 text-sm font-medium">{toast.message}</p>
			<button
				type="button"
				onclick={() => removeToast(toast.id)}
				class="text-gray-500 hover:text-gray-700 transition-colors"
				aria-label="Dismiss"
			>
				<X size={16} />
			</button>
		</div>
	{/each}
</div>
