<?php

namespace Database\Seeders;

use App\Models\Akun;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Akun::create([
            'nama' => 'Admin',
            'email' => 'admin@runawaydenim.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        Akun::create([
            'nama' => 'Owner',
            'email' => 'owner@runawaydenim.com',
            'password' => bcrypt('admin123'),
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        Akun::create([
            'nama' => 'Pelanggan',
            'email' => 'customer@runawaydenim.com',
            'password' => bcrypt('admin123'),
            'role' => 'pelanggan',
            'email_verified_at' => now(),
        ]);

        Kategori::create(['nama_kategori' => 'Jeans Pria', 'deskripsi' => 'Koleksi jeans pria berkualitas']);
        Kategori::create(['nama_kategori' => 'Jeans Wanita', 'deskripsi' => 'Koleksi jeans wanita trendi']);
        Kategori::create(['nama_kategori' => 'Jaket Denim', 'deskripsi' => 'Jaket bahan denim kekinian']);
        Kategori::create(['nama_kategori' => 'Aksesoris', 'deskripsi' => 'Aksesoris pelengkap denim']);
        Kategori::create(['nama_kategori' => 'Chinos & Celana Pendek', 'deskripsi' => 'Celana kasual bahan chinos']);
    }
}
