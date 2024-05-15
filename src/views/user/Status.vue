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
      status: [],
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
      loading: false,
      loadingRegist: false,
      dialog: false,
      showModal: false,
      selectedUserId: null,
      activeTab: 'Semua',
    };
  },
  computed: {
    filteredStatus() {
      if (this.activeTab === 'Semua') {
        return this.status;
      }
      return this.status.filter(item => item.status.toLowerCase() === this.activeTab.toLowerCase());
    }
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
    async getStatus(status = '') {
      this.showDialog = true;
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${BASE_URL}/rent/renter-status`, {
          params: {
            type: status
          },
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.status = response.data.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        this.showDialog = false;
      }
    },

    toggleTab(tab) {
      this.activeTab = tab;
      this.getStatus(tab === 'Semua' ? '' : tab.toLowerCase());
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

        this.closeModal();
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
    this.getStatus('');
  },
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-md-12 col-12">
            <div class="row px-2">
              <div class="col-md-12 bg-white" style="border-radius: 10px;">
                <div class="row">
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Semua' }"
                    @click="toggleTab('Semua')">
                    Semua
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Pending' }"
                    @click="toggleTab('Pending')">
                    Pending
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Confirmed' }"
                    @click="toggleTab('Confirmed')">
                    Confirmed
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Overdue' }"
                    @click="toggleTab('Overdue')">
                    Overdue
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Returned' }"
                    @click="toggleTab('Returned')">
                    Returned
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Checking' }"
                    @click="toggleTab('Checking')">
                    Checking
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Complete' }"
                    @click="toggleTab('Complete')">
                    Complete
                  </div>
                </div>
              </div>
            </div>
            <div class="card  mt-2 pb-2">
              <div class="table-responsive p-0">
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
                        Pemilik
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Mulai Peminjaman
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Status
                      </th>
                      <th class="text-left text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(status, index) in status" :key="index">
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
                            <h6 class="mb-0 text-sm">{{ status.title }}</h6>
                            <p class="text-xs text-secondary mb-0">
                              {{ status.ISBN }}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="align-left text-center">
                        <span class="text-secondary text-xs font-weight-bold">{{ status.username }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">{{ formatDate(status.start_date) }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">
                          <v-chip>
                            {{ status.status }}
                          </v-chip>
                          </span>
                      </td>
                      <td class="align-middle">
                        <span class="mx-2" style="font-size: 1rem; cursor: pointer;"
                          @click="activate(buku.circulated_book_id)">
                          <span style="color: green;">
                            <i class="fas fa-paper-plane"></i>
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
<style>
.ls-transaction {
  padding-top: 20px;
  padding-bottom: 20px;
}

.pending {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: black;
  font-weight: 600;
  text-decoration: none;
  background-color: yellow;
}

.confirmed {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: black;
  font-weight: 600;
  text-decoration: none;
  background-color: rgb(120, 211, 0);
}

.overdue {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  background-color: red;
}

.returned {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  background-color: orange;
}

.checking {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: 600;
  font-weight: bold;
  text-decoration: none;
  background-color: lightgreen;
}

.complete {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: 600;
  font-weight: bold;
  text-decoration: none;
  background-color: green;
}

.tablist {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.tab-active {
  border-bottom: 5px solid #DE5B54;
}
</style>
