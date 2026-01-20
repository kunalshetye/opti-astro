<script lang="ts">
  import StatusMessage from './shared/_StatusMessage.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';

  // State
  let searchParams = $state({
    voltage: '',
    current: '',
    numberOfOutputs: '1',
    InputPhases: '0' // 0=all, 1=single, 3=three
  });

  let searchResults = $state<any[]>([]);
  let selectedProducts = $state<Set<string>>(new Set());
  let isSearching = $state(false);
  let isImporting = $state(false);
  let statusMessage = $state<{ type: 'success' | 'error', text: string } | null>(null);
  let importStatus = $state<Record<string, boolean>>({});

  // Search TDK-Lambda API
  async function searchProducts() {
    isSearching = true;
    statusMessage = null;

    try {
      const response = await fetch('/opti-admin/api/tdklambda-search.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });

      const data = await response.json();

      if (data.success) {
        searchResults = data.products;
        selectedProducts.clear();

        // Check which products are already imported
        const productRanges = data.products.map((p: any) => p.range);
        const checkResponse = await fetch('/opti-admin/api/tdklambda-check-imported.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productRanges })
        });

        const checkData = await checkResponse.json();
        if (checkData.success) {
          importStatus = checkData.importStatus;
        }

        const alreadyImportedCount = Object.values(importStatus).filter(Boolean).length;
        const newProductsCount = data.products.length - alreadyImportedCount;

        statusMessage = {
          type: 'success',
          text: `Found ${data.products.length} products (${newProductsCount} new, ${alreadyImportedCount} already imported)`
        };
      } else {
        statusMessage = {
          type: 'error',
          text: data.error || 'Search failed'
        };
      }
    } catch (error) {
      statusMessage = {
        type: 'error',
        text: error instanceof Error ? error.message : 'Search failed'
      };
    } finally {
      isSearching = false;
    }
  }

  // Toggle product selection
  function toggleProduct(uniqueId: string) {
    const newSet = new Set(selectedProducts);
    if (newSet.has(uniqueId)) {
      newSet.delete(uniqueId);
    } else {
      newSet.add(uniqueId);
    }
    selectedProducts = newSet; // Create new Set to trigger reactivity
  }

  // Import selected products
  async function importProducts() {
    if (selectedProducts.size === 0) {
      statusMessage = { type: 'error', text: 'No products selected' };
      return;
    }

    isImporting = true;
    statusMessage = null;

    try {
      const productsToImport = searchResults.filter(p =>
        selectedProducts.has(p.uniqueId) && !importStatus[p.range]
      );

      if (productsToImport.length === 0) {
        statusMessage = {
          type: 'error',
          text: 'All selected products are already imported'
        };
        isImporting = false;
        return;
      }

      const response = await fetch('/opti-admin/api/tdklambda-import.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: productsToImport,
          locale: 'en'
        })
      });

      const data = await response.json();

      if (data.success) {
        statusMessage = {
          type: 'success',
          text: `Successfully imported ${data.imported} products`
        };
        selectedProducts.clear();

        // Refresh import status
        const productRanges = searchResults.map((p: any) => p.range);
        const checkResponse = await fetch('/opti-admin/api/tdklambda-check-imported.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productRanges })
        });
        const checkData = await checkResponse.json();
        if (checkData.success) {
          importStatus = checkData.importStatus;
        }
      } else {
        statusMessage = {
          type: 'error',
          text: data.error || 'Import failed'
        };
      }
    } catch (error) {
      statusMessage = {
        type: 'error',
        text: error instanceof Error ? error.message : 'Import failed'
      };
    } finally {
      isImporting = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold mb-6">TDK-Lambda Product Import</h2>

  <!-- Status Message -->
  {#if statusMessage}
    <StatusMessage type={statusMessage.type} message={statusMessage.text} />
  {/if}

  <!-- Search Form -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-lg font-semibold mb-4">Search Parameters</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Output Voltage (V)</label>
        <input
          type="text"
          bind:value={searchParams.voltage}
          placeholder="e.g., 12, 24, 48"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Output Current (A)</label>
        <input
          type="text"
          bind:value={searchParams.current}
          placeholder="e.g., 5, 10, 15"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Number of Outputs</label>
        <select
          bind:value={searchParams.numberOfOutputs}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1 Output</option>
          <option value="2">2 Outputs</option>
          <option value="3">3 Outputs</option>
          <option value="4">4 Outputs</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Input Phase</label>
        <select
          bind:value={searchParams.InputPhases}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">All Phases</option>
          <option value="1">Single Phase</option>
          <option value="3">Three Phase</option>
        </select>
      </div>
    </div>

    <div class="mt-4">
      <button
        onclick={searchProducts}
        disabled={isSearching}
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isSearching}
          <LoadingSpinner size="sm" /> Searching...
        {:else}
          Search Products
        {/if}
      </button>
    </div>
  </div>

  <!-- Results -->
  {#if searchResults.length > 0}
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">
          Search Results ({searchResults.length} products)
        </h3>
        <button
          onclick={importProducts}
          disabled={selectedProducts.size === 0 || isImporting}
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isImporting}
            <LoadingSpinner size="sm" /> Importing...
          {:else}
            Import Selected ({selectedProducts.size})
          {/if}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.size > 0 &&
                           selectedProducts.size === searchResults.filter(p => !importStatus[p.range]).length}
                  onchange={(e) => {
                    if (e.currentTarget.checked) {
                      // Only select non-imported products
                      selectedProducts = new Set(
                        searchResults
                          .filter(p => !importStatus[p.range])
                          .map(p => p.uniqueId)
                      );
                    } else {
                      selectedProducts = new Set();
                    }
                  }}
                  class="w-4 h-4"
                />
              </th>
              <th class="px-4 py-2 text-left">Product</th>
              <th class="px-4 py-2 text-left">Model</th>
              <th class="px-4 py-2 text-left">Input</th>
              <th class="px-4 py-2 text-left">Output Power</th>
              <th class="px-4 py-2 text-left">Dimensions (WxLxH mm)</th>
              <th class="px-4 py-2 text-left">Features</th>
            </tr>
          </thead>
          <tbody>
            {#each searchResults as product}
              {@const isImported = importStatus[product.range]}
              <tr class="border-t {isImported ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'}">
                <td class="px-4 py-2">
                  {#if isImported}
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  {:else}
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.uniqueId)}
                      onchange={() => toggleProduct(product.uniqueId)}
                      class="w-4 h-4"
                    />
                  {/if}
                </td>
                <td class="px-4 py-2 font-medium">
                  {product.displayHeading}
                  {#if isImported}
                    <span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Already Imported
                    </span>
                  {/if}
                </td>
                <td class="px-4 py-2 text-sm">{product.itemDescription}</td>
                <td class="px-4 py-2 text-sm">{product.inVoltRange}</td>
                <td class="px-4 py-2 text-sm">
                  {product.unitOutputPower.totalOutputPowerHighLine}W
                </td>
                <td class="px-4 py-2 text-sm">
                  {product.dimensions.unitWidth} x
                  {product.dimensions.unitLength} x
                  {product.dimensions.unitHeight}
                </td>
                <td class="px-4 py-2 text-xs">
                  <ul class="list-disc list-inside">
                    {#each product.features.slice(0, 2) as feature}
                      <li>{feature}</li>
                    {/each}
                  </ul>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
