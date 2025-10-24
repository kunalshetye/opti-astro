<script lang="ts">
  import StatusMessage from './shared/_StatusMessage.svelte';
  import NotesPanel from './shared/_NotesPanel.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';

  // Form state
  let synonymSlot = '1';
  let languageRouting = 'en';
  let synonyms = '';

  // UI state
  let isLoading = false;
  let message = '';
  let messageType: 'success' | 'error' = 'success';
  let showMessage = false;

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    isLoading = true;
    showMessage = false;

    try {
      const response = await fetch('/opti-admin/api/synonyms.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          synonyms,
          synonymSlot,
          languageRouting
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage('✅ ' + result.message, true);
      } else {
        const errorMsg = '❌ ' + result.error + (result.details ? ' - ' + result.details : '');
        displayMessage(errorMsg, false);
      }
    } catch (error) {
      const errorMsg = '❌ Network error: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-4xl">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Synonyms Manager</h1>
    <p class="text-gray-600">Manage synonym configurations for Optimizely Graph search functionality.</p>
  </div>

  <!-- Notes Section -->
  <div class="mb-6 space-y-3">
    <h2 class="text-xl font-semibold text-gray-900 mb-3">Notes</h2>

    <!-- Synonym Formats -->
    <NotesPanel title="Synonym Formats" color="blue">
      <p class="mb-2"><strong>Bi-directional (equivalent):</strong> Comma-separated values on each line</p>
      <code class="bg-blue-100 px-2 py-1 rounded">laptop, computer, pc</code><br/>
      <code class="bg-blue-100 px-2 py-1 rounded">episerver, optimizely</code>

      <p class="mb-2 mt-3"><strong>Uni-directional (replacement):</strong> Use arrow notation</p>
      <code class="bg-blue-100 px-2 py-1 rounded">H2O => water</code><br/>
      <code class="bg-blue-100 px-2 py-1 rounded">NYC => New York City, New York, Big Apple</code>

      <p class="mt-3 text-xs">Each line represents one synonym entry. Multi-word synonyms are supported.</p>
    </NotesPanel>

    <!-- Important Notes -->
    <NotesPanel title="Important Notes" color="yellow">
      <ul class="list-disc list-inside space-y-1">
        <li>Synonyms only work for string fields in GraphQL queries</li>
        <li>Changes are available in near real-time after uploading</li>
        <li>Results matching synonyms are ranked higher than non-matching results</li>
        <li>Exact matches are ranked higher than synonym matches</li>
        <li>Case-sensitive variants should be added as synonyms for eq/in operators</li>
      </ul>
    </NotesPanel>

    <!-- Example Usage in GraphQL -->
    <NotesPanel title="Example Usage in GraphQL" color="green">
      <p class="mb-2">To use synonyms in your GraphQL queries, add the synonyms parameter:</p>
      <pre class="bg-green-100 p-3 rounded text-xs overflow-x-auto"><code>{`  Content(
    where: {
      _fulltext: {
        match: "H2O",
        synonyms: ONE
      }
    }
  ) {
    items {
      _score
      Name
      MainBody
    }
  }`}</code></pre>
      <p class="mt-2 text-xs">This will match content containing "water" when you search for "H2O" (if you've set up that synonym).</p>
    </NotesPanel>
  </div>

  <!-- Status Message -->
  <StatusMessage {message} type={messageType} visible={showMessage} />

  <!-- Synonyms Form -->
  <form on:submit={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="synonymSlot" class="block text-sm font-medium text-gray-700 mb-2">
          Synonym Slot
        </label>
        <select
          id="synonymSlot"
          bind:value={synonymSlot}
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1">Slot 1 (Default)</option>
          <option value="2">Slot 2</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Choose which synonym slot to update. You can maintain two separate synonym files per language. NOTE: only slot one is currently supported by the site search.</p>
      </div>

      <div>
        <label for="languageRouting" class="block text-sm font-medium text-gray-700 mb-2">
          Language Routing
        </label>
        <input
          type="text"
          id="languageRouting"
          bind:value={languageRouting}
          placeholder="en"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p class="text-xs text-gray-500 mt-1">Language locale (default: en). Example: en, sv, etc.</p>
      </div>
    </div>

    <div>
      <label for="synonyms" class="block text-sm font-medium text-gray-700 mb-2">
        Synonyms
      </label>
      <textarea
        id="synonyms"
        bind:value={synonyms}
        rows="15"
        placeholder="Enter your synonyms here, one entry per line:

laptop, computer, pc
NYC, New York City, New York, Big Apple
H2O => water
Siteseeker, Welcome, Episerver => Optimizely"
        class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        Enter synonyms in CSV format. Leave empty to clear all synonyms for the selected slot.
      </p>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      class="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {#if isLoading}
        <LoadingSpinner size="md" color="text-white" />
        Uploading...
      {:else}
        Upload Synonyms to Optimizely Graph
      {/if}
    </button>
  </form>
</div>
