<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Akun;
use App\Models\OtpCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;

class PasswordResetController extends Controller
{
    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'exists:akun,email'],
        ]);

        $email = $request->email;

        OtpCode::where('email', $email)->delete();

        $otp = (string) random_int(100000, 999999);

        OtpCode::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        $user = Akun::where('email', $email)->first();

        Mail::to($email)->send(new OtpMail($otp, $user->nama, 'Reset Password'));

        session(['otp_reset' => ['email' => $email]]);

        return redirect()->route('password.reset');
    }

    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ]);

        $data = session('otp_reset');

        if (! $data || ! isset($data['email'])) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Sesi tidak valid. Silakan mulai ulang.']);
        }

        $otpCode = OtpCode::where('email', $data['email'])
            ->where('otp', $request->otp)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $otpCode) {
            return redirect()->back()->withErrors(['otp' => 'Kode OTP salah atau sudah kadaluarsa.']);
        }

        $otpCode->update(['used_at' => now()]);

        $user = Akun::where('email', $data['email'])->firstOrFail();
        $user->forceFill([
            'password' => $request->password,
        ])->save();

        session()->forget('otp_reset');

        return redirect()->route('login')
            ->with('status', 'Password berhasil direset. Silakan login dengan password baru.');
    }
}
