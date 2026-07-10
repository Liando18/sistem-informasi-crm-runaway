<?php

use App\Http\Controllers\Admin\AkunController as AdminAkunController;
use App\Http\Controllers\Admin\ChatController as AdminChatController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DiskonController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PembayaranController as AdminPembayaranController;
use App\Http\Controllers\Admin\PesananController as AdminPesananController;
use App\Http\Controllers\Admin\ProdukController as AdminProdukController;
use App\Http\Controllers\Admin\TestimoniController as AdminTestimoniController;
use App\Http\Controllers\Auth\OtpRegisterController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\LaporanController;
use App\Http\Controllers\Owner\PelangganController as OwnerPelangganController;
use App\Http\Controllers\Owner\TestimoniController as OwnerTestimoniController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\TentangController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\WilayahController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
Route::get('/produk/{produk}', [ProdukController::class, 'show'])->name('produk.show');

Route::get('/tentang', [TentangController::class, 'index'])->name('tentang');
Route::permanentRedirect('/kontak', '/tentang');

Route::get('/register', fn () => inertia('auth/register'))->name('register');
Route::post('/register/send-otp', [OtpRegisterController::class, 'sendOtp'])->name('register.step1');
Route::post('/register/verify-otp', [OtpRegisterController::class, 'verifyOtp'])->name('register.step2');
Route::post('/register/complete', [OtpRegisterController::class, 'complete'])->name('register.complete');

// Authenticated customer routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'pelanggan') {
            return to_route('produk.index');
        }
        if (auth()->user()->role === 'admin') {
            return to_route('admin.dashboard');
        }
        if (auth()->user()->role === 'owner') {
            return to_route('owner.dashboard');
        }

        return inertia('dashboard');
    })->name('dashboard');

    Route::post('/keranjang/tambah/{produk}', [KeranjangController::class, 'tambah'])->name('keranjang.tambah');
    Route::get('/keranjang', [KeranjangController::class, 'index'])->name('keranjang.index');
    Route::patch('/keranjang/{keranjang}', [KeranjangController::class, 'update'])->name('keranjang.update');
    Route::delete('/keranjang/{keranjang}', [KeranjangController::class, 'hapus'])->name('keranjang.hapus');

    Route::get('/checkout', [PesananController::class, 'checkout'])->name('checkout');
    Route::post('/checkout/proses', [PesananController::class, 'prosesCheckout'])->name('checkout.proses');
    Route::get('/pesanan', [PesananController::class, 'index'])->name('pesanan.index');
    Route::get('/pesanan/{pesanan}', [PesananController::class, 'show'])->name('pesanan.show');
    Route::get('/pesanan/{pesanan}/invoice', [PesananController::class, 'invoice'])->name('pesanan.invoice');

    Route::get('/pembayaran/pilih/{pesanan}', [PembayaranController::class, 'pilihMetode'])->name('pembayaran.pilih');
    Route::get('/pembayaran/snap/{pesanan}', [PembayaranController::class, 'snap'])->name('pembayaran.snap');
    Route::post('/pembayaran/callback', [PembayaranController::class, 'callback'])->name('pembayaran.callback');
    Route::post('/pembayaran/{pembayaran}/confirm', [PembayaranController::class, 'confirm'])->name('pembayaran.confirm');
    Route::get('/pembayaran/sukses/{pesanan}', [PembayaranController::class, 'sukses'])->name('pembayaran.sukses');

    Route::post('/testimoni/{produk}', [TestimoniController::class, 'store'])->name('testimoni.store');
    Route::get('/testimoni/saya', [TestimoniController::class, 'saya'])->name('testimoni.saya');

    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/messages', [ChatController::class, 'messagesJson'])->name('chat.messages');
    Route::post('/chat/kirim', [ChatController::class, 'kirim'])->name('chat.kirim');

    Route::get('/wilayah/provinsi', [WilayahController::class, 'provinsi'])->name('wilayah.provinsi');
    Route::get('/wilayah/kabupaten/{provinsi}', [WilayahController::class, 'kabupaten'])->name('wilayah.kabupaten');
    Route::get('/wilayah/kecamatan/{kabupaten}', [WilayahController::class, 'kecamatan'])->name('wilayah.kecamatan');
    Route::get('/wilayah/kelurahan/{kecamatan}', [WilayahController::class, 'kelurahan'])->name('wilayah.kelurahan');
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('kategori', KategoriController::class);
    Route::resource('produk', AdminProdukController::class);
    Route::resource('diskon', DiskonController::class);
    Route::post('/diskon/ongkir-setting', [DiskonController::class, 'updateOngkirSetting'])->name('diskon.ongkir-setting');

    Route::get('/pesanan', [AdminPesananController::class, 'index'])->name('pesanan.index');
    Route::get('/pesanan/{pesanan}', [AdminPesananController::class, 'show'])->name('pesanan.show');
    Route::patch('/pesanan/{pesanan}/status', [AdminPesananController::class, 'updateStatus'])->name('pesanan.status');

    Route::get('/pembayaran', [AdminPembayaranController::class, 'index'])->name('pembayaran.index');
    Route::patch('/pembayaran/{pembayaran}/konfirmasi', [AdminPembayaranController::class, 'konfirmasi'])->name('pembayaran.konfirmasi');

    Route::get('/testimoni', [AdminTestimoniController::class, 'index'])->name('testimoni.index');
    Route::patch('/testimoni/{testimoni}/status', [AdminTestimoniController::class, 'updateStatus'])->name('testimoni.status');
    Route::delete('/testimoni/{testimoni}', [AdminTestimoniController::class, 'destroy'])->name('testimoni.destroy');

    Route::get('/chat', [AdminChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{akun}', [AdminChatController::class, 'show'])->name('chat.show');
    Route::get('/chat/{akun}/messages', [AdminChatController::class, 'messagesJson'])->name('chat.messages');
    Route::post('/chat/kirim', [AdminChatController::class, 'kirim'])->name('chat.kirim');

    Route::get('/pelanggan', [AdminAkunController::class, 'index'])->name('pelanggan.index');
    Route::get('/pelanggan/{akun}', [AdminAkunController::class, 'show'])->name('pelanggan.show');
});

// Owner routes
Route::middleware(['auth', 'verified', 'role:owner'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/laporan/stok', [LaporanController::class, 'stok'])->name('laporan.stok');
    Route::get('/laporan/stok/cetak', [LaporanController::class, 'cetakStok'])->name('laporan.stok.cetak');
    Route::get('/laporan/penjualan', [LaporanController::class, 'penjualan'])->name('laporan.penjualan');
    Route::get('/laporan/penjualan/cetak', [LaporanController::class, 'cetakPenjualan'])->name('laporan.penjualan.cetak');

    Route::get('/pelanggan', [OwnerPelangganController::class, 'index'])->name('pelanggan.index');
    Route::get('/pelanggan/{akun}', [OwnerPelangganController::class, 'show'])->name('pelanggan.show');

    Route::get('/testimoni', [OwnerTestimoniController::class, 'index'])->name('testimoni.index');
    Route::patch('/testimoni/{testimoni}/status', [OwnerTestimoniController::class, 'updateStatus'])->name('testimoni.status');
    Route::delete('/testimoni/{testimoni}', [OwnerTestimoniController::class, 'destroy'])->name('testimoni.destroy');
});

require __DIR__.'/settings.php';
