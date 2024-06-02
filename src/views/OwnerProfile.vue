<script>
import { useStore } from 'vuex';
import setNavPills from '@/assets/js/nav-pills.js';
import setTooltip from '@/assets/js/tooltip.js';
// import ArgonInput from '@/components/ArgonInput.vue';
// import ArgonButton from '@/components/ArgonButton.vue';
import axios from 'axios';
import BASE_URL from '@/api/config-api';

export default {
  name: 'Profile',
  components: {
    // ArgonInput,
    // ArgonButton,
  },
  data() {
    return {
      store: null,
      body: null,
      users: {
        username: '',
        email: ''
      },
      review: [
        {
          id: 1,
          nama: 'Saleh Von Forst',
          title: 'Mencuri Abang Saleh',
          star: 3,
          date: '15 Hours Ago',
          text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis rem dolorem necessitatibus omnis quasi fugit dolore aspernatur, rerum voluptates voluptatem deleniti consequatur soluta veritatis excepturi quia in temporibus odio eum. Labore aspernatur, id asperiores veritatis a adipisci voluptate voluptas, quibusdam aperiam, tempora incidunt dolore! Voluptate sequi iste totam modi animi.'
        },
        {
          id: 2,
          nama: 'Dummy Budi',
          title: 'Arya si Boti',
          star: 2,
          date: '15 Hours Ago',
          text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis rem dolorem necessitatibus omnis quasi fugit dolore aspernatur, rerum voluptates voluptatem deleniti consequatur soluta veritatis excepturi quia in temporibus odio eum. Labore aspernatur, id asperiores veritatis a adipisci voluptate voluptas, quibusdam aperiam, tempora incidunt dolore! Voluptate sequi iste totam modi animi.'
        },
      ],
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
        const response = await axios.get(`${BASE_URL}/review/get/owner/` + this.$route.params.id, {
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
                <h5 class="mb-1">Andi</h5>
                <p class="mb-0 font-weight-bold text-sm">Bergabung Sejak:  20-04-2024</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row mt-3">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Review dari Peminjam</p>
              </div>
            </div>
            <div class="card-body">
              <div v-for="item in review" :key="item.id" style="color: black">
                  <div class="row mt-2">
                    <div class="col-12">
                      <div class="card px-4">
                        <div class="row">
                          <div class="d-flex align-items-center mt-2">
                            <div class="avatar avatar-sm position-relative me-2">
                              <img :src="require('@/assets/img/team-1.jpg')" alt="profile_image"
                                class="shadow-sm w-100 border-radius-lg" />
                            </div>
                            <div class="mt-2">
                              <a class="text-black">{{ item.nama }}</a>
                              <a class="ms-3 text-black" style="font-size: 12px;">{{ item.date }}</a>
                            </div>
                          </div>
                          <div class="row px-4 text-muted mt-2">
                            Judul Buku: {{ item.title }}
                          </div>
                          <v-rating readonly v-model="item.star" active-color="blue" color="orange-lighten-1"></v-rating>
                          <div class="row mt-2">
                            <p class="text-black">{{ item.text }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
