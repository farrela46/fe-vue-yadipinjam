import { createRouter, createWebHistory } from "vue-router";
import DashboardDefault from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import LandingPage from "../views/LandingPage.vue";
import AdminDashboard from "../views/admin/Dashboard.vue";
import ManageVerifikasi from "../views/admin/ManageVerifikasi.vue";
import ManageUsers from "../views/admin/ManageUsers.vue";
import Login from "../views/Loginn.vue";
import Signin from "../views/Signin.vue";

//USER
import UserDashboard from "../views/user/Dashboard.vue";
import ViewCircBook from "../views/user/ViewCircBook.vue";
import ViewPinjamBuku from "../views/user/ViewPinjamBuku.vue";
import UserPinjamkan from "../views/user/Pinjamkan.vue";
import UserPinjamkanKonfirmasi from "../views/user/KonfirmasiPinjam.vue";
import Status from "../views/user/Status.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Landing Page",
    component: LandingPage,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  //USER
  {
    path: "/dashboard",
    name: "Catalogue",
    component: UserDashboard,
  },
  {
    path: '/pinjam/:isbn',
    name: 'Pinjam Buku',
    component: ViewCircBook,
  },
  {
    path: '/pinjam/:isbn/:id',
    name: 'Detail Pinjam Buku',
    component: ViewPinjamBuku,
  },
  {
    path: "/pinjamkan",
    name: "Pinjamkan Buku",
    component: UserPinjamkan,
  },
  {
    path: "/pinjamkan/konfirmasi",
    name: "Konfirmasi Pinjamkan Buku",
    component: UserPinjamkanKonfirmasi,
  },
  {
    path: "/status",
    name: "Status",
    component: Status,
  },

  //ADMIN
  {
    path: "/admin/dashboard",
    name: "Admin Dashboard",
    component: AdminDashboard,
  },
  {
    path: "/admin/Verifikasi",
    name: "Verifikasi Buku",
    component: ManageVerifikasi,
  },
  {
    path: "/admin/manageusers",
    name: "Manage Users",
    component: ManageUsers,
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: DashboardDefault,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  // {
  //   path: "/signup",
  //   name: "Signup",
  //   component: Signup,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
