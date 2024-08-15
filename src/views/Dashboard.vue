<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title"> Disciplinary Dashboard</h1>
      <div class="inventory">
        <span class="material-icons">dashboard</span>
        <span class="text"> Disciplinary Dashboard</span>
        <hr>
      </div>
    </div>

    <div class="main-content">
      <div class="summary-container">
        <div class="summary-item">
          <span class="material-icons">assignment</span>
          <div class="summary-text">
            <h4>Total Cases</h4>
            <p>{{ totalCases }}</p>
          </div>
        </div>
        <div class="summary-item">
          <span class="material-icons">check_circle</span>
          <div class="summary-text">
            <h4>Total Cleared</h4>
            <p>{{ totalCleared }}</p>
          </div>
        </div>
        <div class="summary-item">
          <span class="material-icons">cancel</span>
          <div class="summary-text">
            <h4>Total Not Cleared</h4>
            <p>{{ totalNotCleared }}</p>
          </div>
        </div>
      </div>

      <div class="tables-container">
        <div class="left-section">
          <h3 class="text">
            <span class="material-icons">list</span> Junior High Total Violation
          </h3>
          <div class="jhs-total">
            <JHSBarChart 
              :totalData="totalData"
              :clearedData="clearedData"
              :notClearedData="notClearedData"
            />
          </div>
        </div>

        <div class="right-section">
          <h3 class="text">
            <span class="material-icons">list</span> Senior High Total Violation
          </h3>
          <div class="shs-total">
            <SHSBarChart 
              :totalData="totalData"
              :clearedData="clearedData"
              :notClearedData="notClearedData"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import JHSBarChart from '../components/JHSBarChart.vue';
import SHSBarChart from '../components/SHSBarChart.vue';
import axios from 'axios';

export default {
  components: {
    JHSBarChart,
    SHSBarChart,
  },
  data() {
    return {
      totalCases: 0,
      totalCleared: 0,
      totalNotCleared: 0,
      totalData: [],
      clearedData: [],
      notClearedData: [],
    };
  },
  mounted() {
    this.fetchSummary();
    this.fetchData();
  },
  methods: {
    async fetchSummary() {
      try {
        const response = await axios.get('http://26.81.173.255:8000/api/vio/summary');
        const data = response.data;

        this.totalCases = data.totalCases;
        this.totalCleared = data.totalCleared;
        this.totalNotCleared = data.totalNotCleared;
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    },
    async fetchData() {
      try {
        // Fetch data for Junior High
        const responseJHS = await axios.get('http://26.81.173.255:8000/api/vio/getJHS');
        const fetchedJHSData = responseJHS.data.data;

        // Calculate totals for Junior High
        this.totalData = [];
        this.clearedData = [];
        this.notClearedData = [];
        let totalCasesJHS = 0;
        let totalClearedJHS = 0;
        let totalNotClearedJHS = 0;

        // Process data for each grade
        ['7', '8', '9', '10'].forEach((grade) => {
          const gradeData = fetchedJHSData[grade] || { total: 0, cleared: 0, not_cleared: 0 };
          this.totalData.push(gradeData.total);
          this.clearedData.push(gradeData.cleared);
          this.notClearedData.push(gradeData.not_cleared);
          totalCasesJHS += gradeData.total;
          totalClearedJHS += gradeData.cleared;
          totalNotClearedJHS += gradeData.not_cleared;
        });

        // Update total cases for Junior High
        this.totalCases += totalCasesJHS;
        this.totalCleared += totalClearedJHS;
        this.totalNotCleared += totalNotClearedJHS;

        // Fetch data for Senior High
        const responseSHS = await axios.get('http://26.81.173.255:8000/api/vio/getSHS');
        const fetchedSHSData = responseSHS.data.data;

        // Process data for Senior High
        ['11', '12'].forEach((grade) => {
          const gradeData = fetchedSHSData[grade] || { total: 0, cleared: 0, not_cleared: 0 };
          this.totalData.push(gradeData.total);
          this.clearedData.push(gradeData.cleared);
          this.notClearedData.push(gradeData.not_cleared);
          this.totalCases += gradeData.total;
          this.totalCleared += gradeData.cleared;
          this.totalNotCleared += gradeData.not_cleared;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  color: var(--dark);

  .summary-container {
    display: flex;
    gap: 1rem; // Space between summary items
    margin-bottom: 2rem; // Space below summary

    .summary-item {
      flex: 1;
      background-color: #f0f0f0; 
      border: 2px solid #303c64; 
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem; 

      .material-icons {
        font-size: 2rem; // Icon size
        color: var(--dark);
      }

      .summary-text {
        h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0; // Remove default margin
        }

        p {
          font-size: 2rem;
          font-weight: 900;
          margin: 0; // Remove default margin
          color: #303c64; // Change color for emphasis
        }
      }
    }
  }

  .tables-container {
    display: flex;
    gap: 3rem;

    .left-section,
    .right-section {
      flex: 0.5;
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

      .jhs-total, .shs-total {
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

