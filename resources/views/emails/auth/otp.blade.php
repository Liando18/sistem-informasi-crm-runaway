<x-mail::message>
# Kode OTP Registrasi

Halo **{{ $nama }}**,

Kode OTP untuk melanjutkan registrasi akun kamu adalah:

<x-mail::panel>
**{{ $otp }}**
</x-mail::panel>

Kode ini berlaku selama **10 menit**.

Jika kamu tidak merasa mendaftar, abaikan email ini.

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
