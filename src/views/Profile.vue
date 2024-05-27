<script>
import { useStore } from 'vuex';
import setNavPills from '@/assets/js/nav-pills.js';
import setTooltip from '@/assets/js/tooltip.js';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import axios from 'axios';
import BASE_URL from '@/api/config-api';

export default {
  name: 'Profile',
  components: {
    ArgonInput,
    ArgonButton,
  },
  data() {
    return {
      store: null,
      body: null,
      users: {
        username: '',
        email: ''
      },
    };
  },
  mounted() {
    this.store = useStore();
    this.body = document.getElementsByTagName('body')[0];
    this.store.state.isAbsolute = true;
    setNavPills();
    setTooltip();
    this.getUser();
  },
  beforeUnmount() {
    this.store.state.isAbsolute = false;
    this.store.state.imageLayout = 'default';
    this.store.state.showNavbar = true;
    this.store.state.showFooter = true;
    this.store.state.hideConfigButton = false;
    this.body.classList.remove('profile-overview');
  },
  methods: {
    setupPage() {
      this.store.state.imageLayout = 'profile-overview';
      this.store.state.showNavbar = false;
      this.store.state.showFooter = true;
      this.store.state.hideConfigButton = true;
      this.body.classList.add('profile-overview');
    },
    restorePage() {
      this.store.state.isAbsolute = false;
      this.store.state.imageLayout = 'default';
      this.store.state.showNavbar = true;
      this.store.state.showFooter = true;
      this.store.state.hideConfigButton = false;
      this.body.classList.remove('profile-overview');
    },
    async getUser() {
      try {
        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('access_token')
          }
        });
        this.users = response.data.data
      } catch (error) {
        console.error(error);

        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message;
          console.log(errorMessage)
        }
      }
    },
    async updateUser() {
      try {
        const response = await axios.put(`${BASE_URL}/auth/users/update`, this.users, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('access_token')
          }
        });
        this.users.password = null,
          console.log(response.data.message);
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Successfully Updated!',
          color: 'green'
        });
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message;
          console.log(errorMessage);
          // Handle error notification if needed
        }
      }
    },
    async onLogout() {
      try {
        await axios.delete(`${BASE_URL}/auth/logout`,);

        localStorage.removeItem('access_token');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
};
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="page-header min-height-300" style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        ">
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img src="../assets/img/team-1.jpg" alt="profile_image" class="shadow-sm w-100 border-radius-lg" />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ users.username }}</h5>
                <p class="mb-0 font-weight-bold text-sm">{{ users.role }}</p>
              </div>
            </div>
            <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
              <div class="nav-wrapper position-relative end-0">
                <argon-button color="danger" @click="onLogout"><span class="mx-3"
                    style="font-size: 1rem; cursor: pointer;">
                    <span style="color: WHITE;">
                      <i class="fas fa-running"></i>
                    </span>
                  </span>Logout</argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Edit Profile</p>

              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">Username</label>
                  <argon-input type="text" v-model="users.username" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">Email address</label>
                  <argon-input type="email" v-model="users.email" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">Phone</label>
                  <input class="form-control" type="text" v-model="users.phone" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">Credit Balance</label>
                  <input class="form-control" type="text" v-model="users.balance" disabled />
                </div>
                <div class="col mt-4 d-flex justify-content-end">
                  <argon-button color="success" size="sm" class="ms-auto" @click="updateUser">Update</argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
