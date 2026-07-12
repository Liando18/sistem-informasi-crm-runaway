<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_pesanan', function (Blueprint $table) {
            $table->unsignedInteger('id_detail', true);
            $table->unsignedInteger('pesanan_id');
            $table->unsignedInteger('produk_id');
            $table->unsignedInteger('produk_variasi_id')->nullable();
            $table->unsignedInteger('jumlah');
            $table->decimal('harga', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();

            $table->foreign('pesanan_id')->references('id_pesanan')->on('pesanan')->cascadeOnDelete();
            $table->foreign('produk_id')->references('id_produk')->on('produk');
            $table->foreign('produk_variasi_id')->references('id_produk_variasi')->on('produk_variasi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_pesanan');
    }
};
