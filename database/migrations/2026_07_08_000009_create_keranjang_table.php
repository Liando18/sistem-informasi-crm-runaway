<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keranjang', function (Blueprint $table) {
            $table->unsignedInteger('id_keranjang', true);
            $table->unsignedInteger('akun_id');
            $table->unsignedInteger('produk_id');
            $table->unsignedInteger('produk_variasi_id')->nullable();
            $table->unsignedInteger('jumlah');
            $table->timestamps();

            $table->foreign('akun_id')->references('id_akun')->on('akun');
            $table->foreign('produk_id')->references('id_produk')->on('produk');
            $table->foreign('produk_variasi_id')->references('id_produk_variasi')->on('produk_variasi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keranjang');
    }
};
