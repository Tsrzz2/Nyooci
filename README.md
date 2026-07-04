# Nyooci - Premium Shoe Care Service

Aplikasi web untuk layanan perawatan sepatu profesional dengan sistem booking online.

## Teknologi yang Digunakan:
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Frontend: React.js, Vite
- Deployment: Vercel
- Documentation: Swagger UI

## Fitur Utama

- Autentikasi (Register, Login, Logout)
- CRUD Layanan
- CRUD Booking (Booking Layanan)
- Dashboard Admin
- Dashboard User
- Analytics dan Statistik
- Sistem Antar Jemput
- Caching (memory-cache)

## Cara Menjalankan Secara Lokal

### 1. Instal Semua Dependency

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Setup Environment Variables
Buat file `.env` di folder `backend` dengan isi seperti di bawah ini:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nyooci
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### 3. Jalankan Seed Data
Untuk memasukkan data layanan awal:
```bash
cd backend
npm run seed
```

### 4. Jalankan Server

#### Backend
```bash
cd backend
npm run dev
```
Backend berjalan di `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```
Frontend berjalan di `http://localhost:3000`

## Dokumentasi API

Anda bisa melihat dokumentasi API di `http://localhost:5000/api-docs`

### Auth
- POST /api/auth/register - Mendaftarkan user baru
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Mendapatkan user yang sedang login

### Services
- GET /api/services - Mendapatkan daftar layanan aktif
- GET /api/services/:id - Mendapatkan layanan berdasarkan ID
- POST /api/services (Admin Only) - Membuat layanan baru
- PUT /api/services/:id (Admin Only) - Memperbarui layanan
- DELETE /api/services/:id (Admin Only) - Menghapus layanan

### Bookings
- POST /api/bookings - Membuat booking baru
- GET /api/bookings/my-bookings - Mendapatkan booking user yang sedang login
- GET /api/bookings/stats (Admin Only) - Mendapatkan statistik booking
- GET /api/bookings (Admin Only) - Mendapatkan semua booking
- GET /api/bookings/:id - Mendapatkan booking berdasarkan ID
- PUT /api/bookings/:id/status - Memperbarui status booking
- PUT /api/bookings/:id/cancel - Membatalkan booking

## Akses Awal

Untuk mengakses Dashboard Admin, Anda perlu:
1. Mendaftarkan user baru via Register
2. Ubah role user di database menjadi `admin` di MongoDB
