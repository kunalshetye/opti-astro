<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface UnpublishedPage {
    id: string;
    title: string;
    url: string;
    created: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
  }

  interface Props {
    pages: UnpublishedPage[];
  }

  let { pages }: Props = $props();

  let timelineCanvasEl: HTMLCanvasElement;
  let localeCanvasEl: HTMLCanvasElement;
  let contentTypeCanvasEl: HTMLCanvasElement;

  let timelineChart: Chart | null = null;
  let localeChart: Chart | null = null;
  let contentTypeChart: Chart | null = null;

  // Register Chart.js components
  onMount(() => {
    Chart.register(...registerables);
    createCharts();

    return () => {
      // Cleanup charts on unmount
      timelineChart?.destroy();
      localeChart?.destroy();
      contentTypeChart?.destroy();
    };
  });

  // Update charts when pages change
  $effect(() => {
    if (timelineChart && localeChart && contentTypeChart) {
      updateCharts();
    }
  });

  function createCharts() {
    // Timeline Chart - Pages per day
    const timelineData = getTimelineData();
    timelineChart = new Chart(timelineCanvasEl, {
      type: 'bar',
      data: {
        labels: timelineData.labels,
        datasets: [{
          label: 'Drafts Created',
          data: timelineData.data,
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderColor: 'rgba(102, 126, 234, 1)',
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
            text: 'Draft Creation Activity Over Time',
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
            text: 'Pages by Locale',
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
            text: 'Pages by Content Type',
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
    // Update timeline chart
    const timelineData = getTimelineData();
    if (timelineChart) {
      timelineChart.data.labels = timelineData.labels;
      timelineChart.data.datasets[0].data = timelineData.data;
      timelineChart.update();
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

  function getTimelineData() {
    // Group pages by date
    const dateMap = new Map<string, number>();

    pages.forEach(page => {
      if (page.created) {
        const date = new Date(page.created);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      }
    });

    // Sort by date
    const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      labels: sortedEntries.map(([date]) => date),
      data: sortedEntries.map(([, count]) => count)
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
  <h3 class="text-lg font-semibold text-gray-900 mb-6">Draft Pages Analytics</h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Timeline Chart -->
    <div class="h-64">
      <canvas bind:this={timelineCanvasEl}></canvas>
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
