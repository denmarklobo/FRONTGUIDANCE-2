<template>
  <div class="chartdes">
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {  
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import axios from 'axios'; // Import axios

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Reactive data for chart
const chartData = ref({
  labels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
  datasets: [
    {
      label: 'JHS',
      backgroundColor: '#42A5F5',
      data: [0, 0, 0, 0, 0, 0], // Initialize with zeros
    },
    {
      label: 'SHS',
      backgroundColor: '#FFA726',
      data: [0, 0, 0, 0, 0, 0], // Initialize with zeros
    },
  ],
});

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 50, // Adjust based on your data range
    },
  },
});

// Fetch data from the server
const fetchData = async () => {
  try {
    const response = await axios.get('http://26.11.249.89:8000/api/consultations/countall');
    const data = response.data.data;

    // Update chart data
    chartData.value = {
      labels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
      datasets: [
        {
          label: 'JHS',
          backgroundColor: '#42A5F5',
          data: [
            data['7']?.total || 0,
            data['8']?.total || 0,
            data['9']?.total || 0,
            data['10']?.total || 0,
            0, // Placeholder for Grade 11
            0, // Placeholder for Grade 12
          ],
        },
        {
          label: 'SHS',
          backgroundColor: '#FFA726',
          data: [
            0, // Placeholder for Grade 7
            0, // Placeholder for Grade 8
            0, // Placeholder for Grade 9
            0, // Placeholder for Grade 10
            data['11']?.total || 0,
            data['12']?.total || 0,
          ],
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Optionally handle error state here
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
});
</script>

<style>
.chartdes {
  height: 95%;
  width: 98%;
}
</style>
