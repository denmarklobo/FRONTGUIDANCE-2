<template>
  <div class="chartdes">
    <Bar
      :chart-id="'bar-chart'"
      :dataset-id="'bar-dataset'"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import axios from 'axios';
import {  
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = ref({
  labels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
  datasets: [
    {
      label: 'Total',
      backgroundColor: '#42A5F5',
      data: [],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100, // Set maximum value for y-axis
    },
  },
});

onMounted(async () => {
  try {
    // Make the API request to fetch violations per grade
    const responseJHS = await axios.get('http://127.0.0.1:8000/api/cons/jhs');
    const fetchedData = responseJHS.data.data;
    console.log("Fetched data:", fetchedData);

    // Arrays to store data for the chart
    const totalData = [];
    // Grades to process
    const grades = ['7', '8', '9', '10'];

    // Loop through each grade and extract the relevant data
    grades.forEach(grade => {
      totalData.push(fetchedData[grade]?.total || 0);
    });

    console.log("Total data:", totalData);

    // Update the chart data
    chartData.value = {
      labels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: '#42A5F5',
          data: totalData,
        }
      ],
    };

    console.log("Updated chart data:", chartData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style>
.chartdes {
  height: 98%;
  width: 98%;
}
</style>
