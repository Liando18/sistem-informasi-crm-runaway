<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->integer('id_produk', true);
            $table->integer('kategori_id');
            $table->integer('diskon_id')->nullable();
            $table->foreign('kategori_id')->references('id_kategori')->on('kategori');
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon');
            $table->string('nama_produk', 30);
            $table->text('deskripsi')->nullable();
            $table->decimal('harga', 8, 2);
            $table->integer('stok');
            $table->decimal('berat', 8, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
