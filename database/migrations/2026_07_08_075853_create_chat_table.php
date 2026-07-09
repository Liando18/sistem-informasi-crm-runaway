<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat', function (Blueprint $table) {
            $table->integer('id_chat', true);
            $table->integer('akun_pengirim');
            $table->integer('akun_penerima');
            $table->foreign('akun_pengirim')->references('id_akun')->on('akun');
            $table->foreign('akun_penerima')->references('id_akun')->on('akun');
            $table->text('pesan');
            $table->boolean('dibaca')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};
