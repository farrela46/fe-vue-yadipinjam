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
      showDialog: false
    };
  },
  computed: {
    formattedHarga: {
      get() {
        return this.buku.harga.toLocaleString('id-ID');
      },
      set(value) {
        const numericValue = parseInt(value.replace(/\./g, ''), 10);
        this.buku.harga = isNaN(numericValue) ? '' : numericValue;
      }
    }
  },
  methods: {
    updateHarga() {
      const numericValue = parseInt(this.formattedHarga.replace(/\./g, ''), 10);
      this.buku.harga = isNaN(numericValue) ? '' : numericValue;
    },
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
        const response = await axios.get(`${BASE_URL}/book/circulatedBook`, {
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

    async onSubmit() {
      try {
        this.loadingRegist = true;
        const year = this.extractYear(this.buku.tahun_terbit);

        const formData = new FormData();
        formData.append('ISBN', this.buku.ISBN);
        formData.append('authors', this.buku.penulis);
        formData.append('publisher', this.buku.penerbit);
        formData.append('title', this.buku.judul);
        formData.append('description', this.buku.deskripsi);
        formData.append('price', this.buku.harga);
        formData.append('year', year);

        this.selectedFiles.forEach((file, index) => {
          formData.append('image', file);
          index;
        });

        console.log('FormData before sending:', formData);

        const response = await axios.post(`${BASE_URL}/book/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });

        console.log('Upload successful:', response.data);

        this.showDialog = false,
        this.clearForm();
        this.retrieveBuku();
      } catch (error) {
        console.error('Error uploading book:', error);
      } finally {
        this.loadingRegist = false;
      }
    },

    handleFileChange(event) {
      const fileInput = event.target;
      this.selectedFiles = Array.from(fileInput.files);
    },
    async activate(id) {
      try {
        const response = await axios.get(`${BASE_URL}/book/circulated/activated/` + id, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });
        console.log(response)
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Buku siap dipinjamkan',
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
                <h6 class="mb-0">List Buku Dipinjamkan</h6>
                <argon-button @click="showDialog = true">
                  <i class="fa fa-plus text-white text-sm opacity-10"></i> Pinjamkan Buku
                </argon-button>
              </div>
              <v-dialog v-model="showDialog" max-width="800px">
                <v-card>
                  <v-card-title class="text-h5">Informasi Buku</v-card-title>
                  <v-card-text>
                    <form role="form" @submit.prevent="onSubmit">
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-4">
                            <h3>Upload Buku Anda</h3>
                            <p>Buku yang kamu upload akan menjadi publik, dan orang lain yang melihat dapat meminjam
                              buku yang kamu upload</p>
                            <div class="row">
                              <div class="col">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                  @click="handleclose">Close</button>
                              </div>
                              <div class="col">
                                <button type="submit" class="btn btn-primary">Upload</button>
                              </div>
                            </div>
                          </div>
                          <div class="col-8">
                            <div class="row">
                              <a>ISBN Buku</a>
                              <argon-input type="text" icon="fas fa-search" iconDir="left" placeholder="Cari ISBN Buku"
                                v-model="buku.ISBN" @input="fetchBookByISBN" />
                            </div>
                            <v-progress-linear v-if="loadingRegist" indeterminate></v-progress-linear>
                            <div class="row">
                              <a>ISBN Buku</a>
                              <argon-input type="text" placeholder="ISBN Buku" v-model="buku.ISBN"
                                @input="fetchBookByISBN" />
                            </div>
                            <div class="row">
                              <a>Judul Buku</a>
                              <argon-input type="text" placeholder="Judul Buku " v-model="buku.judul" />
                            </div>
                            <div class="row mb-2 px-2">
                              <a>Foto Buku</a>
                              <input type="file" class="form-control" ref="fileInput" @change="handleFileChange"
                                multiple>

                            </div>
                            <div class="row">
                              <a>Kondisi Buku</a>
                              <argon-input type="text" size="lg" placeholder="Kondisi Buku" v-model="buku.deskripsi" />
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
                              <argon-input type="date" placeholder="Tanggal Terbit" v-model="buku.tahun_terbit" />
                            </div>
                            <div class="row">
                              <a>Harga Buku</a>
                              <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">Rp.</span>
                                <input type="text" class="form-control" v-model="formattedHarga" @input="updateHarga"
                                  placeholder="Harga" aria-label="phone" aria-describedby="basic-addon1">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                          @click="handleclose">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                      </div> -->
                    </form>
                  </v-card-text>
                  <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="handleClose">Close</v-btn>
                    <v-btn color="primary" @click="onSubmit">Upload</v-btn>
                  </v-card-actions> -->
                </v-card>
                <v-progress-linear v-if="loadingRegist" indeterminate></v-progress-linear>
              </v-dialog>
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
                          Author
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Penerbit
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Verif
                        </th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Status
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
                              <h6 class="mb-0 text-sm">{{ buku.book_title }}</h6>
                              <p class="text-xs text-secondary mb-0">
                                {{ buku.ISBN }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td class="align-left text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ buku.authors }}</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ buku.publisher }}</span>
                        </td>
                        <td class="align-middle text-center">
                          <v-chip color="green">{{ buku.verified }}</v-chip>
                        </td>
                        <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">{{ buku.status }}</span>
                        </td>
                        <td class="align-middle">
                          <span class="mx-2" style="font-size: 1rem; cursor: pointer;"
                            @click="activate(buku.circulated_book_id)">
                            <span style="color: green;">
                              <i class="fas fa-paper-plane"></i>
                            </span>
                          </span>
                          <!-- <span class="mx-3" style="font-size: 1rem; cursor: pointer;" @click="editUser(user.id)">
                            <span style="color: green;">
                              <i class="fa fa-pencil-square-o"></i>
                            </span>
                          </span>
                          <span style="font-size: 1rem; cursor: pointer;" @click="openDeleteConfirmation(user.id)">
                            <span style="color: red;">
                              <i class="fa fa-trash"></i>
                            </span>
                          </span> -->
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
