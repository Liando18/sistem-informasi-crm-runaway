<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimoni', function (Blueprint $table) {
            $table->unsignedInteger('id_testimoni', true);
            $table->unsignedInteger('akun_id');
            $table->unsignedInteger('produk_id');
            $table->unsignedInteger('rating');
            $table->text('komentar')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu');
            $table->timestamps();

            $table->foreign('akun_id')->references('id_akun')->on('akun');
            $table->foreign('produk_id')->references('id_produk')->on('produk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimoni');
    }
};
