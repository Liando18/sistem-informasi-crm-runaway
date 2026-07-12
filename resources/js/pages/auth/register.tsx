import { Head, Link, router } from '@inertiajs/react'
import { Mail, User, Lock, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Timer, ShieldCheck } from 'lucide-react'
import { useState, useEffect, type FormEvent } from 'react'
import { login } from '@/routes'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const STEPS = [
    { id: 1, label: 'Data Diri' },
    { id: 2, label: 'Verifikasi' },
    { id: 3, label: 'Kata Sandi' },
]

export default function Register() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [noTelp, setNoTelp] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [processing, setProcessing] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const submitStep1 = (e: FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setErrors({})
        setSuccessMessage('')

        router.post('/register/send-otp', { name, email }, {
            preserveState: true,
            onSuccess: () => {
                setStep(2)
                setCountdown(60)
                setSuccessMessage('Kode OTP telah dikirim ke email kamu')
            },
            onError: (errs) => {
                setErrors(errs)
            },
            onFinish: () => setProcessing(false),
        })
    }

    const submitStep2 = (e: FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) return
        setProcessing(true)
        setErrors({})
        setSuccessMessage('')

        router.post('/register/verify-otp', { otp }, {
            preserveState: true,
            onSuccess: () => {
                setStep(3)
                setSuccessMessage('Email berhasil diverifikasi')
            },
            onError: (errs) => {
                setErrors(errs)
                setOtp('')
            },
            onFinish: () => setProcessing(false),
        })
    }

    const submitStep3 = (e: FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        router.post('/register/complete', {
            password,
            password_confirmation: passwordConfirmation,
            no_telp: noTelp,
        }, {
            onError: (errs) => {
                setErrors(errs)
                setProcessing(false)
            },
            onFinish: () => setProcessing(false),
        })
    }

    const resendOtp = () => {
        if (countdown > 0) return
        setProcessing(true)
        setErrors({})

        router.post('/register/send-otp', { name, email }, {
            preserveState: true,
            onSuccess: () => {
                setCountdown(60)
                setSuccessMessage('Kode OTP telah dikirim ulang')
            },
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        })
    }

    const goToStep = (target: number) => {
        if (target < step) setStep(target)
    }

    return (
        <>
            <Head title="Daftar" />

            <div className="w-full max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center flex-1">
                            <button
                                type="button"
                                onClick={() => goToStep(s.id)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                                        s.id < step
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-100'
                                            : s.id === step
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110 ring-4 ring-primary-100'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {s.id < step ? (
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    ) : (
                                        s.id
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] font-medium tracking-wide uppercase transition-colors duration-300 ${
                                        s.id <= step ? 'text-gray-700' : 'text-gray-300'
                                    }`}
                                >
                                    {s.label}
                                </span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-gray-100">
                                    <div
                                        className={`h-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-700 ease-out ${
                                            s.id < step ? 'w-full' : 'w-0'
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {successMessage && (
                    <div className="mb-5 text-center text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-3 px-4 animate-[fadeIn_0.4s_ease-out]">
                        {successMessage}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={submitStep1} className="space-y-4 animate-[slideUp_0.4s_ease-out]">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                                    <User className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Nama lengkap"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    maxLength={30}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                                    <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                    placeholder="nama@email.com"
                                    required
                                    autoComplete="email"
                                    maxLength={20}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Kirim Kode OTP
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-400">
                            Sudah punya akun?{' '}
                            <Link href={login.url()} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                Masuk
                            </Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={submitStep2} className="space-y-4 animate-[slideUp_0.4s_ease-out]">
                        <div className="text-center space-y-2 mb-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-3">
                                <ShieldCheck className="h-7 w-7 text-primary-600" />
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Masukkan kode OTP 6 digit yang telah dikirim ke
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{email}</p>
                        </div>

                        <div className="flex justify-center py-4">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(val) => setOtp(val)}
                                autoFocus
                            >
                                <InputOTPGroup className="gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className={`w-11 h-12 rounded-lg border-2 text-lg font-bold transition-all duration-200 ${
                                                otp.length === i
                                                    ? 'border-primary-500 ring-2 ring-primary-200'
                                                    : otp.length > i
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200'
                                            }`}
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {errors.otp && (
                            <p className="text-sm text-red-500 text-center flex items-center justify-center gap-1.5">
                                <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                {errors.otp}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || otp.length !== 6}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Verifikasi OTP
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
                                    <Timer className="h-4 w-4" />
                                    Kirim ulang dalam {countdown} detik
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={processing}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors disabled:opacity-50"
                                >
                                    Kirim ulang kode OTP
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-all duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={submitStep3} className="space-y-4 animate-[slideUp_0.4s_ease-out]">
                        <div className="text-center space-y-2 mb-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-3">
                                <Check className="h-7 w-7 text-emerald-600" />
                            </div>
                            <p className="text-sm text-gray-500">
                                Email berhasil diverifikasi. Sekarang buat kata sandi akun kamu.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                                    <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Minimal 8 karakter"
                                    required
                                    autoFocus
                                    autoComplete="new-password"
                                    maxLength={10}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                                    <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password_confirmation' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    onFocus={() => setFocusedField('password_confirmation')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Ulangi kata sandi"
                                    required
                                    autoComplete="new-password"
                                    maxLength={10}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nomor Telepon (opsional)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                                    <Phone className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'no_telp' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="no_telp"
                                    type="tel"
                                    value={noTelp}
                                    onChange={(e) => setNoTelp(e.target.value)}
                                    onFocus={() => setFocusedField('no_telp')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                    placeholder="08xxxxxxxxxx"
                                    autoComplete="tel"
                                    maxLength={20}
                                />
                            </div>
                            {errors.no_telp && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block shrink-0" />
                                    {errors.no_telp}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-all duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </button>

                        <p className="text-center text-sm text-gray-400">
                            Sudah punya akun?{' '}
                            <Link href={login.url()} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                Masuk
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </>
    )
}

Register.layout = {
    title: 'Buat Akun Baru',
    description: 'Daftar dengan 3 langkah mudah',
}
