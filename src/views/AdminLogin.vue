<template>
  <v-app class="app">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8">
          <v-card class="elevation-12">
            <v-window v-model="step">
              <v-row>
                <v-col cols="12" md="5" class="rectangle-color">
                  <v-card-text class="white--text mt-16 pt-14 mx-auto">
                    <div class="logo-container">
                      <!-- Logo positioned at the right side -->
                      <img src="/src/assets/schoolLogo3.png" max-height="900" max-width="900" class="logo">
                    </div>
                    <div class="text-container text-center">
                      <h1 class="mt-10 h2 font-weight-black">ST. NICHOLAS ACADEMY OF CASTILLEJOS INC.</h1>
                      <p class="h6 font-weight-normal">CASTILLEJOS, ZAMBALES</p>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="7">
                  <v-card-text class="mt-1">
                    <div class="text-center mb-1">
                      <img src="/src/assets/schoolLogo.png" class="logo-logo">
                    </div>
                    <h2 class="text-center lh-0 fs-4 fw-normal">
                      Welcome to <span class="sna-text">SNACI!</span>
                    </h2>
                    <h4 class="text-center pt-0 fs-6">
                      STUDENT GUIDANCE - ADMIN PORTAL
                    </h4>
                    <v-form @submit.prevent="handleLogin">
                      <v-text-field 
                        v-model="email"
                        label="Email/ID"
                        name="Email"
                        prepend-icon="mdi-email"
                        type="text"
                        color="var(--dark)"
                        required
                      />
                      <v-text-field
                        v-model="password"
                        id="password"
                        label="Password"
                        name="Password"
                        prepend-icon="mdi-lock"
                        type="password"
                        color="var(--dark)"
                        required
                      />
                      <div class="text-center pb-2 mx-md-auto">
                      <v-btn rectangle color="var(--dark)" class="login-btn" @click="handleLogin" style="color:white;"> Login</v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                  <div class="text-center pb-2" PolicyNotice><PolicyNotice/></div>
                </v-col>
              </v-row>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import PolicyNotice from '../components/PolicyNotice.vue';
import Swal from 'sweetalert2';

export default {
  components: { PolicyNotice },
  data() {
    return {
      email: '',
      password: '',
      step: 0 // Handles the v-window model
    };
  },
  methods: {
  handleLogin() {
    axios.post('http://127.0.0.1:8000/api/authlogin', {
      email: this.email,
      password: this.password,
    })
    .then(response => {
      const token = response.data.token;
      const user = response.data.user;
      if (user.role === 'admin' || user.role === 'user') {
        localStorage.setItem('role', user.role);
        sessionStorage.setItem('token', token); // Store user role in local storage
        Swal.fire({
          title: 'Login Successful',
          text: `Welcome to ${user.role === 'admin' ? 'Guidance Panel' : 'Disciplinary Panel'}!`,
          icon: 'success',
          showConfirmButton: false, 
          timer: 3000, 
        }).then(() => {
          if (user.role === 'admin') {
            this.$router.push('/ddashboard'); // Redirect based on role
          } else {
            this.$router.push('/gdashboard');
          }
        });
      } else {
        console.error('User is not authorized.');
        Swal.fire({
          title: 'Unauthorized',
          text: 'You are not authorized to access this system.',
          icon: 'error',
          showConfirmButton: false, 
          timer: 3000, 
        });
      }
    })
    .catch(error => {
      console.error('Login failed:', error);
      Swal.fire({
        title: 'Login Failed',
        text: 'Please check your credentials and try again.',
        icon: 'error',
        showConfirmButton: false, 
        timer: 3000, 
      });
    });
  }
}}
</script>

<style scoped>
.app {
  position: relative; /* Ensure the parent is positioned relative */
  background-image: url('../assets/BG2.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.app::before {
  content: ''; /* Required for pseudo-elements */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Adjust the opacity value as needed */
}

.logo-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 100%;
  right: 100%; /* Adjust this value to move the container to the left */
}

.logo {
  width: 600px; 
  height: 100%; 
  object-fit: cover; 
  filter: brightness(250%) grayscale(0%); 
  opacity: 12%;
}

.logo-logo {
  max-height: 150px;
  max-width: 150px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.sna-text {
  color: var(--dark);
  text-shadow: 0px 1px, 1px 0px, 1px 1px;
}

.text-container {
  position: relative;
  z-index: 1; 
  color: white;
}

.rectangle-color {
  background-color: var(--dark);
}



</style>
