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
    labels: ['Grade 11', 'Grade 12'],
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
  
  const fetchData = async () => {
    try {
      const responseSHS = await axios.get('http://192.168.16.165:8000/api/cons/shs');
      const fetchedData = responseSHS.data.data;
      console.log("Fetched Senior High data:", fetchedData);
  
      const totalData = [];

  
      // Process Senior High data
      ['11', '12'].forEach(grade => {
        totalData.push(fetchedData[grade]?.total || 0);
      });
  
      console.log("Total data:", totalData);
  
      // Update chart data reactively
      chartData.value = {
        labels: ['Grade 11', 'Grade 12'],
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#42A5F5',
            data: totalData,
          },
          
        ],
      };
  
      console.log("Updated chart data:", chartData.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  onMounted(fetchData);
  </script>
  
  <style>
  .chartdes {
    height: 98%;
    width: 98%;
  }
  </style>
  