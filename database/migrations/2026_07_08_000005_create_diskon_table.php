<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diskon', function (Blueprint $table) {
            $table->unsignedInteger('id_diskon', true);
            $table->string('nama_diskon', 20);
            $table->enum('jenis_diskon', ['produk', 'voucher_ongkir'])->default('produk');
            $table->unsignedInteger('pemilik_id')->nullable();
            $table->unsignedInteger('maks_penggunaan')->nullable();
            $table->unsignedInteger('digunakan')->default(0);
            $table->enum('tipe', ['persen', 'nominal']);
            $table->decimal('nilai', 12, 2);
            $table->string('kode', 15)->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_berakhir');
            $table->decimal('min_belanja', 12, 2)->default(0);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();

            $table->foreign('pemilik_id')->references('id_akun')->on('akun')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diskon');
    }
};
