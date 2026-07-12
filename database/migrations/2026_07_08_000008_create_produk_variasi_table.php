<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_variasi', function (Blueprint $table) {
            $table->unsignedInteger('id_produk_variasi', true);
            $table->unsignedInteger('produk_id');
            $table->string('ukuran', 20);
            $table->string('warna', 20);
            $table->unsignedInteger('stok');
            $table->timestamps();

            $table->foreign('produk_id')->references('id_produk')->on('produk')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_variasi');
    }
};
