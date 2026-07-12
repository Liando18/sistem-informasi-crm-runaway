<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat', function (Blueprint $table) {
            $table->unsignedInteger('id_chat', true);
            $table->unsignedInteger('akun_pengirim');
            $table->unsignedInteger('akun_penerima');
            $table->text('pesan');
            $table->boolean('dibaca')->default(false);
            $table->timestamps();

            $table->foreign('akun_pengirim')->references('id_akun')->on('akun');
            $table->foreign('akun_penerima')->references('id_akun')->on('akun');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};
