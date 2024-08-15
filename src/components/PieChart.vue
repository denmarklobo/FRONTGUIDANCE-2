<template>
  <div>
    <div style="position: relative; height: 50vh; width: 100%;">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: 'PieChart',
  components: {
    Pie
  },
  data() {
    return {
      violationsPerYear: [
        { grade_year: 'Elementary', violations: 10 },
        { grade_year: 'Middle School', violations: 15 },
        { grade_year: 'High School', violations: 20 }
      ]
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.violationsPerYear.map(item => item.grade_year),
        datasets: [
          {
            label: 'Violations',
            data: this.violationsPerYear.map(item => item.violations),
            backgroundColor: ['#f87979', '#7CBB00', '#0099CC'],
            // hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Violations per Grade Year'
          }
        }
      };
    }
  }
};
</script>

<style scoped>
</style>
