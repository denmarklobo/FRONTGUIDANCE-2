<template>
    <main>
      <div class="top-container">
        <h1 class="bg-title">Consultations</h1>
        <div class="inventory">
            <span class="material-icons">message</span>
            <span class="text">Consultations</span>
            <hr>
        </div>
    </div>
      <div class="main-content">
        <div class="consultation">
          <ConsultationComponent />
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import ConsultationComponent from '../components/Consultation.vue';
  
  export default {
    components: {
      ConsultationComponent
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .top-container {
    display: flex;
    margin: 0.5rem;
  
    .consultation {
      flex: 1;
  
      .material-icons {
        color: var(--dark);
        font-size: 2.5rem;
      }
      .text {
        position: relative;
        color: var(--dark);
        font-size: 1.5rem;
        font-weight: 900;
        bottom: 0.5rem;
      }
    }
  }
  
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
        top: 4px;
      }
    }
    .consultation {
      border-radius: 10px;
      background-color: #f0f0f0;
      padding: 0.5rem;
      max-height: 150vh;
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
  