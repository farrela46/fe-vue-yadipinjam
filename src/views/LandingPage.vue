<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
// import Sidenav from "@/examples/Sidenav";
import AppFooter from "@/examples/Footer.vue";
// import Navbar from "@/examples/Navbars/HomeNavbar.vue";
import Navbar from "@/examples/PageLayout/HomeNavbar.vue";
import setTooltip from "@/assets/js/tooltip.js";
import Typed from 'typed.js';

const body = document.getElementsByTagName("body")[0];

const store = useStore();

document.addEventListener('DOMContentLoaded', function () {
  const typedStrings = document.getElementById('typed-strings').getElementsByTagName('h1');
  const typedOptions = {
    strings: Array.from(typedStrings).map(el => el.innerText),
    typeSpeed: 100,
    backSpeed: 50,
    loop: true
  };

  new Typed('#typed', typedOptions);
});

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
      <div class="mx-3 mt-4 mb-5" :style="{
          backgroundColor: 'white',
          backgroundPosition: 'center',
          borderRadius: '30px 30px 30px 30px'
        }">
        <div class="row h-100 justify-content-center align-items-center m-5">
          <div class="col-auto text-center m-2">
            <h1 class="text-dark mb-4 mt-5">Apa Itu YaDipinjam ?</h1>
            <p class="lead"> YaDipinjam merupakan aplikasi perpustakaan kolektif berbasis web yang dirancang
              untuk
              memfasilitasi pinjam-meminjam buku antar pelanggan. Platform ini memungkinkan pelanggan
              untuk meminjamkan buku milik mereka kepada pelanggan lain dan juga meminjam buku dari
              koleksi pelanggan lain. </p>
          </div>
          <section class="py-5 ">
            <div class="row align-items-center">
              <div class="col-md-12">
                <div class="row justify-content-start">
                  <div class="col-md-6">
                    <div color="info" class="info">
                      <span style="font-size: 3rem;">
                        <span style="color: green;">
                          <i class="fas fa-globe"></i>
                        </span>
                      </span>
                      <h5 class="font-weight-bolder mt-3">Daerah</h5>
                      <p class="pe-5">Daerah layanan kami meliputi Surabaya dan sekitarnya</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div color="info" class="info"><span style="font-size: 3rem;">
                        <span style="color: green;">
                          <i class="fa fa-money"></i>
                        </span>
                      </span>
                      <h5 class="font-weight-bolder mt-3">Sistem Deposit</h5>
                      <p class="pe-5">Penerapan sistem deposit guna meningkatkan trust point dalam melakukan
                        pinjam-meminjam</p>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-start mt-4">
                  <div class="col-md-6">
                    <div color="info" class="info">
                      <span style="font-size: 3rem;">
                        <span style="color: green;">
                          <i class="fa fa-hand-peace-o"></i>
                        </span>
                      </span>
                      <h5 class="font-weight-bolder mt-3">Kemudahan</h5>
                      <p class="pe-5">Kemudahan dalam melakukan peminjaman dalam website kami.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div color="info" class="info">
                      <span style="font-size: 3rem;">
                        <span style="color: green;">
                          <i class="fa fa-lock"></i>
                        </span>
                      </span>
                      <h5 class="font-weight-bolder mt-3">Keamanan</h5>
                      <p class="pe-5">Kami akan mengusahakan data pengguna aman pada kami </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr class="my-5">
          <section class="py-5 mb-5">
            <div class="row align-items-center">
              <div class="col-md-6 d-flex justify-content-center align-items-center">
                <div class="row">
                  <div class="col m-3">
                    <h2 class="font-weight-normal">Buku adalah jendela Dunia!</h2>
                    <p style="font-size: 18px;">Dengan membaca buku, kita bisa mendapatkan beragam pengetahuan yang
                      belum kita
                      ketahui. Sehingga wawasan kita kian bertambah.
                    </p>
                    <router-link to="/login" class="text-dark font-weight-bolder">
                      <button type="button" class="btn btn-sm mb-0 mt-3 bg-gradient-success">Pinjam Sekarang!</button>
                    </router-link>
                    <!-- <router-link to="/faq" class="text-dark font-weight-bolder"> <button type="button"
                        class="btn btn-sm mb-0 mt-3 mx-3 bg-gradient-info">Cara Peminjaman!</button></router-link> -->
                  </div>
                </div>
              </div>
              <div class="col-md-6 mt-6 d-flex justify-content-center align-items-center">
                <div class="card">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"><a
                      class="d-block blur-shadow-image"><img
                        src="https://feedback.minecraft.net/hc/user_images/RU2A2xA0BE8LK3zqkYnmdw.jpeg"
                        alt="Steve Reading Book" class="img-fluid border-radius-lg"></a></div>
                  <div class="card-body text-center">
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="py-5 mt-5 bg-gradient-dark mb-4" style="border-radius: 30px;">
            <div class="container">
              <div class="row">
                <div class="col-md-8 text-start mb-5 mt-5">
                  <h2 class="text-white"> YadiDevelop Team, kami <span class="text-white" id="typed"></span></h2>
                  <div id="typed-strings" style="display: none;">
                    <h1>Cepat</h1>
                    <h1>Tepat</h1>
                    <h1>Terbaik</h1>
                  </div>
                  <p class="text-white opacity-8 mb-0"> Hasil terbaik datang dari usaha yang terbaik.
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6 col-12">
                  <div class="card card-profile mt-4">
                    <div class="row">
                      <div class="col-lg-4 col-md-6 col-12 mt-n5"><a href="javascript:;">
                          <div class="p-3 pe-md-0"><img class="w-100 border-radius-md shadow-lg"
                              :src="require('@/assets/img/analyst-1.png')" alt="Emma Roberts"></div>
                        </a></div>
                      <div class="col-lg-8 col-md-6 col-12 my-auto">
                        <div class="card-body ps-lg-0">
                          <h5 class="mb-0">Sembiring 'Enzo' Laridho</h5>
                          <h6 class="text-success">System Analyst</h6>
                          <p class="mb-0">Best Analyst</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-12">
                  <div class="card card-profile mt-lg-4 mt-5">
                    <div class="row">
                      <div class="col-lg-4 col-md-6 col-12 mt-n5"><a href="javascript:;">
                          <div class="p-3 pe-md-0"><img class="w-100 border-radius-md shadow-lg"
                              :src="require('@/assets/img/ui-1.png')" alt="William Pearce"></div>
                        </a></div>
                      <div class="col-lg-8 col-md-6 col-12 my-auto">
                        <div class="card-body ps-lg-0">
                          <h5 class="mb-0">Desyalwa 'Najah' Yuga</h5>
                          <h6 class="text-success">UI Designer</h6>
                          <p class="mb-0">Impressive Designer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-lg-6 col-12">
                  <div class="card card-profile mt-4 z-index-2">
                    <div class="row">
                      <div class="col-lg-4 col-md-6 col-12 mt-n5"><a href="javascript:;">
                          <div class="p-3 pe-md-0"><img class="w-100 border-radius-md shadow-lg"
                              :src="require('@/assets/img/fe-1.png')" alt="Ivana Flow"></div>
                        </a></div>
                      <div class="col-lg-8 col-md-6 col-12 my-auto">
                        <div class="card-body ps-lg-0">
                          <h5 class="mb-0">Darmawan 'Farrel' Ahmad</h5>
                          <h6 class="text-success">Frontend Developer</h6>
                          <p class="mb-0">Hi, Im Frontend Engineer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-12">
                  <div class="card card-profile mt-lg-4 mt-5 z-index-2">
                    <div class="row">
                      <div class="col-lg-4 col-md-6 col-12 mt-n5"><a href="javascript:;">
                          <div class="p-3 pe-md-0"><img class="w-100 border-radius-md shadow-lg"
                              :src="require('@/assets/img/be-1.png')" alt="Marquez Garcia"></div>
                        </a></div>
                      <div class="col-lg-8 col-md-6 col-12 my-auto">
                        <div class="card-body ps-lg-0">
                          <h5 class="mb-0">Abdullah 'Yasfa' Ainun</h5>
                          <h6 class="text-success">Backend Developer</h6>
                          <p class="mb-0">Hi, Im Backend Engineer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
