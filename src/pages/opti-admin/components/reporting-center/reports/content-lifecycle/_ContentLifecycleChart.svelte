<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface ContentPage {
    id: string;
    title: string;
    url: string;
    published: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
    daysSinceUpdate: number;
  }

  interface Props {
    pages: ContentPage[];
  }

  let { pages }: Props = $props();

  let inactivityCanvasEl: HTMLCanvasElement;
  let localeCanvasEl: HTMLCanvasElement;
  let contentTypeCanvasEl: HTMLCanvasElement;

  let inactivityChart: Chart | null = null;
  let localeChart: Chart | null = null;
  let contentTypeChart: Chart | null = null;

  // Register Chart.js components
  onMount(() => {
    Chart.register(...registerables);
    createCharts();

    return () => {
      inactivityChart?.destroy();
      localeChart?.destroy();
      contentTypeChart?.destroy();
    };
  });

  // Update charts when pages change
  $effect(() => {
    if (inactivityChart && localeChart && contentTypeChart) {
      updateCharts();
    }
  });

  function createCharts() {
    // Inactivity Distribution Chart
    const inactivityData = getInactivityDistribution();
    inactivityChart = new Chart(inactivityCanvasEl, {
      type: 'bar',
      data: {
        labels: inactivityData.labels,
        datasets: [{
          label: 'Pages',
          data: inactivityData.data,
          backgroundColor: [
            'rgba(250, 204, 21, 0.6)',   // yellow - < 90 days
            'rgba(251, 146, 60, 0.6)',   // orange - 90-180 days
            'rgba(239, 68, 68, 0.6)',    // red - 180-365 days
            'rgba(153, 27, 27, 0.6)'     // dark red - > 365 days
          ],
          borderColor: [
            'rgba(250, 204, 21, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(153, 27, 27, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Content Inactivity Distribution',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    // Locale Distribution Chart
    const localeData = getLocaleData();
    localeChart = new Chart(localeCanvasEl, {
      type: 'doughnut',
      data: {
        labels: localeData.labels,
        datasets: [{
          data: localeData.data,
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(237, 100, 166, 0.8)',
            'rgba(255, 154, 158, 0.8)',
            'rgba(250, 208, 196, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(96, 165, 250, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Stale Content by Locale',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    });

    // Content Type Chart
    const contentTypeData = getContentTypeData();
    contentTypeChart = new Chart(contentTypeCanvasEl, {
      type: 'bar',
      data: {
        labels: contentTypeData.labels,
        datasets: [{
          label: 'Pages',
          data: contentTypeData.data,
          backgroundColor: 'rgba(118, 75, 162, 0.6)',
          borderColor: 'rgba(118, 75, 162, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Stale Content by Type',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  function updateCharts() {
    // Update inactivity chart
    const inactivityData = getInactivityDistribution();
    if (inactivityChart) {
      inactivityChart.data.labels = inactivityData.labels;
      inactivityChart.data.datasets[0].data = inactivityData.data;
      inactivityChart.update();
    }

    // Update locale chart
    const localeData = getLocaleData();
    if (localeChart) {
      localeChart.data.labels = localeData.labels;
      localeChart.data.datasets[0].data = localeData.data;
      localeChart.update();
    }

    // Update content type chart
    const contentTypeData = getContentTypeData();
    if (contentTypeChart) {
      contentTypeChart.data.labels = contentTypeData.labels;
      contentTypeChart.data.datasets[0].data = contentTypeData.data;
      contentTypeChart.update();
    }
  }

  function getInactivityDistribution() {
    // Group pages by inactivity ranges
    const ranges = {
      '< 90 days': 0,
      '90-180 days': 0,
      '180-365 days': 0,
      '> 365 days': 0
    };

    pages.forEach(page => {
      if (page.daysSinceUpdate < 90) {
        ranges['< 90 days']++;
      } else if (page.daysSinceUpdate < 180) {
        ranges['90-180 days']++;
      } else if (page.daysSinceUpdate < 365) {
        ranges['180-365 days']++;
      } else {
        ranges['> 365 days']++;
      }
    });

    return {
      labels: Object.keys(ranges),
      data: Object.values(ranges)
    };
  }

  function getLocaleData() {
    // Count pages by locale
    const localeMap = new Map<string, number>();

    pages.forEach(page => {
      const locale = page.locale || 'Unknown';
      localeMap.set(locale, (localeMap.get(locale) || 0) + 1);
    });

    // Sort by count descending
    const sortedEntries = Array.from(localeMap.entries()).sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedEntries.map(([locale]) => locale),
      data: sortedEntries.map(([, count]) => count)
    };
  }

  function getContentTypeData() {
    // Count pages by content type
    const typeMap = new Map<string, number>();

    pages.forEach(page => {
      page.contentType.forEach(type => {
        // Remove namespace prefixes for cleaner display
        const cleanType = type.split('.').pop() || type;
        typeMap.set(cleanType, (typeMap.get(cleanType) || 0) + 1);
      });
    });

    // Sort by count descending
    const sortedEntries = Array.from(typeMap.entries()).sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedEntries.map(([type]) => type),
      data: sortedEntries.map(([, count]) => count)
    };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-6">Content Lifecycle Analytics</h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Inactivity Distribution Chart -->
    <div class="h-64">
      <canvas bind:this={inactivityCanvasEl}></canvas>
    </div>

    <!-- Locale Chart -->
    <div class="h-64">
      <canvas bind:this={localeCanvasEl}></canvas>
    </div>

    <!-- Content Type Chart -->
    <div class="h-64 md:col-span-2">
      <canvas bind:this={contentTypeCanvasEl}></canvas>
    </div>
  </div>
</div>
