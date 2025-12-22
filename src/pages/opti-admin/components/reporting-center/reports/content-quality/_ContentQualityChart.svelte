<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { PageQualityMetrics } from './_ScoreCalculator';

  interface QualityAggregation {
    scoreRanges: {
      poor: number;
      fair: number;
      good: number;
      excellent: number;
    };
    byContentType: Map<string, {
      totalPages: number;
      avgScore: number;
      scoreDistribution: { poor: number; fair: number; good: number; excellent: number };
    }>;
    byLocale: Map<string, {
      totalPages: number;
      avgScore: number;
      scoreDistribution: { poor: number; fair: number; good: number; excellent: number };
    }>;
    topIssues: Array<{
      issue: string;
      count: number;
      percentage: number;
    }>;
    avgScoreByCategory: {
      seo: number;
      content: number;
      accessibility: number;
      freshness: number;
      publication: number;
    };
  }

  interface Props {
    metrics: PageQualityMetrics[];
    aggregation: QualityAggregation;
  }

  let { metrics, aggregation }: Props = $props();

  // Canvas elements
  let distributionCanvasEl: HTMLCanvasElement;
  let dimensionsCanvasEl: HTMLCanvasElement;
  let contentTypeCanvasEl: HTMLCanvasElement;
  let issuesCanvasEl: HTMLCanvasElement;
  let localeCanvasEl: HTMLCanvasElement;

  // Chart instances
  let distributionChart: Chart | null = null;
  let dimensionsChart: Chart | null = null;
  let contentTypeChart: Chart | null = null;
  let issuesChart: Chart | null = null;
  let localeChart: Chart | null = null;

  onMount(() => {
    Chart.register(...registerables);
    createCharts();

    return () => {
      distributionChart?.destroy();
      dimensionsChart?.destroy();
      contentTypeChart?.destroy();
      issuesChart?.destroy();
      localeChart?.destroy();
    };
  });

  $effect(() => {
    if (distributionChart && dimensionsChart && contentTypeChart && issuesChart && localeChart) {
      updateCharts();
    }
  });

  function createCharts() {
    const distributionData = getDistributionData();
    const dimensionsData = getDimensionsData();
    const contentTypeData = getContentTypeData();
    const issuesData = getIssuesData();
    const localeData = getLocaleData();

    // Chart 1: Score Distribution (Doughnut)
    distributionChart = new Chart(distributionCanvasEl, {
      type: 'doughnut',
      data: {
        labels: distributionData.labels,
        datasets: [{
          data: distributionData.values,
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Red - Poor
            'rgba(251, 146, 60, 0.8)',  // Orange - Fair
            'rgba(250, 204, 21, 0.8)',  // Yellow - Good
            'rgba(34, 197, 94, 0.8)'    // Green - Excellent
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
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                return data.labels!.map((label, i) => {
                  const value = data.datasets[0].data[i] as number;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
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
            text: 'Content Quality Distribution',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });

    // Chart 2: Quality Dimensions (Radar)
    dimensionsChart = new Chart(dimensionsCanvasEl, {
      type: 'radar',
      data: {
        labels: dimensionsData.labels,
        datasets: [{
          label: 'Average Score',
          data: dimensionsData.values,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
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
            text: 'Quality Dimensions - Overall Performance',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });

    // Chart 3: Quality by Content Type (Horizontal Bar)
    contentTypeChart = new Chart(contentTypeCanvasEl, {
      type: 'bar',
      data: {
        labels: contentTypeData.labels,
        datasets: [{
          label: 'Average Quality Score',
          data: contentTypeData.values,
          backgroundColor: contentTypeData.values.map(v => getColorByScore(v)),
          borderColor: contentTypeData.values.map(v => getColorByScore(v, 1)),
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
            text: 'Average Quality Score by Content Type',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const type = contentTypeData.types[idx];
                return [
                  `Avg Score: ${context.parsed.x.toFixed(1)}`,
                  `Pages: ${type.count}`
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
              text: 'Quality Score'
            }
          }
        }
      }
    });

    // Chart 4: Top 10 Quality Issues (Horizontal Bar)
    issuesChart = new Chart(issuesCanvasEl, {
      type: 'bar',
      data: {
        labels: issuesData.labels,
        datasets: [{
          label: 'Pages Affected',
          data: issuesData.values,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
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
            text: 'Top 10 Quality Issues to Address',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const issue = issuesData.issues[idx];
                return [
                  `Pages Affected: ${issue.count}`,
                  `Percentage: ${issue.percentage.toFixed(1)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Number of Pages'
            }
          }
        }
      }
    });

    // Chart 5: Quality by Locale (Stacked Bar)
    localeChart = new Chart(localeCanvasEl, {
      type: 'bar',
      data: {
        labels: localeData.labels,
        datasets: [
          {
            label: 'Excellent (76-100)',
            data: localeData.excellent,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 0
          },
          {
            label: 'Good (51-75)',
            data: localeData.good,
            backgroundColor: 'rgba(250, 204, 21, 0.8)',
            borderWidth: 0
          },
          {
            label: 'Fair (26-50)',
            data: localeData.fair,
            backgroundColor: 'rgba(251, 146, 60, 0.8)',
            borderWidth: 0
          },
          {
            label: 'Poor (0-25)',
            data: localeData.poor,
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
            text: 'Quality Distribution by Locale',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Locale'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Number of Pages'
            }
          }
        }
      }
    });
  }

  function updateCharts() {
    const distributionData = getDistributionData();
    const dimensionsData = getDimensionsData();
    const contentTypeData = getContentTypeData();
    const issuesData = getIssuesData();
    const localeData = getLocaleData();

    if (distributionChart) {
      distributionChart.data.labels = distributionData.labels;
      distributionChart.data.datasets[0].data = distributionData.values;
      distributionChart.update();
    }

    if (dimensionsChart) {
      dimensionsChart.data.labels = dimensionsData.labels;
      dimensionsChart.data.datasets[0].data = dimensionsData.values;
      dimensionsChart.update();
    }

    if (contentTypeChart) {
      contentTypeChart.data.labels = contentTypeData.labels;
      contentTypeChart.data.datasets[0].data = contentTypeData.values;
      contentTypeChart.data.datasets[0].backgroundColor = contentTypeData.values.map(v => getColorByScore(v));
      contentTypeChart.data.datasets[0].borderColor = contentTypeData.values.map(v => getColorByScore(v, 1));
      contentTypeChart.update();
    }

    if (issuesChart) {
      issuesChart.data.labels = issuesData.labels;
      issuesChart.data.datasets[0].data = issuesData.values;
      issuesChart.update();
    }

    if (localeChart) {
      localeChart.data.labels = localeData.labels;
      localeChart.data.datasets[0].data = localeData.excellent;
      localeChart.data.datasets[1].data = localeData.good;
      localeChart.data.datasets[2].data = localeData.fair;
      localeChart.data.datasets[3].data = localeData.poor;
      localeChart.update();
    }
  }

  function getColorByScore(score: number, opacity: number = 0.6): string {
    if (score >= 76) return `rgba(34, 197, 94, ${opacity})`; // Green
    if (score >= 51) return `rgba(250, 204, 21, ${opacity})`; // Yellow
    if (score >= 26) return `rgba(251, 146, 60, ${opacity})`; // Orange
    return `rgba(239, 68, 68, ${opacity})`; // Red
  }

  function getDistributionData() {
    return {
      labels: ['Poor (0-25)', 'Fair (26-50)', 'Good (51-75)', 'Excellent (76-100)'],
      values: [
        aggregation.scoreRanges.poor,
        aggregation.scoreRanges.fair,
        aggregation.scoreRanges.good,
        aggregation.scoreRanges.excellent
      ]
    };
  }

  function getDimensionsData() {
    return {
      labels: ['SEO (/40)', 'Content (/30)', 'Accessibility (/10)', 'Freshness (/10)', 'Publication (/10)'],
      values: [
        (aggregation.avgScoreByCategory.seo / 40) * 100,
        (aggregation.avgScoreByCategory.content / 30) * 100,
        (aggregation.avgScoreByCategory.accessibility / 10) * 100,
        (aggregation.avgScoreByCategory.freshness / 10) * 100,
        (aggregation.avgScoreByCategory.publication / 10) * 100
      ]
    };
  }

  function getContentTypeData() {
    const types = Array.from(aggregation.byContentType.entries())
      .sort((a, b) => b[1].avgScore - a[1].avgScore);

    return {
      labels: types.map(([name]) => name),
      values: types.map(([, data]) => data.avgScore),
      types: types.map(([, data]) => ({ count: data.totalPages }))
    };
  }

  function getIssuesData() {
    const issues = aggregation.topIssues.slice(0, 10);

    return {
      labels: issues.map(i => i.issue),
      values: issues.map(i => i.count),
      issues: issues
    };
  }

  function getLocaleData() {
    const locales = Array.from(aggregation.byLocale.entries())
      .sort((a, b) => b[1].totalPages - a[1].totalPages);

    return {
      labels: locales.map(([name]) => name),
      excellent: locales.map(([, data]) => data.scoreDistribution.excellent),
      good: locales.map(([, data]) => data.scoreDistribution.good),
      fair: locales.map(([, data]) => data.scoreDistribution.fair),
      poor: locales.map(([, data]) => data.scoreDistribution.poor)
    };
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-6">Content Quality Analytics</h3>

  {#if metrics.length === 0}
    <div class="text-center text-gray-500 p-8">
      No content data available for quality analysis.
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Score Distribution Doughnut Chart -->
      <div class="h-80">
        <canvas bind:this={distributionCanvasEl}></canvas>
      </div>

      <!-- Quality Dimensions Radar Chart -->
      <div class="h-80">
        <canvas bind:this={dimensionsCanvasEl}></canvas>
      </div>

      <!-- Quality by Content Type Horizontal Bar Chart -->
      <div class="h-80">
        <canvas bind:this={contentTypeCanvasEl}></canvas>
      </div>

      <!-- Top 10 Quality Issues Horizontal Bar Chart -->
      <div class="h-80">
        <canvas bind:this={issuesCanvasEl}></canvas>
      </div>

      <!-- Quality by Locale Stacked Bar Chart -->
      <div class="h-80 md:col-span-2">
        <canvas bind:this={localeCanvasEl}></canvas>
      </div>
    </div>
  {/if}
</div>
