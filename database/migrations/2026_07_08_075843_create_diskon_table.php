<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diskon', function (Blueprint $table) {
            $table->integer('id_diskon', true);
            $table->string('nama_diskon', 30);
            $table->enum('tipe', ['persen', 'nominal']);
            $table->decimal('nilai', 8, 2);
            $table->string('kode', 30)->unique();
            $table->date('tanggal_mulai');
            $table->date('tanggal_berakhir');
            $table->decimal('min_belanja', 8, 2)->default(0);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diskon');
    }
};
