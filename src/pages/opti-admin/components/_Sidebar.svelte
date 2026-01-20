<script lang="ts">
  import { onMount } from 'svelte';
  import WipBadge from './shared/_WipBadge.svelte';

  interface Props {
    currentView: string;
    navigateTo: (view: string) => void;
  }

  let { currentView, navigateTo }: Props = $props();
  let isMobileOpen = $state(false);

  function toggleMobile() {
    isMobileOpen = !isMobileOpen;
  }

  function handleNavClick(view: string) {
    navigateTo(view);
    // Close mobile menu after navigation
    if (window.innerWidth <= 768) {
      isMobileOpen = false;
    }
  }

  // Close mobile menu when clicking outside
  onMount(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isMobileOpen && window.innerWidth <= 768) {
        const sidebar = document.getElementById('svelte-sidebar');
        const mobileButton = document.getElementById('svelte-mobile-button');
        if (sidebar && !sidebar.contains(e.target as Node) && !mobileButton?.contains(e.target as Node)) {
          isMobileOpen = false;
        }
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<!-- Mobile Header -->
<div class="mobile-header">
  <button id="svelte-mobile-button" onclick={toggleMobile} class="mobile-menu-button" aria-label="Toggle menu">
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <span class="text-white font-bold text-lg">Optimizely Admin</span>
  <div style="width: 2rem;"></div>
</div>

<!-- Sidebar Overlay (Mobile) -->
{#if isMobileOpen}
  <div
    class="sidebar-overlay active"
    onclick={toggleMobile}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && toggleMobile()}
    aria-label="Close sidebar"
  ></div>
{/if}

<!-- Sidebar -->
<aside id="svelte-sidebar" class="admin-sidebar {isMobileOpen ? 'mobile-open' : ''}">
  <div class="sidebar-header">
    <button onclick={() => handleNavClick('dashboard')} class="sidebar-logo">
      <span style="color: rgba(255, 255, 255, 0.8);">Optimizely</span> Admin
    </button>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">
      <div class="nav-section-title">Main</div>
      <button
        onclick={() => handleNavClick('dashboard')}
        class="nav-link {currentView === 'dashboard' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Dashboard
      </button>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">CMS Tools</div>
      <button
        onclick={() => handleNavClick('cms-sync')}
        class="nav-link {currentView === 'cms-sync' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
        CMS Sync
        <WipBadge size="small" />
      </button>
      <button
        onclick={() => handleNavClick('style-manager')}
        class="nav-link {currentView === 'style-manager' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
        </svg>
        Style Manager
      </button>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Graph Optimizations</div>
      <button
        onclick={() => handleNavClick('synonyms')}
        class="nav-link {currentView === 'synonyms' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>
        Synonyms
      </button>
      <button
        onclick={() => handleNavClick('pinned')}
        class="nav-link {currentView === 'pinned' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
        </svg>
        Pinned Results
      </button>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Site Management</div>
      <button
        onclick={() => handleNavClick('redirects')}
        class="nav-link {currentView === 'redirects' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Redirects
        <WipBadge size="small" />
      </button>
      <button
        onclick={() => handleNavClick('published-pages')}
        class="nav-link {currentView === 'published-pages' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Published Pages
        <WipBadge size="small" />
      </button>
      <button
        onclick={() => handleNavClick('reporting-center')}
        class="nav-link {currentView === 'reporting-center' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Reporting Center
      </button>
      <button
        onclick={() => handleNavClick('product-catalog')}
        class="nav-link {currentView === 'product-catalog' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        Product Catalog
      </button>
      <button
        onclick={() => handleNavClick('tdklambda-import')}
        class="nav-link {currentView === 'tdklambda-import' ? 'active' : ''}"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
        TDK-Lambda Import
      </button>
    </div>
  </nav>

  <div class="sidebar-footer">
    <a href="/" class="return-link">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Return to Site
    </a>
  </div>
</aside>

<style>
  .mobile-header {
    display: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .mobile-menu-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
  }

  .mobile-menu-button svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 30;
  }

  .sidebar-overlay.active {
    display: block;
  }

  .admin-sidebar {
    width: 260px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 40;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
    text-align: left;
  }

  .sidebar-logo:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }

  .nav-section {
    padding: 0 1rem;
    margin-bottom: 1.5rem;
  }

  .nav-section-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.5rem;
    padding: 0 0.75rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    background: none;
    border: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
    margin-bottom: 0.25rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
  }

  .nav-link svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .return-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-weight: 500;
  }

  .return-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .admin-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }

    .admin-sidebar.mobile-open {
      transform: translateX(0);
    }
  }
</style>
