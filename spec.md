# Sistem Absensi Online - Pesantren Daarul 'Uluum Lido

## Overview
Aplikasi sistem absensi online untuk Pesantren Daarul 'Uluum Lido dengan sistem multi-user yang mendukung tiga peran: Santri, Ustadz, dan Admin. Aplikasi menggunakan bahasa Indonesia sebagai bahasa utama.

## User Roles & Authentication
- **Santri**: Dapat mengisi absensi harian
- **Ustadz**: Dapat melihat daftar kehadiran santri
- **Admin**: Dapat mengelola akun pengguna dan melihat seluruh data absensi

## Core Features

### Login System
- Multi-user authentication dengan tiga tingkat akses
- Dashboard yang berbeda sesuai peran pengguna
- Session management untuk maintain login state

### Santri Dashboard
- Form absensi dengan field:
  - Nama
  - ID Santri
  - Kelas
  - Tanggal
  - Status Kehadiran (Hadir/Tidak Hadir/Izin/Sakit)
- Notifikasi sukses/gagal setelah pengiriman data
- Integrasi dengan Google Apps Script endpoint untuk pengiriman data

### Ustadz Dashboard
- Tabel daftar kehadiran santri
- Filter berdasarkan tanggal dan kelas
- View data absensi dalam format yang mudah dibaca

### Admin Dashboard
- Manajemen akun pengguna (tambah, edit, hapus)
- Monitoring seluruh data absensi
- Overview statistik kehadiran

## Technical Requirements

### Backend (Motoko)
- User management system dengan penyimpanan data pengguna
- Authentication functions untuk login dan role verification
- Data persistence untuk user accounts dan login sessions

### Frontend (React + TypeScript)
- Responsive design untuk mobile dan desktop
- Clean, simple UI dengan card layout dan warna lembut
- HTTP integration untuk mengirim data absensi ke Google Apps Script endpoint:
  `https://script.google.com/macros/s/AKfycbw24x-uyRwP2PJBvNm_SntMFbgstizxoI_Z6LukL7uM1BOq6A35lBsu1axIwCtygwTH/exec`

## Data Storage
Backend menyimpan:
- User accounts dengan role assignments
- Login sessions dan authentication state
- User profile information

## UI/UX Guidelines
- Desain sederhana dan bersih
- Card-based layout yang ringan
- Warna-warna lembut dan intuitif
- Fully responsive untuk semua device sizes
- Bahasa Indonesia untuk seluruh konten aplikasi
