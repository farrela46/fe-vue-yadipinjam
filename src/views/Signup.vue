<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import Navbar from "@/examples/PageLayout/HomeNavbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";

export default {
  name: 'Register',
  components: {
    Navbar,
    AppFooter,
    ArgonInput,
    // ArgonCheckbox,
    ArgonButton
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      phone: '',
      store: null,
      body: null,
      loading: false
    };
  },
  created() {
    this.store = this.$store;
    this.body = document.getElementsByTagName("body")[0];
    this.setupPage();
  },
  beforeUnmount() {
    this.restorePage();
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
          username: this.username,
          email: this.email,
          password: this.password,
          phone: this.phone,
        });
        this.$notify({
          type: 'success',
          title: 'Success',
          text: response.data.message,
          color: 'green'
        });
        const { role } = response.data.data.user;

        if (role === 'admin') {
          localStorage.setItem('access_token', response.data.data.token.token);
          this.$router.push('/admin/dashboard');
          console.log('login success;')
        } else if (role === 'user') {
          localStorage.setItem('access_token', response.data.data.token.token);
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error(error);

        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message;
          this.$notify({
            type: 'error',
            title: 'Error',
            text: errorMessage,
            color: 'red'
          });
        }
      } finally {
        this.loading = false;
      }
    },

    setupPage() {
      this.store.state.hideConfigButton = true;
      this.store.state.showNavbar = false;
      this.store.state.showSidenav = false;
      this.store.state.showFooter = false;
      this.body.classList.remove("bg-gray-100");
    },
    restorePage() {
      this.store.state.hideConfigButton = false;
      this.store.state.showNavbar = true;
      this.store.state.showSidenav = true;
      this.store.state.showFooter = true;
      this.body.classList.add("bg-gray-100");
    }
  }
}

</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow" v-bind:darkMode="true" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">

    <div class="mx-3 mt-2 position-relative" :style="{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ) ,url(' + require('@/assets/img/library.png') + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '65vh',
          borderRadius: '30px 30px 0 0'
        }">
      <div class="container-fluid h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-auto text-left mb-5">
            <h1 class="text-white mb-2 mt-2">Register</h1>
            <p class="text-lead text-white">
              Silahkan membuat akun terlebih dahulu untuk mengakses <br> YaDipinjam!
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0 shadow">
            <div class="card-header text-center pt-4">
              <h5>Register</h5>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="onSubmit">
                <argon-input v-model="username" id="name" type="text" placeholder="Username" aria-label="Name" />
                <argon-input v-model="email" id="email" type="email" placeholder="Email" aria-label="Email" />
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">+62</span>
                  <input type="text" class="form-control" v-model="phone" placeholder="Phone Number" aria-label="phone"
                    aria-describedby="basic-addon1">
                </div>
                <!-- <argon-input v-model="phone" id="name" type="text" placeholder="Phone Number" aria-label="Phone" /> -->
                <argon-input v-model="password" id="password" type="password" placeholder="Password"
                  aria-label="Password" />
                <!-- <argon-checkbox checked>
                  <label class="form-check-label" for="flexCheckDefault">
                    I agree the
                    <a href="javascript:;" class="text-dark font-weight-bolder">Terms and Conditions</a>
                  </label>
                </argon-checkbox> -->
                <div class="text-center">
                  <argon-button v-if="!loading" fullWidth color="dark" type="submit" variant="gradient"
                    class="my-4 mb-2">Sign up</argon-button>
                  <argon-button v-else fullWidth color="dark" variant="gradient" class="my-4 mb-2"
                    disabled><v-progress-circular indeterminate></v-progress-circular></argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  Sudah punya akun?
                  <router-link to="/login" class="text-dark font-weight-bolder">Login</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
