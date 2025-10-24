<script lang="ts">
  let { title, color = 'blue' }: {
    title: string;
    color?: 'blue' | 'yellow' | 'green';
  } = $props();

  let isOpen = $state(false);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      hoverBg: 'hover:bg-blue-100',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      badgeColor: 'text-blue-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      hoverBg: 'hover:bg-yellow-100',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      badgeColor: 'text-yellow-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      hoverBg: 'hover:bg-green-100',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      badgeColor: 'text-green-600'
    }
  };

  let colors = $derived(colorClasses[color]);
</script>

<details bind:open={isOpen} class="{colors.bg} border-l-4 {colors.border} rounded group">
  <summary class="cursor-pointer p-4 {colors.hoverBg} transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold {colors.titleColor} inline-flex items-center">
        <svg class="w-5 h-5 mr-2 transform transition-transform {isOpen ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        {title}
      </h3>
      <span class="text-xs {colors.badgeColor} font-medium">Click to expand</span>
    </div>
  </summary>
  <div class="px-4 pb-4 text-sm {colors.textColor}">
    <slot />
  </div>
</details>
