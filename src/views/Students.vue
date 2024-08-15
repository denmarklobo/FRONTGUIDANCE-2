<template>
  <main>
    <div class="top-container">
        <h1 class="bg-title">Students</h1>
        <div class="inventory">
            <span class="material-icons">face</span>
            <span class="text">Students</span>
            <hr>
        </div>
    </div>
    <div class="main-content">
      <div class="table-section">
        <StudentInfo />
      </div>
      <div class="tables-container">
        <div class="table-section">
          <h3 class="text">Admission Results</h3>
          <AdmissionResults />
        </div>
        <div class="table-section">
          <h3 class="text">Violation Records</h3>
          <ViolationRecords />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import StudentInfo from '../components/StudentInfo.vue';
import ViolationRecords from '../components/VR.vue';
import AdmissionResults from '../components/AR.vue';

export default {
  components: {
    StudentInfo,
    ViolationRecords,
    AdmissionResults
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  color: var(--dark);

  .header-title {
    display: flex;
    gap: 0.5rem;

    .material-icons {
      font-size: 2rem;
      position: relative;
      top: 3px;
    }
  }

  .table-section {
    margin-bottom: 2rem;
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 10px;
  }

  .tables-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;

    .table-section {
      flex: 1 1 calc(50% - 1rem);
      max-width: 50%;
    }
  }

  @media (max-width: 768px) {
    .tables-container {
      flex-direction: column;
    }

    .table-section {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
}

.bg-title{
    z-index: -1;
    position: absolute;
    opacity: 10%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
}
.top-container{
    display: flex;
    margin: 0.5rem;
    .inventory{
        flex: 1;
        
        .material-icons{
            color: var(--dark);
            font-size: 2.5rem;
        }
        .text{
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
