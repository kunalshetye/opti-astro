<script lang="ts">
import { onMount } from 'svelte';
import type { Product } from '../../../lib/product-catalog-utils';
import StatusMessage from './shared/_StatusMessage.svelte';
import LoadingSpinner from './shared/_LoadingSpinner.svelte';
import Modal from './shared/_Modal.svelte';

// State
let products = $state<Product[]>([]);
let isLoading = $state(false);
let message = $state('');
let messageType = $state<'success' | 'error'>('success');
let searchQuery = $state('');
let filterCategory = $state<string>('all');
let showModal = $state(false);
let editingProduct = $state<Product | null>(null);

// Bulk edit state
let selectedSKUs = $state<Set<string>>(new Set());
let showBulkEditModal = $state(false);
let bulkEditField = $state<string>('');
let bulkEditValue = $state<string>('');

// Inline editing state
let inlineEditMode = $state(false);
let pendingEdits = $state<Map<string, Partial<Product>>>(new Map());

// Expandable row state
let expandedSKUs = $state<Set<string>>(new Set());

// Form state
let formSKU = $state('');
let formNameEn = $state('');
let formNameDe = $state('');
let formNameFr = $state('');
let formDescriptionEn = $state('');
let formDescriptionDe = $state('');
let formDescriptionFr = $state('');
let formPrice = $state<number>(0);
let formSalePrice = $state<number | null>(null);
let formCurrency = $state('USD');
let formImageUrl = $state('');
let formImageAlt = $state('');
let formAvailability = $state<'InStock' | 'OutOfStock' | 'PreOrder'>('InStock');
let formBrand = $state('');
let formCategory = $state('');
let formTags = $state('');

// Derived state
let categories = $derived(
    Array.from(new Set(products.map(p => p.category || 'Uncategorized')))
        .sort()
);

let filteredProducts = $derived(
    products.filter(product => {
        const matchesSearch = !searchQuery ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;

        return matchesSearch && matchesCategory;
    })
);

// Load products
async function loadProducts() {
    isLoading = true;
    try {
        const response = await fetch('/opti-admin/api/products.json');
        const data = await response.json();

        if (data.success) {
            products = data.products;
            showMessage(`Loaded ${data.metadata.count} products`, 'success');
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(`Failed to load products: ${error}`, 'error');
    } finally {
        isLoading = false;
    }
}

// Show message
function showMessage(msg: string, type: 'success' | 'error') {
    message = msg;
    messageType = type;
    setTimeout(() => { message = ''; }, 5000);
}

// Open modal for create/edit
function openModal(product: Product | null = null) {
    if (product) {
        // Edit mode
        editingProduct = product;
        formSKU = product.sku;
        formNameEn = product.name.en || '';
        formNameDe = product.name.de || '';
        formNameFr = product.name.fr || '';
        formDescriptionEn = product.description?.en || '';
        formDescriptionDe = product.description?.de || '';
        formDescriptionFr = product.description?.fr || '';
        formPrice = product.price;
        formSalePrice = product.salePrice || null;
        formCurrency = product.currency;
        formImageUrl = product.images[0]?.url || '';
        formImageAlt = product.images[0]?.alt || '';
        formAvailability = product.availability;
        formBrand = product.brand || '';
        formCategory = product.category || '';
        formTags = product.tags?.join(', ') || '';
    } else {
        // Create mode
        resetForm();
    }
    showModal = true;
}

// Reset form
function resetForm() {
    editingProduct = null;
    formSKU = '';
    formNameEn = '';
    formNameDe = '';
    formNameFr = '';
    formDescriptionEn = '';
    formDescriptionDe = '';
    formDescriptionFr = '';
    formPrice = 0;
    formSalePrice = null;
    formCurrency = 'USD';
    formImageUrl = '';
    formImageAlt = '';
    formAvailability = 'InStock';
    formBrand = '';
    formCategory = '';
    formTags = '';
}

// Save product
async function saveProduct(e: Event) {
    e.preventDefault();

    // Validation
    if (!formSKU || !formNameEn || formPrice <= 0 || !formImageUrl) {
        showMessage('SKU, English name, valid price, and image URL are required', 'error');
        return;
    }

    const product: Product = {
        sku: formSKU.toUpperCase(),
        name: {
            en: formNameEn,
            ...(formNameDe && { de: formNameDe }),
            ...(formNameFr && { fr: formNameFr })
        },
        description: {
            ...(formDescriptionEn && { en: formDescriptionEn }),
            ...(formDescriptionDe && { de: formDescriptionDe }),
            ...(formDescriptionFr && { fr: formDescriptionFr })
        },
        price: formPrice,
        salePrice: formSalePrice,
        currency: formCurrency,
        images: [{
            url: formImageUrl,
            alt: formImageAlt || formNameEn,
            isPrimary: true,
            sortOrder: 0
        }],
        availability: formAvailability,
        brand: formBrand || undefined,
        category: formCategory || undefined,
        tags: formTags ? formTags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    try {
        const response = await fetch('/opti-admin/api/products.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product })
        });

        const data = await response.json();

        if (data.success) {
            showMessage(editingProduct ? 'Product updated successfully' : 'Product created successfully', 'success');
            showModal = false;
            resetForm();
            await loadProducts();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(`Failed to save product: ${error}`, 'error');
    }
}

// Delete product
async function deleteProduct(sku: string) {
    if (!confirm(`Delete product ${sku}?`)) return;

    try {
        const response = await fetch('/opti-admin/api/products.json', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sku })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Product deleted successfully', 'success');
            await loadProducts();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(`Failed to delete product: ${error}`, 'error');
    }
}

// Toggle individual product selection
function toggleSelection(sku: string) {
    if (selectedSKUs.has(sku)) {
        selectedSKUs.delete(sku);
    } else {
        selectedSKUs.add(sku);
    }
    selectedSKUs = new Set(selectedSKUs); // Trigger reactivity
}

// Toggle all visible products
function toggleSelectAll() {
    if (selectedSKUs.size === filteredProducts.length && filteredProducts.length > 0) {
        // Deselect all
        selectedSKUs.clear();
    } else {
        // Select all visible products
        filteredProducts.forEach(p => selectedSKUs.add(p.sku));
    }
    selectedSKUs = new Set(selectedSKUs);
}

// Clear all selections
function clearSelection() {
    selectedSKUs.clear();
    selectedSKUs = new Set(selectedSKUs);
}

// Open bulk edit modal
function openBulkEditModal() {
    if (selectedSKUs.size === 0) {
        showMessage('Please select at least one product', 'error');
        return;
    }
    bulkEditField = '';
    bulkEditValue = '';
    showBulkEditModal = true;
}

// Apply bulk edit
async function applyBulkEdit(e: Event) {
    e.preventDefault();

    if (!bulkEditField || bulkEditValue === '') {
        showMessage('Please select a field and enter a value', 'error');
        return;
    }

    const selectedProducts = products.filter(p => selectedSKUs.has(p.sku));
    const count = selectedProducts.length;

    if (!confirm(`Update ${bulkEditField} for ${count} products?`)) {
        return;
    }

    try {
        // Update each product
        for (const product of selectedProducts) {
            const updatedProduct = { ...product };

            // Apply field update
            switch (bulkEditField) {
                case 'imageUrl':
                    updatedProduct.images[0].url = bulkEditValue;
                    break;
                case 'availability':
                    updatedProduct.availability = bulkEditValue as 'InStock' | 'OutOfStock' | 'PreOrder';
                    break;
                case 'category':
                    updatedProduct.category = bulkEditValue;
                    break;
                case 'brand':
                    updatedProduct.brand = bulkEditValue;
                    break;
                case 'currency':
                    updatedProduct.currency = bulkEditValue;
                    break;
                case 'salePrice':
                    updatedProduct.salePrice = parseFloat(bulkEditValue) || null;
                    break;
            }

            // Save via API
            const response = await fetch('/opti-admin/api/products.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: updatedProduct })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(`Failed to update ${product.sku}: ${data.error}`);
            }
        }

        showMessage(`Successfully updated ${count} products`, 'success');
        showBulkEditModal = false;
        clearSelection();
        await loadProducts();
    } catch (error) {
        showMessage(`Bulk edit failed: ${error}`, 'error');
    }
}

// Toggle inline edit mode
function toggleInlineEditMode() {
    if (inlineEditMode) {
        // Exiting edit mode - check for unsaved changes
        if (pendingEdits.size > 0) {
            if (!confirm(`You have ${pendingEdits.size} unsaved changes. Discard them?`)) {
                return;
            }
            pendingEdits.clear();
            pendingEdits = new Map();
        }
        // Clear expanded rows when exiting edit mode
        expandedSKUs.clear();
        expandedSKUs = new Set(expandedSKUs);
    }
    inlineEditMode = !inlineEditMode;
}

// Update a field for a specific product
function updatePendingEdit(sku: string, field: keyof Product | 'imageUrl' | 'imageAlt', value: any) {
    const existing = pendingEdits.get(sku) || {};
    const product = products.find(p => p.sku === sku);

    // Handle nested fields
    if (field === 'imageUrl') {
        if (product) {
            existing.images = [{
                ...product.images[0],
                ...existing.images?.[0],
                url: value
            }];
        }
    } else if (field === 'imageAlt') {
        if (product) {
            existing.images = [{
                ...product.images[0],
                ...existing.images?.[0],
                alt: value
            }];
        }
    } else {
        existing[field] = value;
    }

    pendingEdits.set(sku, existing);
    pendingEdits = new Map(pendingEdits);
}

// Save all pending edits
async function saveAllPendingEdits() {
    if (pendingEdits.size === 0) {
        showMessage('No changes to save', 'error');
        return;
    }

    const count = pendingEdits.size;
    if (!confirm(`Save changes for ${count} products?`)) {
        return;
    }

    try {
        for (const [sku, edits] of pendingEdits.entries()) {
            const product = products.find(p => p.sku === sku);
            if (!product) continue;

            const updatedProduct = { ...product, ...edits };

            const response = await fetch('/opti-admin/api/products.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: updatedProduct })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(`Failed to update ${sku}: ${data.error}`);
            }
        }

        showMessage(`Successfully saved ${count} products`, 'success');
        pendingEdits.clear();
        pendingEdits = new Map();
        expandedSKUs.clear();
        expandedSKUs = new Set(expandedSKUs);
        inlineEditMode = false;
        await loadProducts();
    } catch (error) {
        showMessage(`Save failed: ${error}`, 'error');
    }
}

// Get current value or pending edit value
function getEditValue(product: Product, field: string): string {
    const pending = pendingEdits.get(product.sku);
    if (!pending) {
        if (field === 'imageUrl') return product.images[0]?.url || '';
        return product[field as keyof Product] as string || '';
    }

    if (field === 'imageUrl') {
        return pending.images?.[0]?.url || product.images[0]?.url || '';
    }
    return (pending[field as keyof Product] as string) || (product[field as keyof Product] as string) || '';
}

// Toggle row expansion
function toggleRowExpansion(sku: string) {
    if (expandedSKUs.has(sku)) {
        expandedSKUs.delete(sku);
    } else {
        expandedSKUs.add(sku);
    }
    expandedSKUs = new Set(expandedSKUs);
}

// Expand all selected rows
function expandAllSelected() {
    selectedSKUs.forEach(sku => expandedSKUs.add(sku));
    expandedSKUs = new Set(expandedSKUs);
}

// Collapse all rows
function collapseAll() {
    expandedSKUs.clear();
    expandedSKUs = new Set(expandedSKUs);
}

// Load on mount
onMount(() => {
    loadProducts();
});
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p class="text-gray-600 mt-2">Manage products available via SKU lookup in GenericProduct components</p>
    </div>

    <!-- Status Message -->
    {#if message}
        <StatusMessage type={messageType} message={message} />
    {/if}

    <!-- Toolbar -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex flex-wrap gap-4 items-center justify-between">
            <div class="flex gap-4 flex-1">
                <!-- Search -->
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search by SKU, name, or brand..."
                    class="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <!-- Category Filter -->
                <select bind:value={filterCategory} class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Categories</option>
                    {#each categories as category}
                        <option value={category}>{category}</option>
                    {/each}
                </select>
            </div>

            <!-- Add Product Button -->
            <button onclick={() => openModal()} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Product
            </button>
        </div>
    </div>

    <!-- Bulk Actions Bar (shows when products are selected) -->
    {#if selectedSKUs.size > 0}
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <span class="text-sm font-medium text-blue-900">
                        {selectedSKUs.size} product{selectedSKUs.size !== 1 ? 's' : ''} selected
                    </span>
                    <button
                        onclick={clearSelection}
                        class="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear selection
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <!-- Inline Edit Mode Toggle -->
                    <button
                        onclick={toggleInlineEditMode}
                        class="px-4 py-2 {inlineEditMode ? 'bg-gray-600' : 'bg-purple-600'} text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                    >
                        {#if inlineEditMode}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Exit Edit Mode
                        {:else}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Edit Inline
                        {/if}
                    </button>

                    <!-- Expand/Collapse All buttons (when in inline edit mode) -->
                    {#if inlineEditMode}
                        <button
                            onclick={expandAllSelected}
                            class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Expand all selected rows"
                        >
                            Expand All
                        </button>
                        <button
                            onclick={collapseAll}
                            class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Collapse all rows"
                        >
                            Collapse All
                        </button>
                    {/if}

                    <!-- Modal Bulk Edit Button -->
                    <button
                        onclick={openBulkEditModal}
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Bulk Edit (Same Value)
                    </button>
                </div>
            </div>

            <!-- Save Bar (shows when in inline edit mode with pending changes) -->
            {#if inlineEditMode && pendingEdits.size > 0}
                <div class="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                    <span class="text-sm text-blue-900">
                        {pendingEdits.size} unsaved change{pendingEdits.size !== 1 ? 's' : ''}
                    </span>
                    <button
                        onclick={saveAllPendingEdits}
                        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Save All Changes
                    </button>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Loading State -->
    {#if isLoading}
        <div class="flex justify-center py-12">
            <LoadingSpinner />
        </div>
    {:else}
        <!-- Products Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedSKUs.size === filteredProducts.length && filteredProducts.length > 0}
                                    onchange={toggleSelectAll}
                                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    aria-label="Select all products"
                                />
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each filteredProducts as product (product.sku)}
                            <tr class="hover:bg-gray-50" class:bg-purple-50={inlineEditMode && selectedSKUs.has(product.sku)}>
                                <td class="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedSKUs.has(product.sku)}
                                        onchange={() => toggleSelection(product.sku)}
                                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        aria-label={`Select ${product.name.en}`}
                                    />
                                </td>

                                <!-- SKU (not editable) -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{product.sku}</td>

                                <!-- Name (editable inline for selected products) -->
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if inlineEditMode && selectedSKUs.has(product.sku)}
                                        <input
                                            type="text"
                                            value={pendingEdits.get(product.sku)?.name?.en || product.name.en || ''}
                                            oninput={(e) => updatePendingEdit(product.sku, 'name', { ...product.name, en: e.currentTarget.value })}
                                            class="w-40 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium"
                                            placeholder="Product name"
                                        />
                                        {#if product.brand || pendingEdits.get(product.sku)?.brand}
                                            <input
                                                type="text"
                                                value={getEditValue(product, 'brand')}
                                                oninput={(e) => updatePendingEdit(product.sku, 'brand', e.currentTarget.value)}
                                                class="w-40 px-2 py-1 mt-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs text-gray-600"
                                                placeholder="Brand"
                                            />
                                        {/if}
                                    {:else}
                                        <div class="text-sm font-medium text-gray-900">{product.name.en}</div>
                                        {#if product.brand}
                                            <div class="text-sm text-gray-500">{product.brand}</div>
                                        {/if}
                                    {/if}
                                </td>

                                <!-- Price (editable inline for selected products) -->
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if inlineEditMode && selectedSKUs.has(product.sku)}
                                        <div class="space-y-1">
                                            <input
                                                type="number"
                                                value={pendingEdits.get(product.sku)?.price ?? product.price}
                                                oninput={(e) => updatePendingEdit(product.sku, 'price', parseFloat(e.currentTarget.value))}
                                                class="w-24 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                                step="0.01"
                                                min="0"
                                            />
                                            <input
                                                type="number"
                                                value={pendingEdits.get(product.sku)?.salePrice ?? product.salePrice ?? ''}
                                                oninput={(e) => updatePendingEdit(product.sku, 'salePrice', parseFloat(e.currentTarget.value) || null)}
                                                class="w-24 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs text-green-600"
                                                placeholder="Sale price"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    {:else}
                                        <div class="text-sm text-gray-900" class:line-through={product.salePrice}>
                                            {product.currency} {product.price.toFixed(2)}
                                        </div>
                                        {#if product.salePrice}
                                            <div class="text-sm font-semibold text-green-600">
                                                {product.currency} {product.salePrice.toFixed(2)}
                                            </div>
                                        {/if}
                                    {/if}
                                </td>

                                <!-- Category (editable inline for selected products) -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {#if inlineEditMode && selectedSKUs.has(product.sku)}
                                        <input
                                            type="text"
                                            value={getEditValue(product, 'category')}
                                            oninput={(e) => updatePendingEdit(product.sku, 'category', e.currentTarget.value)}
                                            class="w-full px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            placeholder="Category"
                                        />
                                    {:else}
                                        {product.category || '-'}
                                    {/if}
                                </td>

                                <!-- Availability (editable inline for selected products) -->
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if inlineEditMode && selectedSKUs.has(product.sku)}
                                        <select
                                            value={getEditValue(product, 'availability')}
                                            onchange={(e) => updatePendingEdit(product.sku, 'availability', e.currentTarget.value)}
                                            class="px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
                                        >
                                            <option value="InStock">In Stock</option>
                                            <option value="OutOfStock">Out of Stock</option>
                                            <option value="PreOrder">Pre-Order</option>
                                        </select>
                                    {:else}
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {product.availability === 'InStock' ? 'bg-green-100 text-green-800' : product.availability === 'OutOfStock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                            {product.availability}
                                        </span>
                                    {/if}
                                </td>

                                <!-- Actions -->
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {#if inlineEditMode && selectedSKUs.has(product.sku)}
                                        <div class="flex items-center justify-end gap-2">
                                            {#if pendingEdits.has(product.sku)}
                                                <span class="text-xs text-purple-600 font-semibold">Modified</span>
                                            {/if}
                                            <!-- Expand/Collapse toggle -->
                                            <button
                                                onclick={() => toggleRowExpansion(product.sku)}
                                                class="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                                                title={expandedSKUs.has(product.sku) ? 'Collapse' : 'Expand for more fields'}
                                            >
                                                <svg class="w-5 h-5 transition-transform {expandedSKUs.has(product.sku) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    {:else}
                                        <button onclick={() => openModal(product)} class="text-blue-600 hover:text-blue-900 mr-4">
                                            Edit
                                        </button>
                                        <button onclick={() => deleteProduct(product.sku)} class="text-red-600 hover:text-red-900">
                                            Delete
                                        </button>
                                    {/if}
                                </td>
                            </tr>

                            <!-- Expanded row for additional fields -->
                            {#if inlineEditMode && selectedSKUs.has(product.sku) && expandedSKUs.has(product.sku)}
                                <tr class="bg-purple-50">
                                    <td colspan="7" class="px-6 py-4">
                                        <div class="bg-white rounded-lg border border-purple-200 p-4">
                                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                                <!-- Image URL -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                                                    <input
                                                        type="url"
                                                        value={getEditValue(product, 'imageUrl')}
                                                        oninput={(e) => updatePendingEdit(product.sku, 'imageUrl', e.currentTarget.value)}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>

                                                <!-- Image Alt -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Image Alt Text</label>
                                                    <input
                                                        type="text"
                                                        value={pendingEdits.get(product.sku)?.images?.[0]?.alt || product.images[0]?.alt || ''}
                                                        oninput={(e) => updatePendingEdit(product.sku, 'imageAlt', e.currentTarget.value)}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Product image description"
                                                    />
                                                </div>

                                                <!-- Currency -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                                                    <select
                                                        value={getEditValue(product, 'currency')}
                                                        onchange={(e) => updatePendingEdit(product.sku, 'currency', e.currentTarget.value)}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                        <option value="CAD">CAD</option>
                                                    </select>
                                                </div>

                                                <!-- Tags -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
                                                    <input
                                                        type="text"
                                                        value={pendingEdits.get(product.sku)?.tags?.join(', ') || product.tags?.join(', ') || ''}
                                                        oninput={(e) => updatePendingEdit(product.sku, 'tags', e.currentTarget.value.split(',').map(t => t.trim()).filter(Boolean))}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                        placeholder="tag1, tag2, tag3"
                                                    />
                                                </div>

                                                <!-- Name (DE) -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Name (German)</label>
                                                    <input
                                                        type="text"
                                                        value={pendingEdits.get(product.sku)?.name?.de || product.name.de || ''}
                                                        oninput={(e) => updatePendingEdit(product.sku, 'name', { ...product.name, ...pendingEdits.get(product.sku)?.name, de: e.currentTarget.value })}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                        placeholder="German name"
                                                    />
                                                </div>

                                                <!-- Name (FR) -->
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-600 mb-1">Name (French)</label>
                                                    <input
                                                        type="text"
                                                        value={pendingEdits.get(product.sku)?.name?.fr || product.name.fr || ''}
                                                        oninput={(e) => updatePendingEdit(product.sku, 'name', { ...product.name, ...pendingEdits.get(product.sku)?.name, fr: e.currentTarget.value })}
                                                        class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                        placeholder="French name"
                                                    />
                                                </div>

                                            </div>

                                            <!-- Descriptions Section (full width) -->
                                            <div class="mt-4 pt-4 border-t border-gray-200">
                                                <h4 class="text-xs font-semibold text-gray-600 mb-3">Descriptions</h4>
                                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                    <!-- Description (EN) -->
                                                    <div>
                                                        <label class="block text-xs font-medium text-gray-600 mb-1">Description (English)</label>
                                                        <textarea
                                                            value={pendingEdits.get(product.sku)?.description?.en || product.description?.en || ''}
                                                            oninput={(e) => updatePendingEdit(product.sku, 'description', { ...product.description, ...pendingEdits.get(product.sku)?.description, en: e.currentTarget.value })}
                                                            class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                            rows="3"
                                                            placeholder="<p>English description...</p>"
                                                        ></textarea>
                                                    </div>

                                                    <!-- Description (DE) -->
                                                    <div>
                                                        <label class="block text-xs font-medium text-gray-600 mb-1">Description (German)</label>
                                                        <textarea
                                                            value={pendingEdits.get(product.sku)?.description?.de || product.description?.de || ''}
                                                            oninput={(e) => updatePendingEdit(product.sku, 'description', { ...product.description, ...pendingEdits.get(product.sku)?.description, de: e.currentTarget.value })}
                                                            class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                            rows="3"
                                                            placeholder="<p>German description...</p>"
                                                        ></textarea>
                                                    </div>

                                                    <!-- Description (FR) -->
                                                    <div>
                                                        <label class="block text-xs font-medium text-gray-600 mb-1">Description (French)</label>
                                                        <textarea
                                                            value={pendingEdits.get(product.sku)?.description?.fr || product.description?.fr || ''}
                                                            oninput={(e) => updatePendingEdit(product.sku, 'description', { ...product.description, ...pendingEdits.get(product.sku)?.description, fr: e.currentTarget.value })}
                                                            class="w-full px-2 py-1.5 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                                                            rows="3"
                                                            placeholder="<p>French description...</p>"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>

                {#if filteredProducts.length === 0}
                    <div class="text-center py-12 text-gray-500">
                        No products found
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Product Form Modal -->
    <Modal bind:open={showModal} title={editingProduct ? 'Edit Product' : 'Add Product'} size="lg">
        {#snippet children()}
            <form onsubmit={saveProduct} class="space-y-4">
                <!-- SKU -->
                <div>
                    <label for="sku" class="block text-sm font-medium text-gray-700 mb-1">
                        SKU *
                    </label>
                    <input
                        type="text"
                        id="sku"
                        bind:value={formSKU}
                        disabled={!!editingProduct}
                        placeholder="TS-BLU-MD-001"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                    />
                </div>

                <!-- Name (EN) -->
                <div>
                    <label for="nameEn" class="block text-sm font-medium text-gray-700 mb-1">
                        Product Name (English) *
                    </label>
                    <input
                        type="text"
                        id="nameEn"
                        bind:value={formNameEn}
                        placeholder="Classic Blue T-Shirt"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <!-- Name (DE) -->
                <div>
                    <label for="nameDe" class="block text-sm font-medium text-gray-700 mb-1">
                        Product Name (German)
                    </label>
                    <input
                        type="text"
                        id="nameDe"
                        bind:value={formNameDe}
                        placeholder="Klassisches Blaues T-Shirt"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Name (FR) -->
                <div>
                    <label for="nameFr" class="block text-sm font-medium text-gray-700 mb-1">
                        Product Name (French)
                    </label>
                    <input
                        type="text"
                        id="nameFr"
                        bind:value={formNameFr}
                        placeholder="T-shirt Bleu Classique"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Description (EN) -->
                <div>
                    <label for="descEn" class="block text-sm font-medium text-gray-700 mb-1">
                        Description (English)
                    </label>
                    <textarea
                        id="descEn"
                        bind:value={formDescriptionEn}
                        placeholder="<p>Product description...</p>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    ></textarea>
                </div>

                <!-- Description (DE) -->
                <div>
                    <label for="descDe" class="block text-sm font-medium text-gray-700 mb-1">
                        Description (German)
                    </label>
                    <textarea
                        id="descDe"
                        bind:value={formDescriptionDe}
                        placeholder="<p>Produktbeschreibung...</p>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    ></textarea>
                </div>

                <!-- Description (FR) -->
                <div>
                    <label for="descFr" class="block text-sm font-medium text-gray-700 mb-1">
                        Description (French)
                    </label>
                    <textarea
                        id="descFr"
                        bind:value={formDescriptionFr}
                        placeholder="<p>Description du produit...</p>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    ></textarea>
                </div>

                <!-- Price & Currency -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                        </label>
                        <input
                            type="number"
                            id="price"
                            bind:value={formPrice}
                            min="0"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                        </label>
                        <select id="currency" bind:value={formCurrency} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CAD">CAD</option>
                        </select>
                    </div>
                </div>

                <!-- Sale Price -->
                <div>
                    <label for="salePrice" class="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (Optional)
                    </label>
                    <input
                        type="number"
                        id="salePrice"
                        bind:value={formSalePrice}
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Image URL -->
                <div>
                    <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">
                        Image URL *
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        bind:value={formImageUrl}
                        placeholder="https://example.com/product.jpg"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <!-- Image Alt Text -->
                <div>
                    <label for="imageAlt" class="block text-sm font-medium text-gray-700 mb-1">
                        Image Alt Text
                    </label>
                    <input
                        type="text"
                        id="imageAlt"
                        bind:value={formImageAlt}
                        placeholder="Product image description"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Availability -->
                <div>
                    <label for="availability" class="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                    </label>
                    <select id="availability" bind:value={formAvailability} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="InStock">In Stock</option>
                        <option value="OutOfStock">Out of Stock</option>
                        <option value="PreOrder">Pre-Order</option>
                    </select>
                </div>

                <!-- Brand & Category -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">
                            Brand
                        </label>
                        <input
                            type="text"
                            id="brand"
                            bind:value={formBrand}
                            placeholder="EcoWear"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            bind:value={formCategory}
                            placeholder="Apparel/T-Shirts"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <!-- Tags -->
                <div>
                    <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        bind:value={formTags}
                        placeholder="cotton, organic, casual"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Form Actions -->
                <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button type="button" onclick={() => { showModal = false; resetForm(); }} class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {editingProduct ? 'Update' : 'Create'} Product
                    </button>
                </div>
            </form>
        {/snippet}
    </Modal>

    <!-- Bulk Edit Modal -->
    <Modal bind:open={showBulkEditModal} title="Bulk Edit Products" size="md">
        {#snippet children()}
            <form onsubmit={applyBulkEdit} class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p class="text-sm text-blue-900">
                        You are editing <strong>{selectedSKUs.size}</strong> product{selectedSKUs.size !== 1 ? 's' : ''}.
                        Changes will be applied to all selected products.
                    </p>
                </div>

                <!-- Field Selector -->
                <div>
                    <label for="bulkField" class="block text-sm font-medium text-gray-700 mb-1">
                        Field to Update *
                    </label>
                    <select
                        id="bulkField"
                        bind:value={bulkEditField}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">-- Select Field --</option>
                        <option value="imageUrl">Image URL</option>
                        <option value="availability">Availability</option>
                        <option value="category">Category</option>
                        <option value="brand">Brand</option>
                        <option value="currency">Currency</option>
                        <option value="salePrice">Sale Price</option>
                    </select>
                </div>

                <!-- Value Input (Dynamic based on field) -->
                <div>
                    <label for="bulkValue" class="block text-sm font-medium text-gray-700 mb-1">
                        New Value *
                    </label>

                    {#if bulkEditField === 'availability'}
                        <select
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">-- Select Availability --</option>
                            <option value="InStock">In Stock</option>
                            <option value="OutOfStock">Out of Stock</option>
                            <option value="PreOrder">Pre-Order</option>
                        </select>
                    {:else if bulkEditField === 'currency'}
                        <select
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">-- Select Currency --</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CAD">CAD</option>
                        </select>
                    {:else if bulkEditField === 'salePrice'}
                        <input
                            type="number"
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            placeholder="Enter sale price or leave empty to remove"
                            min="0"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    {:else if bulkEditField === 'imageUrl'}
                        <input
                            type="url"
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            placeholder="https://example.com/image.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    {:else if bulkEditField}
                        <input
                            type="text"
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            placeholder={`Enter ${bulkEditField}`}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    {:else}
                        <input
                            type="text"
                            id="bulkValue"
                            bind:value={bulkEditValue}
                            placeholder="Select a field first"
                            disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    {/if}
                </div>

                <!-- Warning Message -->
                {#if bulkEditField && bulkEditValue}
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p class="text-sm text-yellow-900">
                            ⚠️ This will replace <strong>{bulkEditField}</strong> for <strong>{selectedSKUs.size}</strong> products.
                            This action cannot be undone.
                        </p>
                    </div>
                {/if}

                <!-- Form Actions -->
                <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onclick={() => { showBulkEditModal = false; }}
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={!bulkEditField || bulkEditValue === ''}
                    >
                        Apply to {selectedSKUs.size} Products
                    </button>
                </div>
            </form>
        {/snippet}
    </Modal>
</div>
