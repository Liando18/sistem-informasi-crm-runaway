<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_pesanan', function (Blueprint $table) {
            $table->integer('id_detail', true);
            $table->integer('pesanan_id');
            $table->integer('produk_id');
            $table->integer('produk_variasi_id')->nullable();
            $table->foreign('pesanan_id')->references('id_pesanan')->on('pesanan')->cascadeOnDelete();
            $table->foreign('produk_id')->references('id_produk')->on('produk');
            $table->integer('jumlah');
            $table->decimal('harga', 8, 2);
            $table->decimal('subtotal', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_pesanan');
    }
};
