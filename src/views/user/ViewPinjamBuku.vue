<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import ArgonAlert from "@/components/ArgonAlert.vue";
import moment from 'moment';

export default {
  components: {
    ArgonAlert
  },
  data() {
    return {
      products: [],
      showAlert: false,
      review: [
      ],
    };
  },
  mounted() {
    this.retrieveBuku();
    this.retrieveReview();
  },
  methods: {
    formatPrice(price) {
      const numericPrice = parseFloat(price);
      return numericPrice.toLocaleString('id-ID');
    },
    formatDate(data_date) {
      return moment.utc(data_date).format('YYYY-MM-DD')
    },
    async pinjam(id) {
      try {
        const formData = new FormData();
        formData.append('circulated_ID', id);

        const response = await axios.post(`${BASE_URL}/rent/borrow`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        });
        console.log(response);
        // this.showAlert = true;
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Request pinjam telah dikirim',
          color: 'green'
        });
        this.retrieveBuku();
      } catch (error) {
        console.error(error);
        this.$notify({
          type: 'danger',
          title: 'Failed',
          text: 'Anda sudah meminjam buku ini',
          color: 'green'
        });
      }
    },
    async retrieveBuku() {
      this.loadingAPI = true;
      try {
        const id = this.$route.params.id;

        const formData = new FormData();
        formData.append('circulated_ID', id);

        const response = await axios.post(`${BASE_URL}/book/circulated/detail`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        });

        this.products = response.data.data[0];
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingAPI = false;
      }
    },
    async retrieveReview() {
      this.loadingAPI = true;
      try {
        const id = this.$route.params.id;

        const response = await axios.get(`${BASE_URL}/review/get/book/` + id, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        });

        this.review = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingAPI = false;
      }
    },
  },
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="container">
      <div class="row mt-3">
        <argon-alert v-if="showAlert">
          <strong>Sukses!</strong> Silahkan tunggu konfirmasi pemilik buku!
        </argon-alert>
        <div class="card border-0" v-if="!loading">
          <div class="row p-2 pt-4">
            <div class="col-md-3 ">
              <img src="@/assets/img/noPic.png" class="rounded img-fluid" alt="Book Image">
            </div>
            <div class="col-md-9 d-flex flex-column justify-content-between">
              <a style="font-size: 32px; font-weight: bold;">{{ products.book_title }}</a>
              <div class="price my-2" style="font-weight: bold; font-size: 32px;">{{ (products.harga) }}
              </div>
              <div class="theme-text subtitle">Uploader:</div>
              <div class="brief-description">
                <router-link :to="'/profile/' + products.uploader_id">
                <i class="fas fa-user fa-md"></i>
                {{ products.uploader_name }}
                </router-link>
              </div>
              <hr>
              <h5>Deskripsi</h5>
              <div class="brief-description">
                {{ products.description }}
              </div>
              <br>
              <hr>
              <div class="mt-auto pb-2">
               

                <h5>Detail</h5>
                <a>No ISBN:</a>
                <p>{{ products.ISBN }}</p>
                <a>Pengarang:</a>
                <p>{{ products.authors }}</p>
                <a>Penerbit:</a>
                <p>{{ products.publisher }}</p>
                <!-- <v-chip class="mt-3">Tag</v-chip> -->
                <div class="row">
                  <!-- <div class="col-md-3 mt-2">
                      <input type="number" class="form-control" value="1">
                    </div> -->
                  <div class="col-md-9">
                    <button class="btn addBtn btn-block mt-2 btn-primary"
                      @click="pinjam(products.circulated_book_id)">Pinjam</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="!loading">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <h4 class="mb-0">Review Buku</h4>
              </div>
            </div>
            <div class="card-body">
              <div v-for="item in review" :key="item.id" style="color: black">
                  <div class="row mt-2">
                    <div class="col-12">
                      <div class="border px-4" style="border-radius: 20px;">
                        <div class="row">
                          <div class="d-flex align-items-center mt-2">
                            <div class="mt-2">
                              <a class="text-black"><strong>{{ item.reviewer }}</strong></a>
                              <a class="ms-3 text-black" style="font-size: 12px;">{{ formatDate(item.created_at) }}</a>
                            </div>
                          </div>
                          <v-rating readonly v-model="item.star" active-color="blue" color="orange-lighten-1"></v-rating>
                          <div class="row mt-2">
                            <p class="text-black">{{ item.feedback }}</p>
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
</template>
<style>
.user-select-none {
  user-select: none;
}

a {
  text-decoration: none;
  color: unset;
}

.product-single-card {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 1px 1px 15px #cccccc40;
  transition: 0.5s ease-in;
  background-color: white;
}

.product-single-card:hover {
  -webkit-box-shadow: 1px 1px 28.5px -7px #d6d6d6;
  -moz-box-shadow: 1px 1px 28.5px -7px #d6d6d6;
  box-shadow: 1px 1px 28.5px -7px #d6d6d6;
}

.product-single-card .product-info {
  padding: 15px 0 0 0;
}

.product-single-card .product-top-area {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
}

.product-single-card .product-top-area .product-discount {
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  border-radius: 3px;
  padding: 5px 10px;
  box-shadow: 1px 1px 28.5px -7px #dddddd;
  user-select: none;
  z-index: 999;
}

.product-single-card .product-top-area .product-img {
  aspect-ratio: 3/4;
  overflow: hidden;
  object-fit: fill;
}

.product-single-card .product-top-area .product-img .first-view {
  transition: 0.5s ease-in;
}

.product-single-card .product-top-area .product-img .hover-view {
  opacity: 0;
  transition: 0.5s ease-in;
}

/* 
.product-single-card .product-top-area:hover .product-img .first-view {
  opacity: 0;
  width: 0;
  height: 0;
}

.product-single-card .product-top-area:hover .product-img .hover-view {
  opacity: 100%;
  scale: 1.2;
} */
.product-single-card .product-top-area .product-img img {
  /* width: 250px;  */
  /* height: 150px;  */
  /* object-fit: cover; */
  /* Add a 5px solid white border */
  box-sizing: border-box;
}

.product-single-card .product-top-area .sideicons {
  position: absolute;
  right: 15px;
  display: grid;
  gap: 10px;
}

.product-single-card .product-top-area .sideicons .sideicons-btn {
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  border: none;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transform: translateX(60px);
  transition: 0.3s ease-in;
  -webkit-box-shadow: 1px 1px 28.5px -7px #dddddd;
  -moz-box-shadow: 1px 1px 28.5px -7px #dddddd;
  box-shadow: 1px 1px 28.5px -7px #dddddd;
}

.product-single-card .product-top-area .sideicons .sideicons-btn:hover {
  color: #fff;
  background-color: #000;
}

.product-single-card .product-top-area .sideicons .sideicons-btn:nth-child(1) {
  transition-delay: 100ms;
}

.product-single-card .product-top-area .sideicons .sideicons-btn:nth-child(2) {
  transition-delay: 200ms;
}

.product-single-card .product-top-area .sideicons .sideicons-btn:nth-child(3) {
  transition-delay: 300ms;
}

.product-single-card .product-top-area .sideicons .sideicons-btn:nth-child(4) {
  transition-delay: 400ms;
}

.product-single-card .product-top-area:hover .sideicons .sideicons-btn {
  opacity: 100%;
  visibility: visible;
  transform: translateX(0);
}

.product-single-card .product-info .product-category {
  font-weight: 600;
  opacity: 60%;
}

.product-single-card .product-info .product-title {
  font-size: 18px;
  font-weight: 600;
}

.product-single-card .product-info .old-price,
.product-single-card .product-info .new-price {
  padding-right: 15px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.product-single-card .product-info .old-price {
  text-decoration: line-through;
  opacity: 70%;
}


.search-container {
  width: 400px;
  display: block;
  margin: 0 auto;
  padding-right: 30px;
}

.card {
  border-radius: 10px !important;
}
</style>