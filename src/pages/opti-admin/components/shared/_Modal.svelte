<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		onClose?: () => void;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let { open = $bindable(false), title, size = 'md', onClose, children, header, footer }: Props = $props();

	let dialogElement: HTMLDialogElement | undefined = $state();

	// Watch for open changes and sync with dialog element
	$effect(() => {
		if (dialogElement) {
			if (open && !dialogElement.open) {
				dialogElement.showModal();
			} else if (!open && dialogElement.open) {
				dialogElement.close();
			}
		}
	});

	function handleClose() {
		open = false;
		onClose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialogElement) {
			handleClose();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-2xl',
		lg: 'max-w-4xl',
		xl: 'max-w-6xl',
		full: 'max-w-[95vw] min-h-[90vh]'
	};
</script>

<dialog
	bind:this={dialogElement}
	class="rounded-lg shadow-2xl p-0 backdrop:bg-black backdrop:bg-opacity-50 {sizeClasses[size]} w-full"
	onclick={handleBackdropClick}
	onkeydown={handleKeyDown}
>
	<div class="bg-white rounded-lg overflow-hidden">
		<!-- Header -->
		{#if title || header}
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex-1">
					{#if header}
						{@render header()}
					{:else}
						<h2 class="text-2xl font-semibold text-gray-900">{title}</h2>
					{/if}
				</div>
				<button
					type="button"
					onclick={handleClose}
					class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close modal"
				>
					<X size={24} />
				</button>
			</div>
		{/if}

		<!-- Body -->
		<div class="{size === 'full' ? 'p-0' : 'p-6'}">
			{#if children}
				{@render children()}
			{/if}
		</div>

		<!-- Footer -->
		{#if footer}
			<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		border: none;
		margin: auto;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
</style>
