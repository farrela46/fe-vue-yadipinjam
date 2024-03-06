<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
// import Sidenav from "@/examples/Sidenav";
import AppFooter from "@/examples/Footer.vue";
// import Navbar from "@/examples/Navbars/HomeNavbar.vue";
import Navbar from "@/examples/PageLayout/HomeNavbar.vue";
import setTooltip from "@/assets/js/tooltip.js";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

// const sidebarMinimize = () => store.commit("sidebarMinimize");
// const toggleConfigurator = () => store.commit("toggleConfigurator");

onMounted(() => {
  setTooltip();
});

onBeforeMount(() => {
  store.state.layout = "vr";
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.add("virtual-reality");
  store.state.isTransparent = "bg-white";
});
onBeforeUnmount(() => {
  store.state.layout = "default";
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.remove("virtual-reality");

  if (store.state.isPinned === false) {
    const sidenav_show = document.querySelector(".g-sidenav-show");
    sidenav_show.classList.remove("g-sidenav-hidden");
    sidenav_show.classList.add("g-sidenav-pinned");
    store.state.isPinned = true;
  }
  store.state.isTransparent = "bg-transparent";
});
</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow" v-bind:darkMode="true" />
      </div>
    </div>
  </div>
  <!-- Header Section -->
  <div class="mx-3 mt-2 position-relative" :style="{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ) ,url(' + require('@/assets/img/library.png') + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '65vh',
          borderRadius: '30px 30px 0 0'
        }">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-auto text-center">
          <h1 class="text-white">YA DIPINJAM</h1>
          <p class="text-lead text-white">Sebuah website perpustakaan kolektif karya kami</p>
        </div>
      </div>
    </div>
  </div>
  <main class="main-content mt-5">
    <div class="section min-vh-85 position-relative">
      <div class="container-fluid">
        <div class="row mx-5 pt-4 mb-4">
          <div class="col-md-4 position-relative">
            <div class="text-center">
              <h1 class="text-gradient text-success"><span>25</span>+</h1>
              <h5 class="mt-3">Buku tersedia</h5>
              <p class="text-sm font-weight-normal">Buku yang tersedia untuk dipinjamkan kepada pengguna setia</p>
            </div>
            <hr class="vertical dark">
          </div>
          <div class="col-md-4 position-relative">
            <div class="text-center">
              <h1 class="text-gradient text-success"><span>12</span>+</h1>
              <h5 class="mt-3">Peminjaman berhasil</h5>
              <p class="text-sm font-weight-normal">Usulan yang di proses oleh perangkat desa</p>
            </div>
            <hr class="vertical dark">
          </div>
          <div class="col-md-4 position-relative">
            <div class="text-center">
              <h1 class="text-gradient text-success"><span>70</span>+</h1>
              <h5 class="mt-3">Pengguna Aktif</h5>
              <p class="text-sm font-weight-normal">Pengguna aktif YaDipinjam</p>
            </div>
          </div>
        </div>
      </div>
      <br>
      <div class="mx-3 mt-4 position-relative mb-5" :style="{
          backgroundColor: 'white',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '30px 30px 0 0'
        }">
        <div class="container-fluid h-200">
          <div class="row h-100 justify-content-center align-items-center m-5">
            <div class="col-auto text-center m-5">
              <h1 class="text-dark mb-4">Apa Itu YaDipinjam ?</h1>
              <p class="lead"> YaDipinjam merupakan aplikasi perpustakaan kolektif berbasis web yang dirancang
                untuk
                memfasilitasi pinjam-meminjam buku antar pelanggan. Platform ini memungkinkan pelanggan
                untuk meminjamkan buku milik mereka kepada pelanggan lain dan juga meminjam buku dari
                koleksi pelanggan lain. </p>
            </div>
            <section class="py-7">
              <div class="container">
                <div class="row align-items-center">
                  <div class="col-lg-6">
                    <div class="row justify-content-start">
                      <div class="col-md-6">
                        <div color="info" class="info">
                          <span style="font-size: 3rem;">
                            <span style="color: green;">
                              <i class="fas fa-globe"></i>
                            </span>
                          </span>
                          <h5 class="font-weight-bolder mt-3">Fully integrated</h5>
                          <p class="pe-5">We get insulted by others, lose trust for those We get back
                            freezes</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div color="info" class="info"><i
                            class="material-icons text-gradient text-success text-3xl">payments</i><!---->
                          <h5 class="font-weight-bolder mt-3">Payments functionality</h5>
                          <p class="pe-5">We get insulted by others, lose trust for those We get back
                            freezes</p>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-content-start mt-4">
                      <div class="col-md-6">
                        <div color="info" class="info"><i
                            class="material-icons text-gradient text-success text-3xl">apps</i><!---->
                          <h5 class="font-weight-bolder mt-3">Prebuilt components</h5>
                          <p class="pe-5">We get insulted by others, lose trust for those We get back
                            freezes</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div color="info" class="info"><i
                            class="material-icons text-gradient text-success text-3xl">3p</i><!---->
                          <h5 class="font-weight-bolder mt-3">Improved platform</h5>
                          <p class="pe-5">We get insulted by others, lose trust for those We get back
                            freezes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 ms-auto mt-lg-0 mt-6">
                    <div class="card">
                      <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"><a
                          class="d-block blur-shadow-image"><img
                            src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80"
                            alt="Get insights on Search" class="img-fluid border-radius-lg"></a></div>
                      <div class="card-body text-center">
                        <h5 class="font-weight-normal"><a href="javascript:;">Get insights on Search</a></h5>
                        <p class="mb-0">Website visitors today demand a frictionless user expericence — especially when
                          using search. Because of the hight standards.</p><button type="button"
                          class="btn btn-sm mb-0 mt-3 bg-gradient-success">Find Out More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <!-- <div class="container-fluid mt-2 bg-white">
        <div class="row">
          <div class="row justify-content-center text-center my-sm-5">
            <div class="col-lg-6">
              <span class="badge badge-success bg-success badge-md false mb-3 text-white">Infinite
                combinations</span>
              <h1 class="text-dark mb-0">Apa Itu YaDipinjam ?</h1>
              <p class="lead"> YaDipinjam adalah sebuah website penyedia layanan perpustakaan kolektif. </p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </main>

  <app-footer class="py-3 bg-white border-radius-lg" />
</template>
