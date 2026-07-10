<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->dropForeign(['diskon_id']);
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon')->onDelete('set null');
        });

        Schema::table('pesanan', function (Blueprint $table) {
            $table->dropForeign(['diskon_id']);
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->dropForeign(['diskon_id']);
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon');
        });

        Schema::table('pesanan', function (Blueprint $table) {
            $table->dropForeign(['diskon_id']);
            $table->foreign('diskon_id')->references('id_diskon')->on('diskon');
        });
    }
};
