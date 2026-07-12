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
            'email' => 'admin@gmail.com',
            'password' => 'admin',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        Akun::create([
            'nama' => 'Owner',
            'email' => 'owner@gmail.com',
            'password' => 'owner',
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        Akun::create([
            'nama' => 'Pelanggan 1',
            'email' => 'pelanggan1@gmail.com',
            'password' => 'pelanggan1',
            'role' => 'pelanggan',
            'email_verified_at' => now(),
        ]);

        Akun::create([
            'nama' => 'Pelanggan 2',
            'email' => 'pelanggan2@gmail.com',
            'password' => 'pelanggan2',
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
