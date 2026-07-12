<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->unsignedInteger('id_pesanan', true);
            $table->unsignedInteger('akun_id');
            $table->unsignedInteger('diskon_id')->nullable();
            $table->dateTime('tgl_pesanan');
            $table->enum('status', ['pending', 'dibayar', 'dipacking', 'dikirim', 'selesai', 'dibatalkan'])->default('pending');
            $table->decimal('total_harga', 12, 2);
            $table->decimal('potongan', 12, 2)->default(0);
            $table->decimal('ongkir', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->text('catatan')->nullable();
            $table->string('provinsi', 30);
            $table->string('kabupaten', 30);
            $table->string('kecamatan', 30);
            $table->string('kelurahan', 30);
            $table->text('alamat_detail');
            $table->string('no_telp_kirim', 20);
            $table->string('latitude', 20)->nullable();
            $table->string('longitude', 20)->nullable();
            $table->timestamps();

            $table->foreign('akun_id')->references('id_akun')->on('akun');
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
