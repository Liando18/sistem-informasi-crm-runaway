<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->integer('id_pembayaran', true);
            $table->integer('pesanan_id');
            $table->foreign('pesanan_id')->references('id_pesanan')->on('pesanan');
            $table->dateTime('tgl_bayar')->nullable();
            $table->string('metode', 30)->nullable();
            $table->decimal('jumlah', 8, 2);
            $table->string('snap_token')->nullable();
            $table->string('snap_redirect_url')->nullable();
            $table->string('midtrans_transaction_id')->nullable();
            $table->string('midtrans_status')->nullable();
            $table->enum('status', ['pending', 'sukses', 'gagal'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
