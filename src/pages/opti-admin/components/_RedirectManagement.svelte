<script lang="ts">
  import StatusMessage from './shared/_StatusMessage.svelte';
  import NotesPanel from './shared/_NotesPanel.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';
  import WipBadge from './shared/_WipBadge.svelte';

  interface Redirect {
    id: string;
    fromPath: string;
    toPath: string;
    type: '301' | '302' | '307' | '308';
    enabled: boolean;
    createdAt: string;
  }

  // Form state
  let fromPath = $state('');
  let toPath = $state('');
  let redirectType = $state<'301' | '302' | '307' | '308'>('301');
  let enabled = $state(true);

  // Redirects list state
  let redirects = $state<Redirect[]>([]);
  let isLoadingList = $state(false);
  let editingId = $state<string | null>(null);

  // UI state
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // CSV upload state
  let csvFile = $state<File | null>(null);
  let isUploadingCsv = $state(false);

  // Search/filter state
  let searchQuery = $state('');
  let filterType = $state<'all' | '301' | '302' | '307' | '308'>('all');
  let filterEnabled = $state<'all' | 'enabled' | 'disabled'>('all');

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  // Load redirects from localStorage on mount
  $effect(() => {
    loadRedirects();
  });

  function loadRedirects() {
    isLoadingList = true;
    try {
      const stored = localStorage.getItem('opti-redirects');
      if (stored) {
        redirects = JSON.parse(stored);
      } else {
        redirects = [];
      }
    } catch (error) {
      console.error('Error loading redirects from localStorage:', error);
      displayMessage('Failed to load redirects: ' + (error instanceof Error ? error.message : 'Unknown error'), false);
      redirects = [];
    } finally {
      isLoadingList = false;
    }
  }

  async function saveRedirects() {
    try {
      // Save to localStorage
      localStorage.setItem('opti-redirects', JSON.stringify(redirects));

      // Sync to server for middleware to use
      await fetch('/opti-admin/api/redirects.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirects })
      });
    } catch (error) {
      console.error('Error saving redirects:', error);
      displayMessage('Failed to save redirects: ' + (error instanceof Error ? error.message : 'Unknown error'), false);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!fromPath.trim() || !toPath.trim()) {
      displayMessage('❌ Both "From Path" and "To Path" are required', false);
      return;
    }

    // Validate paths start with /
    if (!fromPath.startsWith('/')) {
      displayMessage('❌ "From Path" must start with /', false);
      return;
    }

    isLoading = true;
    showMessage = false;

    try {
      if (editingId) {
        // Update existing redirect
        const index = redirects.findIndex(r => r.id === editingId);
        if (index === -1) {
          displayMessage('❌ Redirect not found', false);
          isLoading = false;
          return;
        }

        // Check if fromPath conflicts with another redirect
        const conflictingRedirect = redirects.find(
          r => r.fromPath === fromPath.trim() && r.id !== editingId
        );
        if (conflictingRedirect) {
          displayMessage(`❌ A redirect for "${fromPath}" already exists`, false);
          isLoading = false;
          return;
        }

        redirects[index] = {
          ...redirects[index],
          fromPath: fromPath.trim(),
          toPath: toPath.trim(),
          type: redirectType,
          enabled,
          updatedAt: new Date().toISOString()
        };

        displayMessage('✅ Redirect updated successfully', true);
      } else {
        // Check if fromPath already exists
        const existingRedirect = redirects.find(r => r.fromPath === fromPath.trim());
        if (existingRedirect) {
          displayMessage(`❌ A redirect for "${fromPath}" already exists`, false);
          isLoading = false;
          return;
        }

        // Create new redirect
        const newRedirect: Redirect = {
          id: `redirect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromPath: fromPath.trim(),
          toPath: toPath.trim(),
          type: redirectType,
          enabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        redirects = [...redirects, newRedirect];
        displayMessage('✅ Redirect created successfully', true);
      }

      await saveRedirects();
      resetForm();
    } catch (error) {
      const errorMsg = '❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
    } finally {
      isLoading = false;
    }
  }

  async function deleteRedirect(id: string) {
    if (!confirm('Are you sure you want to delete this redirect?')) {
      return;
    }

    try {
      const index = redirects.findIndex(r => r.id === id);
      if (index === -1) {
        displayMessage('❌ Redirect not found', false);
        return;
      }

      redirects = redirects.filter(r => r.id !== id);
      await saveRedirects();
      displayMessage('✅ Redirect deleted successfully', true);
    } catch (error) {
      displayMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'), false);
    }
  }

  function editRedirect(redirect: Redirect) {
    editingId = redirect.id;
    fromPath = redirect.fromPath;
    toPath = redirect.toPath;
    redirectType = redirect.type;
    enabled = redirect.enabled;

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleEnabled(id: string, currentEnabled: boolean) {
    try {
      const index = redirects.findIndex(r => r.id === id);
      if (index === -1) {
        displayMessage('❌ Redirect not found', false);
        return;
      }

      redirects[index] = {
        ...redirects[index],
        enabled: !currentEnabled,
        updatedAt: new Date().toISOString()
      };

      // Force reactivity by creating new array
      redirects = [...redirects];
      await saveRedirects();
    } catch (error) {
      displayMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'), false);
    }
  }

  function resetForm() {
    fromPath = '';
    toPath = '';
    redirectType = '301';
    enabled = true;
    editingId = null;
  }

  async function handleCsvUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      displayMessage('❌ Please upload a CSV file', false);
      return;
    }

    csvFile = file;
    isUploadingCsv = true;
    showMessage = false;

    try {
      const csvText = await file.text();
      const lines = csvText.trim().split('\n');

      if (lines.length < 2) {
        displayMessage('❌ CSV file must contain at least a header row and one data row', false);
        return;
      }

      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      const requiredColumns = ['frompath', 'topath', 'type', 'enabled'];

      // Validate header
      for (const col of requiredColumns) {
        if (!header.includes(col)) {
          displayMessage(`❌ Missing required column: ${col}`, false);
          return;
        }
      }

      const fromPathIndex = header.indexOf('frompath');
      const toPathIndex = header.indexOf('topath');
      const typeIndex = header.indexOf('type');
      const enabledIndex = header.indexOf('enabled');

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];
      const existingPaths = new Set(redirects.map(r => r.fromPath));

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = line.split(',').map(v => v.trim());

        if (values.length < requiredColumns.length) {
          errors.push(`Line ${i + 1}: not enough columns`);
          continue;
        }

        const fromPathValue = values[fromPathIndex];
        const toPathValue = values[toPathIndex];
        const typeValue = values[typeIndex];
        const enabledValue = values[enabledIndex];

        // Validate type
        if (!['301', '302', '307', '308'].includes(typeValue)) {
          errors.push(`Line ${i + 1}: Invalid type "${typeValue}"`);
          continue;
        }

        // Validate fromPath
        if (!fromPathValue.startsWith('/')) {
          errors.push(`Line ${i + 1}: fromPath must start with /`);
          continue;
        }

        // Skip if already exists
        if (existingPaths.has(fromPathValue)) {
          skipped++;
          continue;
        }

        // Parse enabled
        const enabled = enabledValue.toLowerCase() === 'true' || enabledValue === '1';

        // Create redirect
        const newRedirect: Redirect = {
          id: `redirect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromPath: fromPathValue,
          toPath: toPathValue,
          type: typeValue as '301' | '302' | '307' | '308',
          enabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        redirects = [...redirects, newRedirect];
        existingPaths.add(fromPathValue);
        imported++;
      }

      await saveRedirects();

      // Build response message
      let message = `✅ CSV uploaded successfully. ${imported} redirects imported.`;
      if (skipped > 0) {
        message += ` ${skipped} skipped (already exist).`;
      }
      if (errors.length > 0) {
        message += ` ${errors.length} errors.`;
        console.error('CSV import errors:', errors);
      }

      displayMessage(message, true);
    } catch (error) {
      const errorMsg = '❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
    } finally {
      isUploadingCsv = false;
      csvFile = null;
      input.value = '';
    }
  }

  function downloadTemplate() {
    const csvContent = 'fromPath,toPath,type,enabled\n/old-page,/new-page,301,true\n/another-old,https://example.com,302,true';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redirect-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Computed filtered redirects - use $derived for reactive computation
  let filteredRedirects = $derived(
    redirects.filter(redirect => {
      // Search filter
      const matchesSearch = !searchQuery ||
        redirect.fromPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        redirect.toPath.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = filterType === 'all' || redirect.type === filterType;

      // Enabled filter
      const matchesEnabled = filterEnabled === 'all' ||
        (filterEnabled === 'enabled' && redirect.enabled) ||
        (filterEnabled === 'disabled' && !redirect.enabled);

      return matchesSearch && matchesType && matchesEnabled;
    })
  );
</script>

<div class="max-w-7xl">
  <WipBadge size="large" message="This feature is actively being developed. Redirects are stored locally and synced to the server middleware for immediate use." />
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Redirect Management</h1>
    <p class="text-gray-600">Manage URL redirects for your site with support for multiple redirect types.</p>
  </div>

  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Notes Section -->
  <div class="mb-6 space-y-3">
    <h2 class="text-xl font-semibold text-gray-900 mb-3">Notes</h2>

    <!-- Redirect Types -->
    <NotesPanel title="Redirect Types" color="blue">
      <ul class="space-y-2">
        <li><strong>301 (Permanent):</strong> Tells browsers and search engines that the page has permanently moved. Best for SEO as it transfers page authority.</li>
        <li><strong>302 (Temporary):</strong> Indicates a temporary redirect. Search engines won't transfer page authority. Use for temporary maintenance or A/B testing.</li>
        <li><strong>307 (Temporary):</strong> Similar to 302 but guarantees the HTTP method won't change (POST remains POST).</li>
        <li><strong>308 (Permanent):</strong> Similar to 301 but guarantees the HTTP method won't change.</li>
      </ul>
    </NotesPanel>

    <!-- CSV Upload Instructions -->
    <NotesPanel title="CSV Upload Format" color="green">
      <p class="mb-2">Upload a CSV file with the following columns:</p>
      <code class="bg-green-100 px-2 py-1 rounded block mb-2">fromPath,toPath,type,enabled</code>
      <p class="text-sm mb-2">Example rows:</p>
      <code class="bg-green-100 px-2 py-1 rounded block text-xs">/old-page,/new-page,301,true</code>
      <code class="bg-green-100 px-2 py-1 rounded block text-xs">/blog/old-post,https://example.com/new-post,302,false</code>
      <button
        onclick={downloadTemplate}
        type="button"
        class="mt-3 text-sm text-green-700 hover:text-green-800 underline"
      >
        Download CSV Template
      </button>
    </NotesPanel>
  </div>

  <!-- CSV Upload Section -->
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Bulk Upload</h3>
    <div class="flex items-center gap-4">
      <label class="flex-1">
        <input
          type="file"
          accept=".csv"
          onchange={handleCsvUpload}
          disabled={isUploadingCsv}
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
        />
      </label>
      {#if isUploadingCsv}
        <LoadingSpinner size="sm" />
      {/if}
    </div>
    <p class="text-xs text-gray-500 mt-2">Upload a CSV file with columns: fromPath, toPath, type, enabled</p>
  </div>

  <!-- Add/Edit Form -->
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {editingId ? 'Edit Redirect' : 'Add New Redirect'}
    </h3>

    <form onsubmit={handleSubmit}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="fromPath" class="block text-sm font-medium text-gray-700 mb-1">
            From Path *
          </label>
          <input
            type="text"
            id="fromPath"
            bind:value={fromPath}
            placeholder="/old-path"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">The path to redirect from (must start with /)</p>
        </div>

        <div>
          <label for="toPath" class="block text-sm font-medium text-gray-700 mb-1">
            To Path/URL *
          </label>
          <input
            type="text"
            id="toPath"
            bind:value={toPath}
            placeholder="/new-path or https://example.com"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">Destination path or full URL</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="redirectType" class="block text-sm font-medium text-gray-700 mb-1">
            Redirect Type
          </label>
          <select
            id="redirectType"
            bind:value={redirectType}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="301">301 - Permanent</option>
            <option value="302">302 - Temporary</option>
            <option value="307">307 - Temporary (Method Preserved)</option>
            <option value="308">308 - Permanent (Method Preserved)</option>
          </select>
        </div>

        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              bind:checked={enabled}
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm font-medium text-gray-700">Enabled</span>
          </label>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if isLoading}
            <LoadingSpinner size="sm" />
          {/if}
          {editingId ? 'Update Redirect' : 'Add Redirect'}
        </button>

        {#if editingId}
          <button
            type="button"
            onclick={resetForm}
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        {/if}
      </div>
    </form>
  </div>

  <!-- Redirects List -->
  <div class="bg-white rounded-lg shadow-md border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          Existing Redirects ({filteredRedirects.length})
        </h3>

        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search redirects..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <select
            bind:value={filterType}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Types</option>
            <option value="301">301</option>
            <option value="302">302</option>
            <option value="307">307</option>
            <option value="308">308</option>
          </select>
          <select
            bind:value={filterEnabled}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
    </div>

    {#if isLoadingList}
      <div class="p-8 text-center">
        <LoadingSpinner />
        <p class="mt-2 text-gray-600">Loading redirects...</p>
      </div>
    {:else if filteredRedirects.length === 0}
      <div class="p-8 text-center text-gray-500">
        {#if searchQuery || filterType !== 'all' || filterEnabled !== 'all'}
          No redirects match your filters.
        {:else}
          No redirects configured yet. Add your first redirect above.
        {/if}
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredRedirects as redirect (redirect.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {redirect.fromPath}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  <div class="max-w-xs truncate" title={redirect.toPath}>
                    {redirect.toPath}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full {
                    redirect.type === '301' ? 'bg-blue-100 text-blue-800' :
                    redirect.type === '302' ? 'bg-yellow-100 text-yellow-800' :
                    redirect.type === '307' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }">
                    {redirect.type}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    onclick={() => toggleEnabled(redirect.id, redirect.enabled)}
                    type="button"
                    class="px-3 py-1 text-xs font-semibold rounded-full {redirect.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} hover:opacity-80"
                  >
                    {redirect.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onclick={() => editRedirect(redirect)}
                    type="button"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onclick={() => deleteRedirect(redirect.id)}
                    type="button"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
