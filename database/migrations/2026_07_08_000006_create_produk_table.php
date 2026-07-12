<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->unsignedInteger('id_produk', true);
            $table->unsignedInteger('kategori_id');
            $table->unsignedInteger('diskon_id')->nullable();
            $table->string('nama_produk', 30);
            $table->text('deskripsi')->nullable();
            $table->decimal('harga', 12, 2);
            $table->unsignedInteger('stok');
            $table->timestamps();

            $table->foreign('kategori_id')->references('id_kategori')->on('kategori');
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
