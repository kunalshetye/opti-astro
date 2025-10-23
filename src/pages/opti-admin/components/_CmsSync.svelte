<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	interface Props {
		cmsUrl?: string;
	}

	let { cmsUrl }: Props = $props();

	// Types
	interface ContentType {
		name: string;
		category: string;
	}

	interface ContentStyle {
		name: string;
		category: string;
	}

	interface LogEntry {
		message: string;
		level: 'info' | 'error' | 'success' | 'warning';
		timestamp: string;
	}

	// State
	let eventSource: EventSource | null = $state(null);
	let startTime: number | null = $state(null);
	let timerInterval: number | null = $state(null);
	let autoScroll = $state(true);

	// Dropdown data
	let types: ContentType[] = $state([]);
	let styles: ContentStyle[] = $state([]);
	let selectedType = $state('');
	let selectedStyle = $state('');

	// Button states
	let pushTypesDisabled = $state(false);
	let pushStylesDisabled = $state(false);
	let pushSingleTypeDisabled = $derived(!selectedType || pushTypesDisabled || pushStylesDisabled);
	let pushSingleStyleDisabled = $derived(!selectedStyle || pushTypesDisabled || pushStylesDisabled);

	// Loading states
	let pushTypesLoading = $state(false);
	let pushStylesLoading = $state(false);
	let pushSingleTypeLoading = $state(false);
	let pushSingleStyleLoading = $state(false);

	// Terminal
	let logs: LogEntry[] = $state([]);
	let terminalElement: HTMLDivElement | undefined = $state();
	let executionInfoVisible = $state(false);
	let elapsedSeconds = $state(0);

	// Status messages
	let typesStatus = $state('');
	let typesStatusClass = $state('');
	let stylesStatus = $state('');
	let stylesStatusClass = $state('');

	// Group types/styles by category
	function groupByCategory<T extends { category: string }>(items: T[]) {
		const grouped: Record<string, T[]> = {};
		items.forEach((item) => {
			if (!grouped[item.category]) {
				grouped[item.category] = [];
			}
			grouped[item.category].push(item);
		});
		return grouped;
	}

	let typesByCategory = $derived(groupByCategory(types));
	let stylesByCategory = $derived(groupByCategory(styles));

	// Load types from API
	async function loadTypes() {
		try {
			const response = await fetch('/opti-admin/api/list-types.json');
			const data = await response.json();

			if (data.types && data.types.length > 0) {
				types = data.types;
			}
		} catch (error) {
			console.error('Failed to load types:', error);
		}
	}

	// Load styles from API
	async function loadStyles() {
		try {
			const response = await fetch('/opti-admin/api/list-styles.json');
			const data = await response.json();

			if (data.styles && data.styles.length > 0) {
				styles = data.styles;
			}
		} catch (error) {
			console.error('Failed to load styles:', error);
		}
	}

	// Append log to terminal
	function appendLog(message: string, level: LogEntry['level'] = 'info') {
		const timestamp = new Date().toLocaleTimeString();
		logs = [...logs, { message, level, timestamp }];

		if (autoScroll && terminalElement) {
			setTimeout(() => {
				terminalElement!.scrollTop = terminalElement!.scrollHeight;
			}, 0);
		}
	}

	// Clear logs
	function clearLogs() {
		logs = [{ message: '$ Ready to execute commands...', level: 'info', timestamp: '' }];
	}

	// Copy logs to clipboard
	function copyLogs(event: MouseEvent) {
		const text = logs.map((log) => `[${log.timestamp}] ${log.message}`).join('\n');
		navigator.clipboard.writeText(text).then(() => {
			const btn = event.target as HTMLButtonElement;
			const originalText = btn.textContent;
			btn.textContent = 'Copied!';
			setTimeout(() => {
				btn.textContent = originalText;
			}, 2000);
		});
	}

	// Escape HTML
	function escapeHtml(text: string): string {
		return text;
		// const map: Record<string, string> = {
		// 	'&': '&amp;',
		// 	'<': '&lt;',
		// 	'>': '&gt;',
		// 	'"': '&quot;',
		// 	"'": '&#039;'
		// };
		// return text.replace(/[&<>"']/g, (m) => map[m]);
	}

	// Start timer
	function startTimer() {
		startTime = Date.now();
		executionInfoVisible = true;
		timerInterval = window.setInterval(() => {
			if (startTime) {
				elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
			}
		}, 1000);
	}

	// Stop timer
	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		executionInfoVisible = false;
	}

	// Get elapsed time
	function getElapsedTime(): number {
		if (startTime) {
			return Math.floor((Date.now() - startTime) / 1000);
		}
		return 0;
	}

	// Disable all buttons
	function disableAllButtons() {
		pushTypesDisabled = true;
		pushStylesDisabled = true;
	}

	// Enable all buttons
	function enableAllButtons() {
		pushTypesDisabled = false;
		pushStylesDisabled = false;
	}

	// Execute bulk command (push-types or push-styles)
	function executeCommand(command: 'push-types' | 'push-styles') {
		disableAllButtons();

		if (command === 'push-types') {
			pushTypesLoading = true;
		} else {
			pushStylesLoading = true;
		}

		// Clear terminal and show executing message
		logs = [
			{
				message: `$ yarn ${command.replace('-', ':')}`,
				level: 'info',
				timestamp: new Date().toLocaleTimeString()
			}
		];

		startTimer();

		// Close existing connection if any
		if (eventSource) {
			eventSource.close();
		}

		// Create new EventSource connection
		eventSource = new EventSource(`/opti-admin/api/stream/${command}`);

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'log') {
				appendLog(data.message, data.level);
			} else if (data.type === 'complete') {
				handleComplete(command, data.success, data.message);
			} else if (data.type === 'error') {
				appendLog(data.message, 'error');
			}
		};

		eventSource.onerror = (error) => {
			console.error('SSE Error:', error);
			handleComplete(command, false, 'Connection error occurred');
			eventSource?.close();
		};
	}

	// Handle bulk command completion
	function handleComplete(command: 'push-types' | 'push-styles', success: boolean, message: string) {
		stopTimer();
		const elapsed = getElapsedTime();

		// Update status
		if (command === 'push-types') {
			typesStatus = success ? `✅ Success (${elapsed}s)` : `❌ Failed (${elapsed}s)`;
			typesStatusClass = success ? 'text-success text-sm' : 'text-error text-sm';
			pushTypesLoading = false;
		} else {
			stylesStatus = success ? `✅ Success (${elapsed}s)` : `❌ Failed (${elapsed}s)`;
			stylesStatusClass = success ? 'text-success text-sm' : 'text-error text-sm';
			pushStylesLoading = false;
		}

		// Log completion
		appendLog(`Command completed in ${elapsed} seconds`, success ? 'success' : 'error');
		if (message) {
			appendLog(message, success ? 'success' : 'error');
		}

		enableAllButtons();

		// Close EventSource
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
	}

	// Push individual type or style
	function pushIndividual(type: 'type' | 'style') {
		const name = type === 'type' ? selectedType : selectedStyle;
		if (!name) return;

		executeIndividualCommand(type === 'type' ? 'push-type' : 'push-style', name, type);
	}

	// Execute individual command
	function executeIndividualCommand(
		command: 'push-type' | 'push-style',
		name: string,
		type: 'type' | 'style'
	) {
		disableAllButtons();

		if (type === 'type') {
			pushSingleTypeLoading = true;
		} else {
			pushSingleStyleLoading = true;
		}

		// Clear terminal and show executing message
		const commandText = type === 'type' ? `yarn type:push ${name}` : `yarn style:push ${name}`;
		logs = [
			{
				message: `$ ${commandText}`,
				level: 'info',
				timestamp: new Date().toLocaleTimeString()
			}
		];

		startTimer();

		// Close existing connection if any
		if (eventSource) {
			eventSource.close();
		}

		// Create new EventSource connection
		const param = type === 'type' ? `type=${encodeURIComponent(name)}` : `style=${encodeURIComponent(name)}`;
		eventSource = new EventSource(`/opti-admin/api/stream/${command}?${param}`);

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'log') {
				appendLog(data.message, data.level);
			} else if (data.type === 'complete') {
				handleIndividualComplete(type, data.success, data.message);
			} else if (data.type === 'error') {
				appendLog(data.message, 'error');
			}
		};

		eventSource.onerror = (error) => {
			console.error('SSE Error:', error);
			handleIndividualComplete(type, false, 'Connection error occurred');
			eventSource?.close();
		};
	}

	// Handle individual command completion
	function handleIndividualComplete(type: 'type' | 'style', success: boolean, message: string) {
		stopTimer();
		const elapsed = getElapsedTime();

		// Update status
		if (type === 'type') {
			typesStatus = success ? `✅ Success (${elapsed}s)` : `❌ Failed (${elapsed}s)`;
			typesStatusClass = success
				? 'text-success text-sm mt-2 block'
				: 'text-error text-sm mt-2 block';
			pushSingleTypeLoading = false;
		} else {
			stylesStatus = success ? `✅ Success (${elapsed}s)` : `❌ Failed (${elapsed}s)`;
			stylesStatusClass = success
				? 'text-success text-sm mt-2 block'
				: 'text-error text-sm mt-2 block';
			pushSingleStyleLoading = false;
		}

		// Log completion
		appendLog(`Command completed in ${elapsed} seconds`, success ? 'success' : 'error');
		if (message) {
			appendLog(message, success ? 'success' : 'error');
		}

		enableAllButtons();

		// Close EventSource
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
	}

	// Get log prefix
	function getLogPrefix(level: LogEntry['level']): string {
		switch (level) {
			case 'error':
				return '❌';
			case 'success':
				return '✅';
			case 'warning':
				return '⚠️';
			default:
				return '';
		}
	}

	// Get log color class
	function getLogColorClass(level: LogEntry['level']): string {
		switch (level) {
			case 'error':
				return 'text-error';
			case 'success':
				return 'text-success';
			case 'warning':
				return 'text-warning';
			default:
				return '';
		}
	}

	// Load data on mount
	onMount(() => {
		loadTypes();
		loadStyles();

		// Initialize logs
		logs = [{ message: '$ Ready to execute commands...', level: 'info', timestamp: '' }];

		// Cleanup on unmount
		return () => {
			if (eventSource) {
				eventSource.close();
			}
			if (timerInterval) {
				clearInterval(timerInterval);
			}
		};
	});
</script>

<div class="space-y-8">
	<!-- INFORMATION Section -->
	<section>
		<h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			Information
		</h2>
		<div class="bg-white rounded-lg shadow-md p-6">
			<p class="text-sm text-gray-600 mb-4">Quick access to CMS tools and resources</p>
			<div class="flex flex-wrap gap-3">
				<a
					href="https://github.com/kunalshetye/opti-astro/"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				>
					<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
						/>
					</svg>
					Opti-Astro Github
				</a>
				{#if cmsUrl}
					<a
						href="{cmsUrl}/ui/EPiServer.Cms.UI.Admin/default#/ScheduledJobs/detailScheduledJob/a0c70789-4e1f-476c-885b-41984db82c44"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
						Run Graph Full Sync
					</a>
					<a
						href="{cmsUrl}/ui/ContentGraph/GraphiQL"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
							></path>
						</svg>
						Open GraphiQL
					</a>
				{:else}
					<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-yellow-700">
									CMS URL not configured. Set OPTIMIZELY_CMS_URL environment variable to access
									external tools.
								</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- ACTIONS Section -->
	<section>
		<h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 10V3L4 14h7v7l9-11h-7z"
				></path>
			</svg>
			Actions
		</h2>
		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Push Types Card -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="p-6">
					<h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							></path>
						</svg>
						Push Content Types
					</h3>
					<p class="text-sm text-gray-600 mb-4">Sync content type definitions to Optimizely CMS</p>

					<!-- Bulk Push -->
					<div class="mb-4">
						<button
							class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
							onclick={() => executeCommand('push-types')}
							disabled={pushTypesDisabled}
						>
							{#if pushTypesLoading}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							<span>Push All Types</span>
						</button>
					</div>

					<!-- Individual Push -->
					<div class="border-t border-gray-200 pt-4">
						<p class="text-xs text-gray-500 text-center mb-3">OR</p>
						<div class="flex gap-2">
							<select
								bind:value={selectedType}
								class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">
									{types.length > 0 ? 'Select a type...' : 'Loading types...'}
								</option>
								{#each Object.keys(typesByCategory).sort() as category}
									<optgroup label={category.charAt(0).toUpperCase() + category.slice(1)}>
										{#each typesByCategory[category] as type}
											<option value={type.name}>{type.name}</option>
										{/each}
									</optgroup>
								{/each}
							</select>
							<button
								class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-1"
								onclick={() => pushIndividual('type')}
								disabled={pushSingleTypeDisabled}
							>
								{#if pushSingleTypeLoading}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								<span>Push</span>
							</button>
						</div>
					</div>

					<span class={typesStatusClass}>{typesStatus}</span>
				</div>
			</div>

			<!-- Push Styles Card -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="p-6">
					<h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							></path>
						</svg>
						Push Component Styles
					</h3>
					<p class="text-sm text-gray-600 mb-4">Sync component styles to Optimizely CMS</p>

					<!-- Bulk Push -->
					<div class="mb-4">
						<button
							class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
							onclick={() => executeCommand('push-styles')}
							disabled={pushStylesDisabled}
						>
							{#if pushStylesLoading}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							<span>Push All Styles</span>
						</button>
					</div>

					<!-- Individual Push -->
					<div class="border-t border-gray-200 pt-4">
						<p class="text-xs text-gray-500 text-center mb-3">OR</p>
						<div class="flex gap-2">
							<select
								bind:value={selectedStyle}
								class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">
									{styles.length > 0 ? 'Select a style...' : 'Loading styles...'}
								</option>
								{#each Object.keys(stylesByCategory).sort() as category}
									<optgroup label={category.charAt(0).toUpperCase() + category.slice(1)}>
										{#each stylesByCategory[category] as style}
											<option value={style.name}>{style.name}</option>
										{/each}
									</optgroup>
								{/each}
							</select>
							<button
								class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-1"
								onclick={() => pushIndividual('style')}
								disabled={pushSingleStyleDisabled}
							>
								{#if pushSingleStyleLoading}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								<span>Push</span>
							</button>
						</div>
					</div>

					<span class={stylesStatusClass}>{stylesStatus}</span>
				</div>
			</div>
		</div>
	</section>

	<!-- OUTPUT Section -->
	<section>
		<h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				></path>
			</svg>
			Output
		</h2>
		<div class="bg-white rounded-lg shadow-md">
			<div class="p-6">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold">Terminal Output</h3>
					<div class="flex gap-2">
						<label class="inline-flex items-center cursor-pointer">
							<input type="checkbox" bind:checked={autoScroll} class="sr-only peer" />
							<div
								class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
							></div>
							<span class="ml-3 text-sm font-medium text-gray-700">Auto-scroll</span>
						</label>
						<button
							class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
							onclick={clearLogs}
						>
							Clear
						</button>
						<button
							class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
							onclick={copyLogs}
						>
							Copy
						</button>
					</div>
				</div>

				<div
					bind:this={terminalElement}
					class="bg-gray-900 text-gray-100 rounded-md overflow-auto h-96 font-mono text-sm p-4"
				>
					{#each logs as log}
						<div>
							<code class={getLogColorClass(log.level)}>
								{#if log.timestamp}[{log.timestamp}]{/if}
								{getLogPrefix(log.level)}
								{escapeHtml(log.message)}
							</code>
						</div>
					{/each}
				</div>

				{#if executionInfoVisible}
					<div class="mt-2 text-sm text-gray-600">
						Executing... <span>{elapsedSeconds}</span>s
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>

<style>
	.text-error {
		color: #dc2626;
	}
	.text-success {
		color: #16a34a;
	}
	.text-warning {
		color: #ea580c;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.loading {
		display: inline-block;
		width: 1em;
		height: 1em;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: spin 0.75s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.loading-sm {
		width: 0.875em;
		height: 0.875em;
	}
	.loading-xs {
		width: 0.75em;
		height: 0.75em;
	}
</style>
