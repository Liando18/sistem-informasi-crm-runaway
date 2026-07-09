<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->integer('id_pesanan', true);
            $table->integer('akun_id');
            $table->integer('diskon_id')->nullable();
            $table->foreign('akun_id')->references('id_akun')->on('akun');
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon');
            $table->dateTime('tgl_pesanan');
            $table->enum('status', ['pending', 'dibayar', 'dipacking', 'dikirim', 'selesai', 'dibatalkan'])->default('pending');
            $table->decimal('total_harga', 8, 2);
            $table->decimal('potongan', 8, 2)->default(0);
            $table->decimal('grand_total', 8, 2);
            $table->text('catatan')->nullable();
            $table->string('provinsi', 50);
            $table->string('kabupaten', 50);
            $table->string('kecamatan', 50);
            $table->string('kelurahan', 50);
            $table->text('alamat_detail');
            $table->string('no_telp_kirim', 20);
            $table->string('latitude', 20)->nullable();
            $table->string('longitude', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
