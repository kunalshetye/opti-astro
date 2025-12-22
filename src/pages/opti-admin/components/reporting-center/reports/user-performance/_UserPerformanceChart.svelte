<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  interface UserMetrics {
    user: string;
    itemsCreated: number;
    itemsModified: number;
    totalActivity: number;
    contentTypeBreakdown: Map<string, number>;
    mostRecentActivity: string;
    locales: Set<string>;
    createdDates: Date[];
    modifiedDates: Date[];
  }

  interface Props {
    metrics: UserMetrics[];
    timeRangeDays: number;
  }

  let { metrics, timeRangeDays }: Props = $props();

  // Canvas elements
  let topUsersCanvasEl: HTMLCanvasElement;
  let activityBreakdownCanvasEl: HTMLCanvasElement;
  let activityTrendCanvasEl: HTMLCanvasElement;
  let contentTypeCanvasEl: HTMLCanvasElement;

  // Chart instances
  let topUsersChart: Chart | null = null;
  let activityBreakdownChart: Chart | null = null;
  let activityTrendChart: Chart | null = null;
  let contentTypeChart: Chart | null = null;

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
      topUsersChart?.destroy();
      activityBreakdownChart?.destroy();
      activityTrendChart?.destroy();
      contentTypeChart?.destroy();
    };
  });

  $effect(() => {
    if (topUsersChart && activityBreakdownChart && activityTrendChart && contentTypeChart) {
      updateCharts();
    }
  });

  function createCharts() {
    const topUsersData = getTopUsersData();
    const activityBreakdownData = getActivityBreakdownData();
    const activityTrendData = getActivityTrendData();
    const contentTypeData = getContentTypeData();

    // Chart 1: Top Users by Total Activity (Bar)
    topUsersChart = new Chart(topUsersCanvasEl, {
      type: 'bar',
      data: {
        labels: topUsersData.labels,
        datasets: [{
          label: 'Total Activity',
          data: topUsersData.values,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
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
            text: 'Top 10 Users by Total Activity',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const user = topUsersData.users[idx];
                return [
                  `Total Activity: ${user.totalActivity}`,
                  `Created: ${user.itemsCreated}`,
                  `Modified: ${user.itemsModified}`
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

    // Chart 2: Creates vs Modifies (Stacked Bar)
    activityBreakdownChart = new Chart(activityBreakdownCanvasEl, {
      type: 'bar',
      data: {
        labels: activityBreakdownData.labels,
        datasets: [
          {
            label: 'Created',
            data: activityBreakdownData.created,
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1
          },
          {
            label: 'Modified',
            data: activityBreakdownData.modified,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Creates vs Modifies - Top 10 Users',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });

    // Chart 3: Daily Activity Trend (Line)
    activityTrendChart = new Chart(activityTrendCanvasEl, {
      type: 'line',
      data: {
        labels: activityTrendData.labels,
        datasets: [{
          label: 'Activity',
          data: activityTrendData.values,
          borderColor: 'rgba(168, 85, 247, 1)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Daily Activity Trend',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Items Created/Modified'
            },
            ticks: { stepSize: 1 }
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

    // Chart 4: Content Type Distribution (Doughnut)
    contentTypeChart = new Chart(contentTypeCanvasEl, {
      type: 'doughnut',
      data: {
        labels: contentTypeData.labels,
        datasets: [{
          data: contentTypeData.values,
          backgroundColor: CHART_COLORS.slice(0, contentTypeData.labels.length),
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
            text: 'Content Type Distribution',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  function updateCharts() {
    const topUsersData = getTopUsersData();
    const activityBreakdownData = getActivityBreakdownData();
    const activityTrendData = getActivityTrendData();
    const contentTypeData = getContentTypeData();

    if (topUsersChart) {
      topUsersChart.data.labels = topUsersData.labels;
      topUsersChart.data.datasets[0].data = topUsersData.values;
      topUsersChart.update();
    }

    if (activityBreakdownChart) {
      activityBreakdownChart.data.labels = activityBreakdownData.labels;
      activityBreakdownChart.data.datasets[0].data = activityBreakdownData.created;
      activityBreakdownChart.data.datasets[1].data = activityBreakdownData.modified;
      activityBreakdownChart.update();
    }

    if (activityTrendChart) {
      activityTrendChart.data.labels = activityTrendData.labels;
      activityTrendChart.data.datasets[0].data = activityTrendData.values;
      activityTrendChart.update();
    }

    if (contentTypeChart) {
      contentTypeChart.data.labels = contentTypeData.labels;
      contentTypeChart.data.datasets[0].data = contentTypeData.values;
      contentTypeChart.update();
    }
  }

  function getTopUsersData() {
    const topUsers = [...metrics]
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 10);

    return {
      labels: topUsers.map(u => u.user),
      values: topUsers.map(u => u.totalActivity),
      users: topUsers
    };
  }

  function getActivityBreakdownData() {
    const topUsers = [...metrics]
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 10);

    return {
      labels: topUsers.map(u => u.user),
      created: topUsers.map(u => u.itemsCreated),
      modified: topUsers.map(u => u.itemsModified)
    };
  }

  function getActivityTrendData() {
    // Collect all activity dates
    const allDates: Date[] = [];
    metrics.forEach(user => {
      allDates.push(...user.createdDates);
      allDates.push(...user.modifiedDates);
    });

    if (allDates.length === 0) {
      return { labels: [], values: [] };
    }

    // Calculate date range
    const now = new Date();
    const startDate = new Date(now.getTime() - (timeRangeDays * 24 * 60 * 60 * 1000));

    // Create daily buckets
    const dailyActivity = new Map<string, number>();

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dailyActivity.set(dateKey, 0);
    }

    // Count activity per day
    allDates.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      if (dailyActivity.has(dateKey)) {
        dailyActivity.set(dateKey, dailyActivity.get(dateKey)! + 1);
      }
    });

    // Convert to arrays
    const labels: string[] = [];
    const values: number[] = [];

    Array.from(dailyActivity.keys()).sort().forEach(dateKey => {
      const date = new Date(dateKey);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(dailyActivity.get(dateKey)!);
    });

    return { labels, values };
  }

  function getContentTypeData() {
    // Aggregate content type counts across all users
    const contentTypeCounts = new Map<string, number>();

    metrics.forEach(user => {
      user.contentTypeBreakdown.forEach((count, type) => {
        contentTypeCounts.set(type, (contentTypeCounts.get(type) || 0) + count);
      });
    });

    // Sort and get top types
    const sortedTypes = Array.from(contentTypeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedTypes.map(([type]) => type),
      values: sortedTypes.map(([, count]) => count)
    };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-6">User Performance Analytics</h3>

  {#if metrics.length === 0}
    <div class="text-center text-gray-500 p-8">
      No user activity data available for the selected period.
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Top Users Bar Chart -->
      <div class="h-80">
        <canvas bind:this={topUsersCanvasEl}></canvas>
      </div>

      <!-- Activity Breakdown Stacked Bar Chart -->
      <div class="h-80">
        <canvas bind:this={activityBreakdownCanvasEl}></canvas>
      </div>

      <!-- Daily Activity Trend Line Chart -->
      <div class="h-80 md:col-span-2">
        <canvas bind:this={activityTrendCanvasEl}></canvas>
      </div>

      <!-- Content Type Distribution Doughnut Chart -->
      <div class="h-80 md:col-span-2">
        <canvas bind:this={contentTypeCanvasEl}></canvas>
      </div>
    </div>
  {/if}
</div>
