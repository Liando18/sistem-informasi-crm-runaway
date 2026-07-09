<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimoni', function (Blueprint $table) {
            $table->integer('id_testimoni', true);
            $table->integer('akun_id');
            $table->integer('produk_id');
            $table->foreign('akun_id')->references('id_akun')->on('akun');
            $table->foreign('produk_id')->references('id_produk')->on('produk');
            $table->integer('rating');
            $table->text('komentar')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimoni');
    }
};
