<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class Akun extends Authenticatable
{
    use Notifiable, TwoFactorAuthenticatable;

    protected $table = 'akun';

    protected $primaryKey = 'id_akun';

    public $incrementing = true;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'no_telp',
        'alamat',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    public function keranjangs(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'akun_id', 'id_akun');
    }

    public function pesanans(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'akun_id', 'id_akun');
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimoni::class, 'akun_id', 'id_akun');
    }

    public function chatsSent(): HasMany
    {
        return $this->hasMany(Chat::class, 'akun_pengirim', 'id_akun');
    }

    public function chatsReceived(): HasMany
    {
        return $this->hasMany(Chat::class, 'akun_penerima', 'id_akun');
    }
}
