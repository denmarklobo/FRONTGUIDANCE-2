<template>
  <v-app>
    <div class="app">
      <!-- Show Sidebar and Header only if not on the login page -->
      <template v-if="!isLoginPage">
        <Sidebar />
        <div class="headerAndContent">
          <Header />
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <Component :is="Component" />
            </transition>
          </router-view>
        </div>
      </template>
      <!-- Show only router-view on the login page -->
      <template v-else>
        <router-view />
      </template>
    </div>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
  },
  computed: {
    isLoginPage() {
      // Check if the current route path is '/login'
      return this.$route.path === '/login';
    },
  },
};
</script>

<style lang="scss">
:root {
  --primary: #727885;
  --grey: #64748b;
  --dark: #2F3F64;
  --dark-alt: #ffffff77;
  --light: #cdd1da;
  --sidebar-width: 300px;
  --header-height: 70px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter';
}

body {
  background: #e2e2e2;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;
    will-change: transform, opacity;

    @media (max-width: 768px) {
      padding-left: 7rem;
    }
  }
  .headerAndContent {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-out;
  }
}
</style>
