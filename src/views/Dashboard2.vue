<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title"> Guidance Dashboard</h1>
      <div class="inventory">
        <span class="material-icons">dashboard</span>
        <span class="text"> Guidance Dashboard</span>
        <hr>
      </div>
    </div>
    
    

    <div class="main-content">
      <div class="totals-container">
        <div class="total-item">
          <span class="material-icons">assignment_ind</span>
          <div>
            <h4 class="text">Total Consultations</h4>
            <p class="total-value">{{ totalConsultations }}</p> <!-- Dynamic value -->
          </div>
        </div>
        <div class="total-item">
          <span class="material-icons">assessment</span>
          <div>
            <h4 class="text">Total Examinations</h4>
            <p class="total-value">{{ totalExaminations }}</p> <!-- Dynamic value -->
          </div>
        </div>
      </div>

      <div class="tables-container">
        <div class="chart-section">
          <h3 class="text">
            <span class="material-icons">list</span> Consultation
          </h3>
          <div class="chart-total">
            <ConsultationCombined />
          </div>
        </div>
        <div class="chart-section">
          <h3 class="text">
            <span class="material-icons">list</span> Examination
          </h3>
          <div class="chart-total">
            <ExaminationCombined />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import axios
import ConsultationCombined from '../components/ConsultationCombined.vue';
import ExaminationCombined from '../components/CombinedExamination.vue';

// Reactive state for totals
const totalConsultations = ref(0);
const totalExaminations = ref(0);

// Fetch data from the server
const fetchTotals = async () => {
  try {
    const [consultationsResponse, examinationsResponse] = await Promise.all([
      axios.get('http://26.81.173.255:8000/api/consultations/count'),
      axios.get('http://26.81.173.255:8000/api/exam/count'),
    ]);

    totalConsultations.value = consultationsResponse.data.total;
    totalExaminations.value = examinationsResponse.data.total;
  } catch (error) {
    console.error('Error fetching totals:', error);
    // Optionally handle error state here
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchTotals();
});
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  color: var(--dark);

  .totals-container {
    display: flex;
    gap: 1rem; // Reduced gap between total items
    margin-bottom: 2rem; // Space below totals

    .total-item {
      flex: 1;
      background-color: #f0f0f0;
      border: 2px solid #303c64;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem; 
    }

    .material-icons {
      font-size: 3rem; // Icon size
      margin-right: 1rem; // Space between icon and text
      color: var(--dark);
    }

    h4 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0; // Remove default margin
    }

    .total-value {
      font-size: 2rem;
      font-weight: 900;
      margin: 0; // Remove default margin
      color: #303c64; // Change color for emphasis
    }
  }

  .tables-container {
    display: flex;
    gap: 3rem;

    .chart-section {
      flex: 1;
      margin-bottom: 2rem;
      background-color: #f0f0f0;
      padding: 1rem;
      border-radius: 10px;
      border-left: 5px solid #303c64; 
      border-right: 5px solid #303c64;

      h3 {
        font-size: 2rem;
        font-weight: 900;
        color: var(--dark);
      }

      .chart-total {
        height: 95%; // Ensure the chart takes up available height
      }
    }
  }

  @media (max-width: 768px) {
    .tables-container {
      flex-direction: column;
    }
  }
}

.bg-title {
  z-index: -1;
  position: absolute;
  opacity: 10%;
  margin-top: -40px;
  font-size: 100px;
  font-family: Impact, fantasy;
}

.top-container {
  display: flex;
  margin: 0.5rem;

  .inventory {
    flex: 1;

    .material-icons {
      color: var(--dark);
      font-size: 2.5rem;
    }

    .text {
      position: relative;
      color: var(--dark);
      font-size: 2rem;
      font-weight: 900;
      bottom: 0.6rem;
      left: 0.5rem;
    }
  }
}

</style>