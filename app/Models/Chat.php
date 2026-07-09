<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chat extends Model
{
    protected $table = 'chat';

    protected $primaryKey = 'id_chat';

    protected $fillable = [
        'akun_pengirim',
        'akun_penerima',
        'pesan',
        'dibaca',
    ];

    protected function casts(): array
    {
        return [
            'dibaca' => 'boolean',
        ];
    }

    public function pengirim(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'akun_pengirim', 'id_akun');
    }

    public function penerima(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'akun_penerima', 'id_akun');
    }
}
