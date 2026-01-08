<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface LocaleMetrics {
    locale: string;
    totalContentInDefault: number;
    translatedContent: number;
    missingContent: number;
    completenessPercentage: number;
  }

  interface Props {
    localeMetrics: LocaleMetrics[];
  }

  let { localeMetrics }: Props = $props();

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
            label: 'Completeness %',
            data: chartData.values,
            backgroundColor: chartData.colors,
            borderColor: chartData.colors.map((c) => c.replace('0.7', '1')),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Translation Completeness by Locale',
            font: { size: 18, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const metrics = getSortedMetrics()[idx];
                return [
                  `Completeness: ${context.parsed.x.toFixed(1)}%`,
                  `Translated: ${metrics.translatedContent}/${metrics.totalContentInDefault}`,
                  `Missing: ${metrics.missingContent}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Completeness Percentage'
            }
          },
          y: {
            ticks: {
              autoSkip: false,
              font: {
                size: 12
              }
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
    chart.data.datasets[0].data = chartData.values;
    chart.data.datasets[0].backgroundColor = chartData.colors;
    chart.update();
  }

  function getSortedMetrics() {
    return [...localeMetrics].sort(
      (a, b) => b.completenessPercentage - a.completenessPercentage
    );
  }

  function getChartData() {
    const sorted = getSortedMetrics();

    return {
      labels: sorted.map((m) => m.locale.toUpperCase()),
      values: sorted.map((m) => m.completenessPercentage),
      colors: sorted.map((m) => getColorByCompleteness(m.completenessPercentage))
    };
  }

  function getColorByCompleteness(percentage: number): string {
    if (percentage >= 90) return 'rgba(34, 197, 94, 0.7)'; // Green
    if (percentage >= 70) return 'rgba(250, 204, 21, 0.7)'; // Yellow
    if (percentage >= 50) return 'rgba(251, 146, 60, 0.7)'; // Orange
    return 'rgba(239, 68, 68, 0.7)'; // Red
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  <div style="height: {Math.max(500, localeMetrics.length * 35)}px;">
    <canvas bind:this={canvasEl}></canvas>
  </div>

  <!-- Color Legend -->
  <div class="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-4 text-sm">
    <div class="font-semibold text-gray-700">Completeness Levels:</div>
    <div class="flex items-center gap-2">
      <div class="w-4 h-4 rounded" style="background-color: rgba(34, 197, 94, 0.7);"></div>
      <span class="text-gray-600">Excellent (≥90%)</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-4 h-4 rounded" style="background-color: rgba(250, 204, 21, 0.7);"></div>
      <span class="text-gray-600">Good (70-89%)</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-4 h-4 rounded" style="background-color: rgba(251, 146, 60, 0.7);"></div>
      <span class="text-gray-600">Fair (50-69%)</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-4 h-4 rounded" style="background-color: rgba(239, 68, 68, 0.7);"></div>
      <span class="text-gray-600">Poor (&lt;50%)</span>
    </div>
  </div>
</div>
