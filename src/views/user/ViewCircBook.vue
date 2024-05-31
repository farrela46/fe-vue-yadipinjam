<script>
// import { useRoute } from "vue-router";
import axios from "axios";
import BASE_URL from '@/api/config-api';
// import AuthorsTable from "@/views/components/AuthorsTable.vue";

export default {
  components: {
  },
  data() {
    return {
      products: [],
      loadingAPI: false
    };
  },
  mounted() {
    this.retrieveBuku();
  },
  methods: {
    getImageLink(link) {
      return link ? link : require('@/assets/img/noPic.png');
    },
    formatPrice(price) {
      const numericPrice = parseFloat(price);
      return numericPrice.toLocaleString('id-ID');
    },
    handlePinjamClick() {
      this.$router.push('/pinjamkan');
    },
    async retrieveBuku() {
      this.loadingAPI = true;
      try {
        const isbn = this.$route.params.isbn;

        const formData = new FormData();
        formData.append('ISBN', isbn);

        const response = await axios.post(`${BASE_URL}/book/circulated`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        });

        this.products = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingAPI = false;
      }
    }

  },
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="loading" v-if="loadingAPI">
      <div class="row justify-content-center">
        <v-progress-circular model-value="20" :size="128" :width="12"></v-progress-circular>
      </div>
    </div>
    <div class="utama" v-else>
      <div class="row mt-3" v-if="products && products.length > 0">

        <router-link :to="'/pinjam/' + item.ISBN + '/'+ item.circulated_book_id" class="col-md-2 mt-2 mb-2 col-6" v-for="item in products"
          :key="item.id">
          <div class="product-single-card shadow">
            <div class="product-top-area">
              <div class="product-img">
                <div class="first-view">
                  <img alt="Book Image" :src="getImageLink(item.imagelink)" class="img-fluid">
                </div>
                <div class="hover-view">
                  <img alt="Book Image" :src="getImageLink(item.imagelink)" class="img-fluid">
                </div>
              </div>
              <!-- <div class="sideicons">
                <button class="sideicons-btn">
                  <v-icon icon="mdi-heart"></v-icon>
                </button>
                <button class="sideicons-btn" @click.prevent="addCart(item.id)">
                  <v-icon icon="mdi-cart-plus"></v-icon>
                </button>
              </div> -->
            </div>
            <div class="product-info p-2">
              <h6 class="text-muted text-light"><a href="#">{{ item.ISBN }}</a></h6>
              <h6 class="text-uppercase text-truncate"><a>{{ item.book_title }}</a></h6>
              <p class="text-black"><b>Pemilik:</b> {{ item.uploader_name }}</p>
              <!-- <div class="d-flex align-items-center">
                <a class="text-muted"><b>Tahun Terbit: </b>{{ item.year }}</a>
              </div> -->
            </div>
          </div>
        </router-link>
      </div>
      <div class="text-center mt-3" v-else>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-4">
              <div class="card text-center hover-card" style="width: 18rem; cursor: pointer;"
                @click="handlePinjamClick">
                <div class="card-body">
                  <i class="fas fa-plus fa-5x text-primary mb-3"></i>
                  <h5 class="card-title">PINJAMKAN BUKU</h5>
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
.hover-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.user-select-none {
  user-select: none;
}

a {
  text-decoration: none;
  color: unset;
}


.search-container {
  width: 400px;
  display: block;
  margin: 0 auto;
  padding-right: 30px;
}

.product-single-card {
  /* padding: 10px; */
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
  width: 250px;
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
</style>