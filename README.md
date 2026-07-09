# 🛒 Runaway Denim

**E-commerce SPA** toko jeans denim berbasis **Laravel 13 + Inertia.js v3 + React 19**.

## Fitur

- **Role-based access**: Pelanggan, Admin, Owner
- **Manajemen produk**: Kategori, variasi (ukuran + warna), multiple gambar, diskon
- **Keranjang & Checkout**: CRUD keranjang, form alamat (provinsi sampai kelurahan)
- **Pembayaran Midtrans**: Snap payment gateway, callback, status pembayaran
- **Pesanan**: Multi-status (pending → dibayar → dipacking → dikirim → selesai)
- **Testimoni**: Rating & komentar, moderasi admin
- **Chat**: Real-time chat antara pelanggan dan admin
- **Laporan Owner**: Stok & penjualan (cetak PDF)
- **Autentikasi**: Laravel Fortify (register, login, forgot password, verifikasi email)
- **Passkeys (WebAuthn)**: Login tanpa password
- **2FA**: Two-factor authentication via Fortify

## Tech Stack

| Bagian       | Teknologi                               |
| ------------ | --------------------------------------- |
| **Backend**  | PHP 8.3, Laravel 13                     |
| **Frontend** | React 19, TypeScript, Inertia.js v3     |
| **Styling**  | Tailwind CSS v4, Radix UI, Lucide icons |
| **Build**    | Vite 8                                  |
| **Database** | MySQL                                   |
| **Payment**  | Midtrans Snap                           |
| **Auth**     | Laravel Fortify, Passkeys               |
| **Testing**  | Pest PHP 4                              |
| **Tools**    | Laravel Pint, Larastan, Laravel Boost   |

## Requirements

- PHP ^8.3
- Composer
- Node.js 20+
- NPM
- MySQL

## Instalasi

```bash
# Clone repositori
git clone https://github.com/Liando18/sistem-informasi-crm-runaway.git runaway-denim
cd runaway-denim

# Setup environment
cp .env.example .env
# Edit .env: atur DB_DATABASE, DB_USERNAME, DB_PASSWORD, dan Midtrans keys

# Install dependencies backend & frontend
composer install
npm install

# Generate app key & migrate database
php artisan key:generate
php artisan migrate

# Seed data awal (akun + kategori)
php artisan db:seed

# Buat storage link (untuk gambar produk)
php artisan storage:link

# Build frontend
npm run build

# Jalankan
php artisan serve
# atau mode development:
npm run dev
# lalu di terminal lain:
php artisan serve
```

### Atau dengan script setup

```bash
composer run setup
```

## Akun Default (Seeder)

| Role      | Email                       | Password   |
| --------- | --------------------------- | ---------- |
| Admin     | `admin@runawaydenim.com`    | `admin123` |
| Pelanggan | `customer@runawaydenim.com` | `admin123` |
| Owner     | `owner@runawaydenim.com`    | `admin123` |

## Environment Variables (`.env`)

### Database

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=runaway_denim
DB_USERNAME=root
DB_PASSWORD=
```

### Midtrans

```
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false
```

### Email (OTP)

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### Session

```
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

## Struktur Route

### Public

| Method | URI                | Deskripsi        |
| ------ | ------------------ | ---------------- |
| GET    | `/`                | Beranda          |
| GET    | `/produk`          | Daftar produk    |
| GET    | `/produk/{produk}` | Detail produk    |
| GET    | `/tentang`         | Tentang & kontak |

### Customer (auth + verified)

| Method | URI                          | Deskripsi           |
| ------ | ---------------------------- | ------------------- |
| GET    | `/keranjang`                 | Keranjang belanja   |
| POST   | `/keranjang/tambah/{produk}` | Tambah ke keranjang |
| GET    | `/checkout`                  | Halaman checkout    |
| POST   | `/checkout/proses`           | Proses checkout     |
| GET    | `/pesanan`                   | Pesanan saya        |
| GET    | `/pesanan/{pesanan}`         | Detail pesanan      |
| POST   | `/pembayaran/snap/{pesanan}` | Midtrans Snap       |
| POST   | `/testimoni/{produk}`        | Kirim testimoni     |
| GET    | `/chat`                      | Chat dengan admin   |
| POST   | `/chat/kirim`                | Kirim pesan chat    |

### Admin (auth + verified + role:admin)

| Method | URI                               | Deskripsi             |
| ------ | --------------------------------- | --------------------- |
| GET    | `/admin/dashboard`                | Dashboard admin       |
| CRUD   | `/admin/produk`                   | Manajemen produk      |
| CRUD   | `/admin/kategori`                 | Manajemen kategori    |
| CRUD   | `/admin/diskon`                   | Manajemen diskon      |
| GET    | `/admin/pesanan`                  | Data pesanan          |
| PATCH  | `/admin/pesanan/{pesanan}/status` | Update status pesanan |
| GET    | `/admin/pelanggan`                | Data pelanggan        |
| GET    | `/admin/chat`                     | Chat dengan pelanggan |
| GET    | `/admin/testimoni`                | Moderasi testimoni    |

### Owner (auth + verified + role:owner)

| Method | URI                              | Deskripsi         |
| ------ | -------------------------------- | ----------------- |
| GET    | `/owner/dashboard`               | Dashboard owner   |
| GET    | `/owner/laporan/stok`            | Laporan stok      |
| GET    | `/owner/laporan/penjualan`       | Laporan penjualan |
| GET    | `/owner/laporan/penjualan/cetak` | Cetak PDF         |

## Scripts

```bash
# Development (serve + queue + vite)
composer run dev

# Lint & format
composer run lint         # Laravel Pint
npm run format            # Prettier
npm run lint              # ESLint

# Type checking
npm run types:check       # TypeScript
composer run types:check  # PHPStan

# Test
composer run test

# Full CI
composer run ci:check
```

## Database Structure

15 tabel utama: `akun`, `kategori`, `diskon`, `produk`, `produk_gambar`, `produk_variasi`, `keranjang`, `pesanan`, `detail_pesanan`, `pembayaran`, `testimoni`, `chat`, `password_reset_tokens`, `sessions`, `cache`, `jobs`.

Relasi kunci:

- `produk` → `kategori` (M:1), `diskon` (M:1)
- `produk` → `produk_gambar` (1:M), `produk_variasi` (1:M)
- `akun` → `keranjang` (1:M), `pesanan` (1:M), `testimoni` (1:M)
- `pesanan` → `detail_pesanan` (1:M), `pembayaran` (1:1)

## Lisensi

[MIT](LICENSE)
