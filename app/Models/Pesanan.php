<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pesanan extends Model
{
    protected $table = 'pesanan';

    protected $primaryKey = 'id_pesanan';

    protected $fillable = [
        'akun_id',
        'diskon_id',
        'tgl_pesanan',
        'status',
        'total_harga',
        'potongan',
        'grand_total',
        'catatan',
        'provinsi',
        'kabupaten',
        'kecamatan',
        'kelurahan',
        'alamat_detail',
        'no_telp_kirim',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'total_harga' => 'decimal:2',
            'potongan' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'tgl_pesanan' => 'datetime',
        ];
    }

    public function akun(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'akun_id', 'id_akun');
    }

    public function diskon(): BelongsTo
    {
        return $this->belongsTo(Diskon::class, 'diskon_id', 'id_diskon');
    }

    public function detailPesanans(): HasMany
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id', 'id_pesanan');
    }

    public function pembayaran(): HasOne
    {
        return $this->hasOne(Pembayaran::class, 'pesanan_id', 'id_pesanan');
    }
}
