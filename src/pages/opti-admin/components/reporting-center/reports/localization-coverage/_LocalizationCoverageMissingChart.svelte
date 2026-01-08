<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface Props {
    missingByContentType: Array<{
      contentType: string;
      missingCount: number;
    }>;
  }

  let { missingByContentType }: Props = $props();

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
            label: 'Missing Translations',
            data: chartData.values,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Missing Translations by Content Type',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Missing Count'
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
    chart.update();
  }

  function getChartData() {
    // Sort by missing count descending
    const sorted = [...missingByContentType].sort((a, b) => b.missingCount - a.missingCount);

    return {
      labels: sorted.map((item) => item.contentType),
      values: sorted.map((item) => item.missingCount)
    };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
  <div class="h-80">
    <canvas bind:this={canvasEl}></canvas>
  </div>
</div>
