<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
// import ArgonButton from "@/components/ArgonButton.vue";
// import ArgonInput from "@/components/ArgonInput.vue";
import moment from 'moment';
import * as bootstrap from 'bootstrap';



export default {
  components: {
    ArgonPagination,
    ArgonPaginationItem,
    // ArgonButton,
    // ArgonInput
  },
  data() {
    return {
      bukus: [],
      users_edit: [],
      searchIsbn: '',
      buku: {
        ISBN: '',
        judul: '',
        deskripsi: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        harga: '',
      },
      selectedFiles: [],
      loading: false,
      loadingRegist: false,
      dialog: false,
      showModal: false,
      selectedUserId: null,
      showProductModal: false,
      selectedProduct: {},
    };
  },
  methods: {
    handleclose() {
      this.clearForm();
    },
    extractYear(dateString) {
      const dateObj = new Date(dateString);
      return dateObj.getFullYear();
    },
    closeModal() {
      document.getElementById('closeModal').click();
    },
    formatDate(data_date) {
      return moment.utc(data_date).format('YYYY-MM-DD')
    },
    async showProduct(slug) {
      this.selectedProduct = slug;
      try {
        const response = await axios.get(BASE_URL + '/buku/detail/' + slug, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('access_token')
          }
        });
        this.selectedProduct = response.data;
        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('showProduct'))
        modal.show();
        // $('#showProduct').modal('show');
      } catch (error) {
        console.error(error);
      }
    },
    async retrieveBuku() {
      this.loading = true;
      try {
        const response = await axios.get(`${BASE_URL}/book/admin`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('access_token')
          }
        });
        this.bukus = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async verified(ISBN) {
      try {
        const response = await axios.get(`${BASE_URL}/book/ciculated/verified/` + ISBN, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });
        this.retrieveBuku();
        console.log(response)
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Buku telah di Verifikasi',
          color: 'green'
        });
        this.retrieveBuku();
      } catch (error) {
        console.error(error);
      }
    },
    openDeleteConfirmation(id) {
      this.selectedUserId = id;
      let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmationModal'))
      modal.show();
    },
    confirmDelete() {
      if (this.selectedUserId) {
        this.deleteUser(this.selectedUserId);
        this.closeModalDelete();
      }
    },
    closeModalDelete() {
      let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmationModal'))
      modal.hide();
    },
    editUser(id_user) {
      let obj = this.users.find(o => o.id === id_user);
      this.users_edit = obj;
      let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editModal'))
      modal.show();
    },
  },
  mounted() {
    this.retrieveBuku();
  },
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-md-12 col-12">
            <div class="card">
              <div class="card-header pb-0 d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Verifikasi Buku</h6>

              </div>
              <div class="card-body px-0 pt-0 pb-2">
                <div v-if="loading" class="divider">
                  <v-progress-linear indeterminate></v-progress-linear>
                </div>
                <!-- <div v-else class="text-center mt-3">
                  <p>Kamu tidak memiliki buku yang siap dipinjamkan</p>
                </div> -->
                <div v-else class="table-responsive p-0">
                  <table class="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7">
                          No
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Title
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Verif
                        </th>
                        <th class="text-left text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(buku, index) in bukus" :key="index">
                        <td>
                          <div class="px-2 py-1">
                            <div class="d-flex justify-content-center">
                              <h6 class="mb-0 text-sm">{{ index + 1 }}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">{{ buku.title }}</h6>
                              <p class="text-xs text-secondary mb-0">
                                {{ buku.ISBN }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle text-center">
                          <v-chip v-if="buku.verified === 'unverified'">Unverified</v-chip>
                          <v-chip v-else-if="buku.verified === 'verified'">Verified</v-chip>
                        </td>
                        <td class="align-middle">
                          <!-- <span class="" style="font-size: 1rem; cursor: pointer;" @click="showProduct(buku.ISBN)">
                            <span style="color: blue;">
                              <i class="fas fa-eye"></i>
                            </span>
                          </span> -->
                          <v-tooltip text="Verifikasi Buku" location="end">
                            <template v-slot:activator="{ props }">
                              <span class="mx-2" v-bind="props" style="font-size: 1rem; cursor: pointer;"
                                @click="verified(buku.ISBN)">
                                <span style="color: lightgreen;">
                                  <i class="fas fa-check-circle"></i>
                                </span>
                              </span>
                            </template>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade" id="deleteConfirmationModal" tabindex="-1"
          aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-black" id="deleteConfirmationModalLabel">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this user?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade text-black" id="showProduct" tabindex="-1" aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Product</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  id="closeModal"></button>
              </div>
              <div class="modal-body" style="max-height: 80vh; overflow-y: auto;">
                <div class="row">
                  <h2>Judul</h2>
                </div>
                <hr>
                <div class="row d-flex justify-content-center align-items-center">
                  <div class="col-12 " style="width: 400px">
                    <v-carousel show-arrows="hover" height="auto">
                      <v-carousel-item :src="selectedProduct.foto" cover></v-carousel-item>
                    </v-carousel>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-12 mt-5">
                    <h5>Description : </h5>
                    <p>{{ selectedProduct.desc }}</p>
                    <hr>
                    <p>Category:</p>
                    <template v-if="selectedProduct.category">
                      <v-chip class="mx-2" v-for="(category, index) in selectedProduct.category.split(',')"
                        :key="index">
                        {{ category.trim() }}
                      </v-chip>
                    </template>
                    <hr>
                    <div class="row mt-3">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Harga:</label>
                          <div class="input-group">
                            <span class="input-group-text">Rp</span>
                            <input type="text" class="form-control" :value="selectedProduct.harga" disabled>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Stok:</label>
                          <input type="text" class="form-control" :value="selectedProduct.stok" disabled>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <argon-pagination>
            <argon-pagination-item prev />
            <argon-pagination-item label="1" active />
            <argon-pagination-item label="2" disabled />
            <argon-pagination-item label="3" />
            <argon-pagination-item next />
          </argon-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
