# Laporan Proyek: Nyooci - Shoe Care Service App

## 1. Ringkasan Proyek
**Nyooci** adalah aplikasi berbasis web Full Stack yang dirancang khusus untuk mempermudah bisnis jasa perawatan sepatu (shoes care). Aplikasi ini memungkinkan pelanggan untuk memesan layanan perawatan secara online dan memungkinkan admin untuk mengelola pesanan serta inventaris layanan secara efisien.

---

## 2. Teknologi yang Digunakan (Tech Stack)
Aplikasi ini dibangun menggunakan arsitektur modern MERN-ish (tanpa Node lokal yang berat, dioptimalkan untuk Cloud):
- **Frontend**: React.js (Vite), React Router DOM, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Cloud Database).
- **Autentikasi**: JWT (JSON Web Token) dengan Refresh Token sistem.
- **Keamanan**: Bcrypt.js (Enkripsi Password), Helmet, CORS.
- **UI/UX**: Custom CSS (Pop Art Style), Responsive Design.

---

## 3. Fitur Utama

### A. Fitur Pelanggan (User)
1. **Sistem Akun**: Registrasi dan Login mandiri.
2. **Katalog Layanan**: Melihat berbagai jenis perawatan (Deep Clean, Repair, Repaint, dll) lengkap dengan harga dan durasi.
3. **Booking Online**: Form pemesanan dengan fitur penjemputan (Pickup) otomatis berdasarkan alamat profil.
4. **Dashboard Pesanan**: Memantau status pengerjaan sepatu (Pending, Processing, Completed).
5. **Rating & Review**: Memberikan umpan balik setelah layanan selesai.
6. **Manajemen Profil**: Mengelola data diri dan alamat tetap.

### B. Fitur Pengelola (Admin)
1. **Statistik Bisnis**: Grafik total pesanan dan total pendapatan di dashboard utama.
2. **Manajemen Transaksi**: Melihat dan mengubah status pesanan dari seluruh pelanggan.
3. **Manajemen Layanan**: Menambah, mengedit, atau menghapus menu layanan jasa.
4. **Daftar Pengguna**: Melihat data pelanggan yang terdaftar.

---

## 4. Identitas Visual (Branding)
Website menggunakan tema warna yang selaras dengan logo **Nyooci** (Pop Art Style):
- **Sky Blue (#5dbbe3)**: Kesan bersih dan profesional.
- **Pinkish Red (#e34c67)**: Kesan energik dan modern.
- **Lime Green (#97c05c)**: Digunakan untuk indikator sukses.
- **Sun Yellow (#f9d423)**: Digunakan untuk elemen sorotan/perhatian.

---

## 5. Struktur Folder
```text
Nyooci-app/
├── backend/            # Server, API, & Database Logic
│   ├── src/
│   │   ├── controllers/# Logika bisnis tiap fitur
│   │   ├── models/     # Skema database (User, Service, Booking)
│   │   ├── routes/     # Jalur akses API
│   │   └── app.js      # Konfigurasi server utama
├── frontend/           # Tampilan Website (React)
│   ├── src/
│   │   ├── components/ # Komponen UI reusable
│   │   ├── pages/      # Halaman website
│   │   └── utils/      # Helper API & Konfigurasi
└── public/             # Asset gambar & logo
```

---

## 6. Panduan Menjalankan Aplikasi

### Persyaratan:
- Node.js terinstal.
- Koneksi internet (untuk MongoDB Atlas).

### Langkah-langkah:
1. **Persiapan Database**:
   - Jalankan `cd backend` lalu `npm run seed` untuk mengisi data layanan awal.
2. **Menjalankan Backend**:
   - Di folder `backend`, jalankan `npm run dev`. (Server di port 5000).
3. **Menjalankan Frontend**:
   - Buka terminal baru, masuk ke folder `frontend`, jalankan `npm run dev`. (Website di port 3000).

---

## 7. Kredensial Akses Admin (Default)
- **Email**: `admin@nyooci.com`
- **Password**: `admin123`

---
**Dibuat Oleh**: Nyooci Dev Team
**Tanggal**: 29 April 2026
