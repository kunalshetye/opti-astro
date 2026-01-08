<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface TimeSeriesData {
    locale: string;
    dataPoints: Array<{
      date: string;
      publicationCount: number;
    }>;
  }

  interface Props {
    timeSeriesData: TimeSeriesData[];
  }

  let { timeSeriesData }: Props = $props();

  let canvasEl: HTMLCanvasElement;
  let chart: Chart | null = null;

  // Color palette for locales
  const colors = [
    'rgba(59, 130, 246, 1)', // Blue
    'rgba(239, 68, 68, 1)', // Red
    'rgba(34, 197, 94, 1)', // Green
    'rgba(251, 146, 60, 1)', // Orange
    'rgba(168, 85, 247, 1)', // Purple
    'rgba(250, 204, 21, 1)', // Yellow
    'rgba(236, 72, 153, 1)', // Pink
    'rgba(20, 184, 166, 1)' // Teal
  ];

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
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Translation Publications - Last 90 Days',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Publications'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
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
    chart.data.datasets = chartData.datasets;
    chart.update();
  }

  function getChartData() {
    // Get all unique dates across all locales
    const allDates = new Set<string>();
    timeSeriesData.forEach((series) => {
      series.dataPoints.forEach((dp) => allDates.add(dp.date));
    });
    const sortedDates = Array.from(allDates).sort();

    // Filter to only include locales with data
    const activeLocales = timeSeriesData.filter(
      (series) => series.dataPoints.length > 0
    );

    // Create datasets for each locale
    const datasets = activeLocales.map((series, idx) => {
      // Create data array with 0 for missing dates
      const data = sortedDates.map((date) => {
        const dataPoint = series.dataPoints.find((dp) => dp.date === date);
        return dataPoint ? dataPoint.publicationCount : 0;
      });

      const color = colors[idx % colors.length];

      return {
        label: series.locale.toUpperCase(),
        data,
        borderColor: color,
        backgroundColor: color.replace('1)', '0.1)'),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5
      };
    });

    // Format dates for display
    const labels = sortedDates.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return { labels, datasets };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
  <div class="h-80">
    <canvas bind:this={canvasEl}></canvas>
  </div>
</div>
