<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->decimal('harga', 12, 2)->change();
        });

        Schema::table('pesanan', function (Blueprint $table) {
            $table->decimal('total_harga', 12, 2)->change();
        });

        Schema::table('detail_pesanan', function (Blueprint $table) {
            $table->decimal('harga', 12, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->decimal('harga', 8, 2)->change();
        });

        Schema::table('pesanan', function (Blueprint $table) {
            $table->decimal('total_harga', 8, 2)->change();
        });

        Schema::table('detail_pesanan', function (Blueprint $table) {
            $table->decimal('harga', 8, 2)->change();
        });
    }
};
