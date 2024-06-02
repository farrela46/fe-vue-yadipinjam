<script>
import axios from "axios";
import BASE_URL from '@/api/config-api';
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
// import ArgonButton from "@/components/ArgonButton.vue";
// import ArgonInput from "@/components/ArgonInput.vue";
import moment from 'moment';




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
      showReturnDialog: false,
      star: 0,
      feedback: '',
      starPemilik: '',
      feedbackpemilik: '',
      currentBookId: null,
      selectedBook: {}
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
    handleFileChange(event) {
      const fileInput = event.target;
      this.selectedFiles = Array.from(fileInput.files);
    },
    async openReturnDialog(book) {
      this.selectedBook = book;
      this.showReturnDialog = true;
    },
    async submitReview() {
      try {
        const token = localStorage.getItem('access_token');

        await axios.post(`${BASE_URL}/review/book`, {
          star: this.star,
          review: this.feedback,
          circulated_ID: this.selectedBook.ID_user
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        await axios.post(`${BASE_URL}/review/owner`, {
          star: this.starPemilik,
          feedback: this.feedbackPemilik,
          to: this.selectedBook.ID_user
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });


        await axios.post(`${BASE_URL}/rent/return`, {
          rent_ID: this.selectedBook.id
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.showReturnDialog = false;
        this.star = 0;
        this.feedback = '';
        this.starPemilik = 0;
        this.feedbackPemilik = '';
        this.selectedBook = {};
        this.getStatus('');
      } catch (error) {
        console.error('Error submitting review or returning book:', error);
      }
    },
    async returned(id) {
      try {
        const formData = new FormData();
        formData.append('rent_ID', id);

        const response = await axios.post(`${BASE_URL}/rent/return`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Request pengembalian terkirim!',
          color: 'green'
        });
        console.log(response);
        this.getStatus('');
      } catch (error) {
        console.error(error);
      }
    },
    async confirmRent(id) {
      try {
        const formData = new FormData();
        formData.append('rent_ID', id);

        const response = await axios.post(`${BASE_URL}/rent/confirmRent`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });
        this.getStatus('');
        console.log(response);
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Book has been confirmed in your hand',
          color: 'green'
        });
      } catch (error) {
        console.error(error);
      }
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
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Rented' }"
                    @click="toggleTab('Rented')">
                    Rented
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Returned' }"
                    @click="toggleTab('Returned')">
                    Returned
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Checking' }"
                    @click="toggleTab('Checking')">
                    Checking
                  </div>
                  <div :class="{ 'col': true, 'tablist': true, 'tab-active': activeTab === 'Overdue' }"
                    @click="toggleTab('Overdue')">
                    Overdue
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
                        <v-tooltip text="Request Kembalikan Buku" location="top">
                          <template v-slot:activator="{ props }">
                            <span v-bind="props" v-if="status.status === 'rented'" class="mx-2"
                              style="font-size: 1rem; cursor: pointer;" @click="openReturnDialog(status)">
                              <span style="color: green;">
                                <i class="fas fa-undo-alt"></i>
                              </span>
                              Kembalikan
                            </span>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Konfirmasi Buku Diterima" location="top">
                          <template v-slot:activator="{ props }">
                            <span v-bind="props" v-if="status.status === 'confirmed'" class="mx-2"
                              style="font-size: 1rem; cursor: pointer;" @click="confirmRent(status.id)">
                              <span style="color: green;">
                                <i class="fas fa-check-circle"></i>
                              </span>
                              Buku Diterima
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
        <v-dialog v-model="showReturnDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h5">Review Buku</v-card-title>
            <v-card-text>
              <div>Judul Buku: {{ selectedBook.title }}</div>
              <div>ISBN: {{ selectedBook.ISBN }}</div>
              <div>Pemilik Buku: {{ selectedBook.username }}</div>
              <div class="text-center">
                <v-rating v-model="star" active-color="blue" color="orange-lighten-1"></v-rating>
              </div>
              <div class="row">
                <div class="form-floating">
                  <textarea class="form-control" v-model="feedback" placeholder="Berikan Feedback"
                    id="floatingTextarea2" style="height: 300px"></textarea>
                  <label for="floatingTextarea2">Berikan Feedback</label>
                </div>
              </div>
              <hr class="horizontal dark">
              <div class="row">
                <h5>Review Pemilik Buku</h5>
              </div>
              <div class="text-center">
                <v-rating v-model="starPemilik" active-color="blue" color="orange-lighten-1"></v-rating>
              </div>
              <div class="row">
                <div class="form-floating">
                  <textarea class="form-control" v-model="feedbackPemilik" placeholder="Berikan Feedback"
                    id="floatingTextarea2" style="height: 100px"></textarea>
                  <label for="floatingTextarea2">Berikan Feedback Untuk Pemilik</label>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showReturnDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="submitReview">Review</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
