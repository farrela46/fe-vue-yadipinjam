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
      activeTab: 'Semua',
    };
  },
  computed: {
    statusOptions() {
      return ['proccess', 'canceled', 'shipping', 'received', 'unpaid'];
    },
    filteredTransactions() {
      if (this.selectedTab === 'Semua') {
        return this.transactions;
      } else {
        return this.transactions.filter(transaction => transaction.status === this.selectedTab);
      }
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
    async getTransactions(status = '') {
      this.showDialog = true
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(BASE_URL + '/all-transactions', {
          params: {
            status: status
          },
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.transactions = response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        this.showDialog = false
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
    toggleTab(tab) {
      this.activeTab = tab;

      switch (tab) {
        case 'Belum Bayar':
          this.getTransactions('unpaid');
          break;
        case 'Proses':
          this.getTransactions('proccess');
          break;
        case 'Dikirim':
          this.getTransactions('shipping');
          break;
        case 'Diterima':
          this.getTransactions('received');
          break;
        case 'Dibatalkan':
          this.getTransactions('canceled');
          break;
        default:
          this.getTransactions(); // For default tab 'Semua', no status parameter is passed
      }
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
            <div class="row">
              <div class="col-md-12 bg-white" style="border-radius: 10px;">
                <div class="row">
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Semua' }"
                    @click="toggleTab('Semua')">
                    Semua
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Pending' }"
                    @click="toggleTab('Belum Bayar')">
                    Pending
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'On Going' }"
                    @click="toggleTab('Proses')">
                    On Going
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Finish' }"
                    @click="toggleTab('Dikirim')">
                    Finish
                  </div>
                </div>
              </div>
              <div class="col-md-12 bg-white mt-4" style="border-radius: 10px;">
                <div class="row px-3 py-2">
                  <div class="col">
                    <a style=" font-size: 18px;"> No</a>
                  </div>
                  <div class="col">
                    <a style=" font-size: 18px;"> Title</a>
                  </div>
                  <div class="col">
                    <a style=" font-size: 18px;"> Author</a>
                  </div>
                  <div class="col">
                    <a style=" font-size: 18px;"> publisher</a>
                  </div>
                  <div class="col d-flex justify-content-center align-items-center">
                    <a style=" font-size: 18px;"> Status </a>
                  </div>
                  <div class="col d-flex justify-content-center align-items-center">
                    <a style=" font-size: 18px;"> Action </a>
                  </div>
                </div>
              </div>
              <div class="col-md-12 bg-white mt-2" v-for="(transaction, index) in transactions" :key="index"
                style="cursor: pointer;">
                <div class="row px-3 ls-transaction" @click="goToTransactionDetail(transaction.id)">
                  <div class="col">
                    <a style="font-size: 18px; font-weight: bold;">#{{ transaction.id }}</a>
                  </div>
                  <div class="col">
                    <a style="font-size: 18px;">{{ transaction.user.name }}</a>
                  </div>
                  <div class="col">
                    <a style="font-size: 18px;">Rp. {{ formatPrice(transaction.total) }}</a>
                  </div>
                  <div class="col">
                    <a style="font-size: 18px;">{{ formatDate(transaction.created_at) }}</a>
                  </div>
                  <div class="col d-flex justify-content-center align-items-center">
                    <a :class="getClassForStatus(transaction.status)" style="font-size: 18px;">{{ transaction.status
                      }}</a>
                  </div>
                  <div class="col d-flex justify-content-center align-items-cente">
                    <v-icon size="large" class="me-2" @click.stop="editStatus(index)" color="blue">
                      mdi-pencil-circle-outline
                    </v-icon>
                  </div>
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
<style>
.ls-transaction {
  padding-top: 20px;
  padding-bottom: 20px;
}

.proccess {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: black;
  font-weight: 600;
  text-decoration: none;
  background-color: yellow;
}

.shipping {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: black;
  font-weight: 600;
  text-decoration: none;
  background-color: yellow;
}

.unpaid {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  background-color: orange;
}

.canceled {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  background-color: red;
}

.received {
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  color: 600;
  font-weight: bold;
  text-decoration: none;
  background-color: lightgreen;
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
  border-bottom: 5px solid #D0011B;
}
</style>
