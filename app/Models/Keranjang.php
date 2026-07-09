<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keranjang extends Model
{
    protected $table = 'keranjang';

    protected $primaryKey = 'id_keranjang';

    protected $fillable = [
        'akun_id',
        'produk_id',
        'produk_variasi_id',
        'jumlah',
    ];

    public function akun(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'akun_id', 'id_akun');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id_produk');
    }

    public function variasi(): BelongsTo
    {
        return $this->belongsTo(ProdukVariasi::class, 'produk_variasi_id', 'id_produk_variasi');
    }
}
