<script lang="ts">
  interface Props {
    size?: 'small' | 'large';
    message?: string;
  }

  let { size = 'small', message = 'Work in Progress' }: Props = $props();
</script>

{#if size === 'small'}
  <span class="wip-badge-small">WIP</span>
{:else}
  <div class="wip-banner">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="wip-icon">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>
    <div>
      <div class="wip-title">Work in Progress</div>
      <div class="wip-message">{message}</div>
    </div>
  </div>
{/if}

<style>
  /* Small badge for sidebar */
  .wip-badge-small {
    display: inline-block;
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    background-color: rgba(251, 191, 36, 0.2);
    color: rgb(251, 191, 36);
    border-radius: 0.25rem;
    margin-left: 0.5rem;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }

  /* Large banner for component pages */
  .wip-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .wip-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(245, 158, 11);
    flex-shrink: 0;
  }

  .wip-title {
    font-weight: 600;
    color: rgb(180, 83, 9);
    margin-bottom: 0.25rem;
  }

  .wip-message {
    font-size: 0.875rem;
    color: rgb(146, 64, 14);
  }
</style>
