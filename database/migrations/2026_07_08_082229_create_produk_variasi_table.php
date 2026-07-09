<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_variasi', function (Blueprint $table) {
            $table->integer('id_produk_variasi', true);
            $table->integer('produk_id');
            $table->foreign('produk_id')->references('id_produk')->on('produk')->cascadeOnDelete();
            $table->string('ukuran', 20);
            $table->string('warna', 30);
            $table->integer('stok');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_variasi');
    }
};
