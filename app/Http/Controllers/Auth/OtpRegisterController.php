<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Akun;
use App\Models\OtpCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;

class OtpRegisterController extends Controller
{
    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:20', 'unique:akun,email'],
        ]);

        OtpCode::where('email', $request->email)->delete();

        $otp = (string) random_int(100000, 999999);

        OtpCode::create([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($request->email)->send(new OtpMail($otp, $request->name));

        session(['otp_register' => ['name' => $request->name, 'email' => $request->email]]);

        return redirect()->back();
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $data = session('otp_register');

        if (! $data || ! isset($data['email'])) {
            return redirect()->back()->withErrors(['otp' => 'Sesi registrasi tidak valid. Silakan mulai ulang.']);
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

        session(['otp_register.verified' => true]);

        return redirect()->back();
    }

    public function complete(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            'no_telp' => ['nullable', 'string', 'max:20'],
        ]);

        $data = session('otp_register');

        if (! $data || ! ($data['verified'] ?? false) || ! isset($data['name'], $data['email'])) {
            return redirect()->back()->withErrors(['password' => 'Sesi registrasi tidak valid. Silakan mulai ulang.']);
        }

        $user = Akun::create([
            'nama' => $data['name'],
            'email' => $data['email'],
            'password' => $request->password,
            'no_telp' => $request->no_telp,
            'email_verified_at' => now(),
        ]);

        session()->forget('otp_register');

        Auth::guard('web')->login($user);

        $request->session()->regenerate();

        return redirect()->route('profile.edit');
    }
}
