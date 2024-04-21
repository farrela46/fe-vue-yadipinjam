<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import moment from 'moment';
import * as bootstrap from 'bootstrap';



export default {
  components: {
    ArgonPagination,
    ArgonPaginationItem,
    ArgonButton,
    ArgonInput
  },
  data() {
    return {
      users: [],
      users_edit: [],
      buku: {
        isbn: '',
        judul: '',
        deskripsi: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        trust_point: '',
      },
      loading: false,
      loadingRegist: false,
      dialog: false,
      showModal: false,
      selectedUserId: null,
    };
  },
  methods: {
    closeModal() {
      document.getElementById('closeModal').click();
    },
    formatDate(data_date) {
      return moment.utc(data_date).format('YYYY-MM-DD')
    },
    // async getAllUser() {
    //   this.loading = true;
    //   try {
    //     const response = await axios.get(`${BASE_URL}/getUser`, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem('access_token')
    //       }
    //     });
    //     this.users = response.data;
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async fetchBookByISBN() {
      const isbn = this.buku.isbn.trim();

      if (isbn) {
        try {
          const response = await axios.post(`${BASE_URL}/book/get-by-ISBN`, { isbn });

          const bookData = response.data; 
          this.buku.deskripsi = bookData.deskripsi;
          this.buku.penulis = bookData.penulis;
          this.buku.penerbit = bookData.penerbit;
          this.buku.tahun_terbit = bookData.tahun_terbit;
          this.buku.trust_point = bookData.trust_point;

        } catch (error) {
          console.error('Error fetching book by ISBN:', error);
        } 
      }
    },
    async onSubmit() {
      this.loadingRegist = true;
      try {
        const response = await axios.post(`${BASE_URL}/register`, {
          name: this.register.name,
          email: this.register.email,
          password: this.register.password
        });
        this.getAllUser();
        this.$notify({
          type: 'success',
          title: 'Success',
          text: response.data.message,
          color: 'green'
        });
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
        this.loadingRegist = false;
        this.clearForm();
        this.closeModal();
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
      this.buku.judul = '';
      this.buku.deskripsi = '';
      this.buku.penulis = '';
      this.buku.penerbit = '';
      this.buku.tahun_terbit = '';
      this.buku.trust_point = '';
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
    // this.getAllUser();
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
                <h6 class="mb-0">List Buku Dipinjamkan</h6>
                <argon-button data-bs-toggle="modal" data-bs-target="#exampleModal"><i
                    class="fa fa-plus text-white text-sm opacity-10"></i> Pinjamkan Buku</argon-button>
              </div>
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title text-black" id="userModalLabel">Informasi Buku</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        id="closeModal"></button>
                    </div>
                    <form role="form" @submit.prevent="onSubmit">
                      <div class="modal-body">
                        <div class="row">
                          <div class="col">
                            <h3>Upload Buku Anda</h3>
                            <p>Buku yang kamu upload akan menjadi publik, dan orang lain yang melihat dapat meminjam
                              buku yang kamu upload</p>
                          </div>
                          <div class="col">
                            <div class="row">
                              <a>ISBN Buku</a>
                              <argon-input type="text" placeholder="ISBN Buku" v-model="buku.isbn" @input="fetchBookByISBN" />
                            </div>
                            <div class="row">
                              <a>Judul Buku</a>
                              <argon-input type="text" placeholder="Judul Buku " v-model="buku.judul" />
                            </div>
                            <div class="row">
                              <a>Deskripsi</a>
                              <argon-input type="text" size="lg" placeholder="Deskripsi Buku"
                                v-model="buku.deskripsi" />
                            </div>
                            <div class="row">
                              <a>Penulis</a>
                              <argon-input type="text" placeholder="Penulis" v-model="buku.penulis" />
                            </div>
                            <div class="row">
                              <a>Penerbit</a>
                              <argon-input type="text" placeholder="Penerbit" v-model="buku.penerbit" />
                            </div>
                            <div class="row">
                              <a>Tahun Terbit</a>
                              <argon-input type="date" placeholder="Tahun Terbit" v-model="buku.tahun_terbit" />
                            </div>
                            <div class="row">
                              <a>Trust Point</a>
                              <argon-input type="text" placeholder="Trust Point" v-model="buku.trust_point" />
                            </div>
                          </div>
                        </div>
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
              <div class="card-body px-0 pt-0 pb-2">
                <div v-if="loading" class="divider">
                  <v-progress-linear indeterminate></v-progress-linear>
                </div>
                <div v-else-if="users.length === 0" class="text-center mt-3">
                  <p>Kamu tidak memiliki buku yang siap dipinjamkan</p>
                </div>
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
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Author
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Penerbit
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Tahun Terbit
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Trust Point</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(user, index) in users" :key="index">
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
                              <h6 class="mb-0 text-sm">{{ user.name }}</h6>
                              <p class="text-xs text-secondary mb-0">
                                {{ user.email }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p class="text-xs font-weight-bold mb-0">+62</p>
                          <p class="text-xs text-secondary mb-0">{{ user.no_telp }}</p>
                        </td>
                        <td class="align-middle text-center text-sm">
                          <span class="badge badge-sm bg-gradient-success">{{ user.role }}</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ formatDate(user.created_at) }}</span>
                        </td>
                        <td class="align-middle">
                          <span class="mx-3" style="font-size: 1rem; cursor: pointer;" @click="editUser(user.id)">
                            <span style="color: green;">
                              <i class="fa fa-pencil-square-o"></i>
                            </span>
                          </span>
                          <span style="font-size: 1rem; cursor: pointer;" @click="openDeleteConfirmation(user.id)">
                            <span style="color: red;">
                              <i class="fa fa-trash"></i>
                            </span>
                          </span>
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
