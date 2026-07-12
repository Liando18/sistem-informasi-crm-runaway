<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->unsignedInteger('id_pembayaran', true);
            $table->unsignedInteger('pesanan_id');
            $table->dateTime('tgl_bayar')->nullable();
            $table->string('metode', 20)->nullable();
            $table->decimal('jumlah', 12, 2);
            $table->text('snap_token')->nullable();
            $table->text('snap_redirect_url')->nullable();
            $table->string('midtrans_transaction_id')->nullable();
            $table->string('midtrans_status', 20)->nullable();
            $table->enum('status', ['pending', 'sukses', 'gagal'])->default('pending');
            $table->timestamps();

            $table->foreign('pesanan_id')->references('id_pesanan')->on('pesanan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
