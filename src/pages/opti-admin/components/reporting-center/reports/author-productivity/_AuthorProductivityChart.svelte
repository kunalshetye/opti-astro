<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface AuthorMetrics {
    author: string;
    totalPages: number;
    avgTimeToPublish: number;
    contentTypeBreakdown: Map<string, number>;
    pagesPerWeek: number;
    pagesPerMonth: number;
    mostRecentPublication: string;
    publicationDates: Date[];
    locales: Set<string>;
  }

  interface Props {
    metrics: AuthorMetrics[];
    timeRangeDays: number;
    velocityInterval: 'week' | 'month';
  }

  let { metrics, timeRangeDays, velocityInterval }: Props = $props();

  // Canvas elements
  let topAuthorsCanvasEl: HTMLCanvasElement;
  let distributionCanvasEl: HTMLCanvasElement;
  let velocityCanvasEl: HTMLCanvasElement;
  let timeToPublishCanvasEl: HTMLCanvasElement;

  // Chart instances
  let topAuthorsChart: Chart | null = null;
  let distributionChart: Chart | null = null;
  let velocityChart: Chart | null = null;
  let timeToPublishChart: Chart | null = null;

  const CHART_COLORS = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(34, 197, 94, 0.8)',    // green
    'rgba(251, 146, 60, 0.8)',   // orange
    'rgba(168, 85, 247, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(20, 184, 166, 0.8)',   // teal
    'rgba(245, 158, 11, 0.8)',   // amber
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(99, 102, 241, 0.8)',   // indigo
    'rgba(132, 204, 22, 0.8)',   // lime
  ];

  onMount(() => {
    Chart.register(...registerables);
    createCharts();

    return () => {
      topAuthorsChart?.destroy();
      distributionChart?.destroy();
      velocityChart?.destroy();
      timeToPublishChart?.destroy();
    };
  });

  $effect(() => {
    if (topAuthorsChart && distributionChart && velocityChart && timeToPublishChart) {
      updateCharts();
    }
  });

  function createCharts() {
    const topAuthorsData = getTopAuthorsData();
    const distributionData = getDistributionData();
    const velocityData = getVelocityData();
    const timeToPublishData = getTimeToPublishData();

    // Chart 1: Top Authors (Horizontal Bar)
    topAuthorsChart = new Chart(topAuthorsCanvasEl, {
      type: 'bar',
      data: {
        labels: topAuthorsData.labels,
        datasets: [{
          label: 'Pages Published',
          data: topAuthorsData.values,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top 10 Authors by Publication Count',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const author = topAuthorsData.authors[idx];
                return [
                  `Pages: ${author.totalPages}`,
                  `Avg Time to Publish: ${author.avgTimeToPublish.toFixed(1)} days`,
                  `Pages/Month: ${author.pagesPerMonth.toFixed(1)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

    // Chart 2: Content Distribution (Doughnut)
    distributionChart = new Chart(distributionCanvasEl, {
      type: 'doughnut',
      data: {
        labels: distributionData.labels,
        datasets: [{
          data: distributionData.values,
          backgroundColor: CHART_COLORS.slice(0, distributionData.labels.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                return data.labels!.map((label, i) => {
                  const value = data.datasets[0].data[i] as number;
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor![i] as string,
                    hidden: false,
                    index: i
                  };
                });
              }
            }
          },
          title: {
            display: true,
            text: 'Content Distribution by Top 5 Authors',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });

    // Chart 3: Publishing Velocity (Line)
    velocityChart = new Chart(velocityCanvasEl, {
      type: 'line',
      data: {
        labels: velocityData.labels,
        datasets: velocityData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: `Publishing Velocity - Top 5 Authors (${velocityInterval === 'week' ? 'Weekly' : 'Monthly'})`,
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Pages Published'
            },
            ticks: { stepSize: 1 }
          },
          x: {
            title: {
              display: true,
              text: 'Time Period'
            }
          }
        }
      }
    });

    // Chart 4: Average Time to Publish (Bar)
    timeToPublishChart = new Chart(timeToPublishCanvasEl, {
      type: 'bar',
      data: {
        labels: timeToPublishData.labels,
        datasets: [{
          label: 'Days',
          data: timeToPublishData.values,
          backgroundColor: 'rgba(168, 85, 247, 0.6)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Average Time to Publish by Author (Top 10)',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Days from Creation to Publication'
            }
          }
        }
      }
    });
  }

  function updateCharts() {
    const topAuthorsData = getTopAuthorsData();
    const distributionData = getDistributionData();
    const velocityData = getVelocityData();
    const timeToPublishData = getTimeToPublishData();

    if (topAuthorsChart) {
      topAuthorsChart.data.labels = topAuthorsData.labels;
      topAuthorsChart.data.datasets[0].data = topAuthorsData.values;
      topAuthorsChart.update();
    }

    if (distributionChart) {
      distributionChart.data.labels = distributionData.labels;
      distributionChart.data.datasets[0].data = distributionData.values;
      distributionChart.update();
    }

    if (velocityChart) {
      velocityChart.data.labels = velocityData.labels;
      velocityChart.data.datasets = velocityData.datasets;
      velocityChart.options!.plugins!.title!.text = `Publishing Velocity - Top 5 Authors (${velocityInterval === 'week' ? 'Weekly' : 'Monthly'})`;
      velocityChart.update();
    }

    if (timeToPublishChart) {
      timeToPublishChart.data.labels = timeToPublishData.labels;
      timeToPublishChart.data.datasets[0].data = timeToPublishData.values;
      timeToPublishChart.update();
    }
  }

  function getTopAuthorsData() {
    const topAuthors = [...metrics]
      .sort((a, b) => b.totalPages - a.totalPages)
      .slice(0, 10);

    return {
      labels: topAuthors.map(a => a.author),
      values: topAuthors.map(a => a.totalPages),
      authors: topAuthors
    };
  }

  function getDistributionData() {
    const topAuthors = [...metrics]
      .sort((a, b) => b.totalPages - a.totalPages)
      .slice(0, 5);

    return {
      labels: topAuthors.map(a => a.author),
      values: topAuthors.map(a => a.totalPages)
    };
  }

  function getVelocityData() {
    const topAuthors = [...metrics]
      .sort((a, b) => b.totalPages - a.totalPages)
      .slice(0, 5);

    const intervalDays = velocityInterval === 'week' ? 7 : 30;
    const numIntervals = Math.ceil(timeRangeDays / intervalDays);

    const now = new Date();
    const startDate = new Date(now.getTime() - (timeRangeDays * 24 * 60 * 60 * 1000));

    // Generate labels
    const labels: string[] = [];
    for (let i = 0; i < numIntervals; i++) {
      if (velocityInterval === 'week') {
        labels.push(`Week ${i + 1}`);
      } else {
        labels.push(`Month ${i + 1}`);
      }
    }

    // Generate datasets
    const datasets = topAuthors.map((author, idx) => {
      const velocityData = calculateVelocityData(author, numIntervals, intervalDays, startDate);
      return {
        label: author.author,
        data: velocityData,
        borderColor: CHART_COLORS[idx % CHART_COLORS.length],
        backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] + '33',
        tension: 0.3,
        fill: false
      };
    });

    return {
      labels,
      datasets
    };
  }

  function calculateVelocityData(
    author: AuthorMetrics,
    numIntervals: number,
    intervalDays: number,
    startDate: Date
  ): number[] {
    const velocityData = new Array(numIntervals).fill(0);

    author.publicationDates.forEach(pubDate => {
      const daysSinceStart = Math.floor(
        (pubDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const intervalIndex = Math.floor(daysSinceStart / intervalDays);

      if (intervalIndex >= 0 && intervalIndex < numIntervals) {
        velocityData[intervalIndex]++;
      }
    });

    return velocityData;
  }

  function getTimeToPublishData() {
    const authorsWithTimeData = [...metrics]
      .filter(a => a.avgTimeToPublish > 0)
      .sort((a, b) => a.avgTimeToPublish - b.avgTimeToPublish)
      .slice(0, 10);

    return {
      labels: authorsWithTimeData.map(a => a.author),
      values: authorsWithTimeData.map(a => a.avgTimeToPublish)
    };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-6">Author Productivity Analytics</h3>

  {#if metrics.length === 0}
    <div class="text-center text-gray-500 p-8">
      No author data available for the selected period.
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Top Authors Bar Chart -->
      <div class="h-80">
        <canvas bind:this={topAuthorsCanvasEl}></canvas>
      </div>

      <!-- Distribution Doughnut Chart -->
      <div class="h-80">
        <canvas bind:this={distributionCanvasEl}></canvas>
      </div>

      <!-- Publishing Velocity Line Chart -->
      <div class="h-80 md:col-span-2">
        <canvas bind:this={velocityCanvasEl}></canvas>
      </div>

      <!-- Time to Publish Bar Chart -->
      <div class="h-80 md:col-span-2">
        <canvas bind:this={timeToPublishCanvasEl}></canvas>
      </div>
    </div>
  {/if}
</div>
