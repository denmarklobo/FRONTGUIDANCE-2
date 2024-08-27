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
    {
      label: 'Cleared',
      backgroundColor: 'green',
      data: [],
    },
    {
      label: 'Not Cleared',
      backgroundColor: 'red',
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
      max: 50, // Set maximum value for y-axis
    },
  },
});

onMounted(async () => {
  try {
    // Make the API request to fetch violations per grade
    const responseJHS = await axios.get('http://26.81.173.255:8000/api/vio/getJHS');
    const fetchedData = responseJHS.data.data;
    console.log("Fetched data:", fetchedData);

    // Arrays to store data for the chart
    const totalData = [];
    const clearedData = [];
    const notClearedData = [];

    // Grades to process
    const grades = ['7', '8', '9', '10'];

    // Loop through each grade and extract the relevant data
    grades.forEach(grade => {
      totalData.push(fetchedData[grade]?.total || 0);
      clearedData.push(fetchedData[grade]?.cleared || 0);
      notClearedData.push(fetchedData[grade]?.not_cleared || 0);
    });

    console.log("Total data:", totalData);
    console.log("Cleared data:", clearedData);
    console.log("Not Cleared data:", notClearedData);

    // Update the chart data
    chartData.value = {
      labels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: '#42A5F5',
          data: totalData,
        },
        {
          label: 'Cleared',
          backgroundColor: 'green',
          data: clearedData,
        },
        {
          label: 'Not Cleared',
          backgroundColor: 'red',
          data: notClearedData,
        },
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
  height: 95%;
  width: 98%;
}
</style>
