<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdukVariasi extends Model
{
    protected $table = 'produk_variasi';

    protected $primaryKey = 'id_produk_variasi';

    protected $fillable = [
        'produk_id',
        'ukuran',
        'warna',
        'stok',
    ];

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id_produk');
    }
}
