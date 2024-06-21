# YaDipinjam

Aplikasi YaDipinjam merupakan aplikasi perpustakaan kolektif berbasis web yang dirancang
dimana pengguna dapat meminjamkan buku miliknya kepada sesama pengguna dan juga dapat
meminjam buku milik pengguna lain. Aplikasi ini akan menggunakan konsep authentikasi dengan
dua tingkatan role yaitu pengguna dan admin yang memiliki hak berbeda. Penguna dengan role
pengguna akan dapat melakukan peminjaman buku, penambahan buku, dan aksi yang bersifat
management terhadap buku mereka, seperti pengubahan data buku, dan penghapusan.
Sedangkan pengguna dengan role admin bertanggung jawab atas konfirmasi beberapa aksi yang
dilakukan oleh pengguna seperti konfirmasi buku yang diupload untuk memastikan bahwa buku
yang diupload bukan buku yang dilarang.

## Front End

[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/512px-Vue.js_Logo_2.svg.png" width="60" height="60" />](https://vuejs.org/)

| VueJS | 
| ----- | 
| `npm install`<br>`npm run serve` |

## Back End

[<img src="https://www.vectorlogo.zone/logos/adonisjs/adonisjs-ar21.svg" width="60" height="60" />](https://adonisjs.com/)

| AdonisTS | 
| ------- | 
| `npm install`<br>`setup .env`<br>`node ace migration:run --seed`<br>`npm run dev` |
