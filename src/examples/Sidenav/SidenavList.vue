<script>
import { useRoute } from "vue-router";
import SidenavItem from "./SidenavItem.vue";
import axios from "axios";
import BASE_URL from '@/api/config-api';

export default {
  components: {
    SidenavItem
  },
  data() {
    return {
      userRole: ''
    };
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getRoute() {
      const route = useRoute();
      const routeArr = route.path.split("/");
      return routeArr[1];
    },
    async getUser() {
      try {
        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('access_token')
          }
        });
        this.username = response.data.data.username;
        this.userRole = response.data.data.role;
      } catch (error) {
        console.error(error);

        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message;
          console.log(errorMessage)
        }
      }
    }
  },
};
</script>


<template>
  <div class="collapse navbar-collapse w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <!-- <li v-if="userRole === 'admin'" class="nav-item">
        <sidenav-item to="/admin/dashboard" :class="getRoute() === 'dashboard' ? 'active' : ''" navText="Dashboard">
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
      <li v-if="userRole === 'admin'" class="nav-item">
        <sidenav-item to="/admin/verifikasi" :class="getRoute() === 'manage verifikasi' ? 'active' : ''" navText="Verifikasi Buku">
          <template v-slot:icon>
            <i class="fa fa-book text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li v-if="userRole === 'admin'" class="nav-item">
        <sidenav-item to="/admin/users" :class="getRoute() === 'manage users' ? 'active' : ''" navText="Manage Users">
          <template v-slot:icon>
            <i class="fas fa-users text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      
      <!-- <li v-if="userRole === 'ADMIN'" class="nav-item">
        <sidenav-item to="/virtual-reality" :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          navText="Virtual Reality">

          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <!-- Additional navigation items for other roles -->
      <li v-else-if="userRole === 'user'" class="nav-item">
        <sidenav-item to="/dashboard" :class="getRoute() === 'dashboard' ? 'active' : ''" navText="Home">
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li v-if="userRole === 'user'" class="nav-item">
        <sidenav-item to="/pinjamkan" :class="getRoute() === 'UserPinjamkan' ? 'active' : ''" navText="Pinjamkan">
          <template v-slot:icon>
            <i class="fa fa-book text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li v-if="userRole === 'user'" class="nav-item">
        <sidenav-item to="/pinjamkan/konfirmasi" :class="getRoute() === 'UserPinjamkanKonfirmasi' ? 'active' : ''" navText="Konfirmasi">
          <template v-slot:icon>
            <i class="far fa-check-circle text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li v-if="userRole === 'user'" class="nav-item">
        <sidenav-item to="/status" :class="getRoute() === 'Status' ? 'active' : ''" navText="Status Pinjam">
          <template v-slot:icon>
            <i class="fas fa-info text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
