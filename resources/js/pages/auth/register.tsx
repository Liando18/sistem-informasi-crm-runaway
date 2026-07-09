import { Head, Link, useForm } from '@inertiajs/react'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { login } from '@/routes'
import { store } from '@/routes/register'

type Props = {
    passwordRules: string
}

export default function Register({ passwordRules }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        no_telp: '',
        password: '',
        password_confirmation: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        post(store.url(), {
            onSuccess: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <>
            <Head title="Daftar" />

            <form onSubmit={submit} className="space-y-4">
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
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                            placeholder="Nama lengkap"
                            required
                            autoFocus
                            autoComplete="name"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
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
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                            placeholder="nama@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nomor Telepon
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
                            <Phone className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'no_telp' ? 'text-primary-600' : 'text-gray-400'}`} />
                        </div>
                        <input
                            id="no_telp"
                            type="tel"
                            value={data.no_telp}
                            onChange={(e) => setData('no_telp', e.target.value)}
                            onFocus={() => setFocusedField('no_telp')}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                            placeholder="08xxxxxxxxxx"
                            autoComplete="tel"
                        />
                    </div>
                    {errors.no_telp && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                            {errors.no_telp}
                        </p>
                    )}
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
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                            placeholder="Minimal 8 karakter"
                            required
                            autoComplete="new-password"
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
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
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
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            onFocus={() => setFocusedField('password_confirmation')}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                            placeholder="Ulangi kata sandi"
                            required
                            autoComplete="new-password"
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
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                            {errors.password_confirmation}
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
                            Daftar
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
        </>
    )
}

Register.layout = {
    title: 'Daftar Akun Baru',
    description: 'Isi data diri kamu untuk membuat akun',
}
