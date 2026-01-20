<script lang="ts">
  import { onMount } from 'svelte';
  import CmsSync from './components/_CmsSync.svelte';
  import GraphSynonyms from './components/_GraphSynonyms.svelte';
  import GraphPinnedResults from './components/_GraphPinnedResults.svelte';
  import StyleManager from './style-manager/_StyleManager.svelte';
  import Dashboard from './components/_Dashboard.svelte';
  import RedirectManagement from './components/_RedirectManagement.svelte';
  import PublishedPagesDashboard from './components/published-pages/_PublishedPagesDashboard.svelte';
  import ReportingCenter from './components/reporting-center/_ReportingCenter.svelte';
  import ProductCatalog from './components/_ProductCatalog.svelte';
  import TdkLambdaImport from './components/_TdkLambdaImport.svelte';
  import Sidebar from './components/_Sidebar.svelte';

  interface Props {
    cmsUrl?: string;
    initialView?: string;
  }

  let { cmsUrl, initialView = 'dashboard' }: Props = $props();

  // Client-side routing state
  let currentView = $state(initialView);

  // Navigation function to switch views and update URL
  function navigateTo(view: string) {
    currentView = view;

    // Update URL without reload
    const url = new URL(window.location.href);
    if (view === 'dashboard') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', view);
    }
    window.history.pushState({ view }, '', url);

    // Dispatch custom event for AdminLayout to update active state
    window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { view } }));

    // Update page title
    updatePageTitle(view);
  }

  // Update page title based on view
  function updatePageTitle(view: string) {
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'synonyms': 'Synonyms Manager',
      'pinned': 'Pinned Results Manager',
      'cms-sync': 'CMS Sync',
      'style-manager': 'Style Manager',
      'redirects': 'Redirect Management',
      'published-pages': 'Published Pages Dashboard',
      'reporting-center': 'Reporting Center',
      'product-catalog': 'Product Catalog',
      'tdklambda-import': 'TDK-Lambda Import'
    };
    document.title = `${titles[view] || 'Dashboard'} | Optimizely Admin`;
  }

  // Handle browser back/forward buttons
  onMount(() => {
    function handlePopState(event: PopStateEvent) {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || 'dashboard';
      currentView = view;
      updatePageTitle(view);
    }

    window.addEventListener('popstate', handlePopState);

    // Set initial title
    updatePageTitle(currentView);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
</script>

<div class="admin-layout">
  <Sidebar {currentView} {navigateTo} />

  <div class="admin-content">
    <div class="admin-app">
  {#if currentView === 'dashboard'}
    <Dashboard {cmsUrl} {navigateTo} />
  {:else if currentView === 'cms-sync'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <CmsSync {cmsUrl} />
    </div>
  {:else if currentView === 'synonyms'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <GraphSynonyms />
    </div>
  {:else if currentView === 'pinned'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <GraphPinnedResults />
    </div>
  {:else if currentView === 'style-manager'}
    <div class="h-screen flex flex-col">
      <!-- Back to Dashboard -->
      <div class="p-6 bg-white border-b border-gray-200">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <StyleManager />
      </div>
    </div>
  {:else if currentView === 'redirects'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <RedirectManagement />
    </div>
  {:else if currentView === 'published-pages'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <PublishedPagesDashboard />
    </div>
  {:else if currentView === 'reporting-center'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <ReportingCenter />
    </div>
  {:else if currentView === 'product-catalog'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <ProductCatalog />
    </div>
  {:else if currentView === 'tdklambda-import'}
    <div>
      <!-- Back to Dashboard -->
      <div class="mb-6">
        <button onclick={() => navigateTo('dashboard')} class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <TdkLambdaImport />
    </div>
  {/if}
    </div>
  </div>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }

  .admin-content {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
  }

  .admin-app {
    padding: 2rem;
  }

  @media (min-width: 1280px) {
    .admin-app {
      padding-right: 18rem;
    }
  }

  @media (max-width: 768px) {
    .admin-content {
      margin-left: 0;
    }
  }
</style>
