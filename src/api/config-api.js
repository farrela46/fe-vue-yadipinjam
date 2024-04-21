// // const BASE_URL = 'http://103.160.62.163/api';
// // const BASE_URL = 'http://127.0.0.1:8000/api';
// const BASE_URL = 'https://yadipinjam.enzo.blue/api';

// export default BASE_URL;


let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://yadipinjam.enzo.blue/api';
} else {
  BASE_URL = 'http://127.0.0.1:8000/api';
}

export default BASE_URL;