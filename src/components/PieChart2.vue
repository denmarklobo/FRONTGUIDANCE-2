<template>
    <div class="pie-chart-container">
      <canvas ref="pieChartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);
  
  export default {
    name: 'PieChart2',
    props: ['data'],
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        new ChartJS(this.$refs.pieChartCanvas, {
          type: 'pie',
          data: this.data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return tooltipItem.label + ': ' + tooltipItem.raw;
                  },
                },
              },
            },
          },
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .pie-chart-container {
    width: 100%;
    height: 300px;
  }
  </style>
  