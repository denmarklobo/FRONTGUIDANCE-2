<template>
    <header class="header">
        <h2 class="sna-label">Guidance Management System</h2>
        <div class="clock">{{ currentTime }}</div>
    </header>
</template>

<script>
export default {
    name: 'Header',
data() {
    return {
      currentTime: ''
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // Update time every second
  },
  methods: {
    updateTime() {
      const now = new Date();
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      this.currentTime = now.toLocaleDateString('en-US', options);
    }
}
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    background:   var(--dark);
    height: var(--header-height);
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    .sna-label{
        flex: 1;
        color: #ffffff;
        align-self: center;
        margin-left: 1rem;
        text-transform: uppercase;
    }
    .clock {
    color: #e2e2e2;
    align-self: center;
    margin-right: 1rem;
  }
 
}

</style>