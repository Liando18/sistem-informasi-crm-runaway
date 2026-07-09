<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $primaryKey = 'id_pembayaran';

    protected $fillable = [
        'pesanan_id',
        'tgl_bayar',
        'metode',
        'jumlah',
        'snap_token',
        'snap_redirect_url',
        'midtrans_transaction_id',
        'midtrans_status',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tgl_bayar' => 'datetime',
            'jumlah' => 'decimal:2',
        ];
    }

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id', 'id_pesanan');
    }
}
