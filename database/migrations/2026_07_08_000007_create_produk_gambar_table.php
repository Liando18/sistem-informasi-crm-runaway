<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_gambar', function (Blueprint $table) {
            $table->unsignedInteger('id_produk_gambar', true);
            $table->unsignedInteger('produk_id');
            $table->text('gambar');
            $table->boolean('is_utama')->default(false);
            $table->timestamps();

            $table->foreign('produk_id')->references('id_produk')->on('produk')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_gambar');
    }
};
