<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPesanan extends Model
{
    protected $table = 'detail_pesanan';

    protected $primaryKey = 'id_detail';

    protected $fillable = [
        'pesanan_id',
        'produk_id',
        'produk_variasi_id',
        'jumlah',
        'harga',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id', 'id_pesanan');
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
