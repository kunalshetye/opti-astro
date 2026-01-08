<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface ContentTranslation {
    key: string;
    defaultLocaleContent: {
      id: string;
      title: string;
      url: string;
      contentType: string;
      published: string;
      lastModified: string;
    };
    translations: Record<
      string,
      {
        id: string;
        title: string;
        url: string;
        published: string;
        lastModified: string;
      }
    >;
    missingLocales: string[];
    translationCompleteness: number;
    contentType: string;
  }

  interface Props {
    contentTranslations: ContentTranslation[];
    totalLocales: number;
  }

  let { contentTranslations, totalLocales }: Props = $props();

  let canvasEl: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    Chart.register(...registerables);
    createChart();
    return () => chart?.destroy();
  });

  $effect(() => {
    if (chart) updateChart();
  });

  function createChart() {
    const chartData = getChartData();

    chart = new Chart(canvasEl, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Translated',
            data: chartData.translated,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 0
          },
          {
            label: 'Missing',
            data: chartData.missing,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderWidth: 0
          }
        ]
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
            text: 'Top 20 Content Items by Missing Translations',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const item = chartData.items[idx];
                if (context.datasetIndex === 0) {
                  return `Translated: ${item.translatedCount} locales`;
                } else {
                  return `Missing: ${item.missingCount} locales`;
                }
              },
              afterLabel: (context) => {
                const idx = context.dataIndex;
                const item = chartData.items[idx];
                return `Completeness: ${item.completeness.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Content Item'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: totalLocales,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Number of Locales'
            }
          }
        }
      }
    });
  }

  function updateChart() {
    if (!chart) return;
    const chartData = getChartData();
    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.translated;
    chart.data.datasets[1].data = chartData.missing;
    chart.update();
  }

  function getChartData() {
    // Sort by missing count descending and take top 20
    const sorted = [...contentTranslations]
      .filter((item) => item.missingLocales.length > 0)
      .sort((a, b) => b.missingLocales.length - a.missingLocales.length)
      .slice(0, 20);

    const labels = sorted.map((item) => {
      const title = item.defaultLocaleContent.title;
      return title.length > 25 ? title.substring(0, 25) + '...' : title;
    });

    const translated = sorted.map(
      (item) => Object.keys(item.translations).length
    );

    const missing = sorted.map((item) => item.missingLocales.length);

    const items = sorted.map((item) => ({
      translatedCount: Object.keys(item.translations).length,
      missingCount: item.missingLocales.length,
      completeness: item.translationCompleteness
    }));

    return { labels, translated, missing, items };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  {#if contentTranslations.filter((item) => item.missingLocales.length > 0).length === 0}
    <div class="text-center text-gray-500 p-8">
      <svg
        class="w-16 h-16 mx-auto mb-4 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Perfect Translation Coverage!</h3>
      <p class="text-gray-600">All content is translated to all locales.</p>
    </div>
  {:else}
    <div class="h-96">
      <canvas bind:this={canvasEl}></canvas>
    </div>
  {/if}
</div>
