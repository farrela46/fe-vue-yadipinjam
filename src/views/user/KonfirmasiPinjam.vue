<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
// import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import moment from 'moment';
import * as bootstrap from 'bootstrap';



export default {
  components: {
    ArgonPagination,
    ArgonPaginationItem,
    // ArgonButton,
    ArgonInput
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
    async retrieveBuku() {
      this.loading = true;
      try {
        const response = await axios.get(`${BASE_URL}/rent/confirmOwner`, {
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
    async fetchBookByISBN() {
      const trimmedIsbn = this.buku.ISBN.trim();
      const isbnWithoutDashes = trimmedIsbn.replace(/-/g, '');

      if (isbnWithoutDashes) {
        const isbnUpperCase = isbnWithoutDashes.toUpperCase();

        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {
          try {
            this.loadingRegist = true;
            const response = await axios.post(`${BASE_URL}/fetch-book`, {
              ISBN: isbnUpperCase,
            });
            const bookData = response.data.data;
            this.buku = {
              ...this.buku,
              ISBN: isbnWithoutDashes,
              judul: bookData.title || "",
              penulis: bookData.authors ? bookData.authors.join(", ") : "",
              penerbit: bookData.publisher || "",
              tahun_terbit: bookData.date || "",
              harga: ""
            };

          } catch (error) {
            console.error('Error fetching book by ISBN:', error);
          } finally {
            this.loadingRegist = false;
          }
        }, 2000);
      }
    },

    handleFileChange(event) {
      const fileInput = event.target;
      this.selectedFiles = Array.from(fileInput.files);
    },
    async accept(id) {
      try {
        const formData = new FormData();
        formData.append('rent_ID', id);

        const response = await axios.post(`${BASE_URL}/rent/confirmBorrow`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });
        this.retrieveBuku();
        console.log(response);
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Buku dipinjamkan!',
          color: 'green'
        });
        this.retrieveBuku();
      } catch (error) {
        console.error(error);
      }
    },
    async confirmReturn(id) {
      try {
        const formData = new FormData();
        formData.append('rent_ID', id);

        const response = await axios.post(`${BASE_URL}/rent/confirmReturn`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });
        this.retrieveBuku();
        console.log(response);
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Buku telah kembali',
          color: 'green'
        });
        this.retrieveBuku();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(id) {
      try {
        const response = await axios.delete(`${BASE_URL}/deleteUser/` + id, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });
        console.log(response)
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'User berhasil dihapus',
          color: 'green'
        });
        this.getAllUser();
      } catch (error) {
        console.error(error);
      }
    },
    clearForm() {
      this.buku.ISBN = '';
      this.buku.judul = '';
      this.buku.deskripsi = '';
      this.buku.penulis = '';
      this.buku.penerbit = '';
      this.buku.tahun_terbit = '';
      this.buku.harga = '';
      this.selectedFiles = null
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
                <h6 class="mb-0">List Permintaan Pinjam Buku</h6>

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
                          ISBN
                        </th>
                        <th
                          class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Peminjam
                        </th>
                        <th
                          class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Mulai
                        </th>
                        <th
                          class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Selesai
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Status
                        </th>
                        <!-- <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Tahun Terbit
                        </th> -->
                        <th class="text-left text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(buku, index) in bukus" :key="buku.id">
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
                        <td class="align-left text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ buku.peminjam }}</span>
                        </td>
                        <td class="align-left text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ formatDate(buku.tanggal_mulai)
                            }}</span>
                        </td>
                        <td class="align-left text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ formatDate(buku.tanggal_selesai)
                            }}</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ buku.status }}</span>
                        </td>
                        <td class=" align-middle">

                          <div v-if="buku.status === 'pending'">
                            <v-tooltip text="Konfirmasi Pinjam" location="top">
                              <template v-slot:activator="{ props }">
                                <span class="mx-2" v-bind="props" style="font-size: 1rem; cursor: pointer;"
                                  @click="accept(buku.id)">
                                  <span style="color: lawngreen;">
                                    <i class="fas fa-check-circle"></i>
                                  </span>
                                </span>
                              </template>
                            </v-tooltip>
                          </div>
                          <div v-else-if="buku.status === 'returned'">
                            <v-tooltip text="Konfirmasi Pengembalian" location="top">
                              <template v-slot:activator="{ props }">
                                <span class="mx-2" v-bind="props" style="font-size: 1rem; cursor: pointer;"
                                  @click="confirmReturn(buku.id)">
                                  <span style="color: blue;">
                                    <i class="fas fa-check-circle"></i>
                                  </span>
                                </span>
                              </template>
                            </v-tooltip>
                          </div>
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
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-black" id="userModalLabel">Edit User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  id="closeModal"></button>
              </div>
              <form role="form" @submit.prevent="userUpdate">
                <div class="modal-body">
                  <argon-input type="text" placeholder="Name" v-model="users_edit.name" />
                  <argon-input type="email" placeholder="Email" v-model="users_edit.email" />
                  <argon-input type="password" placeholder="Password" v-model="users_edit.password" />
                </div>
                <v-progress-linear v-if="loadingRegist" indeterminate></v-progress-linear>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
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
