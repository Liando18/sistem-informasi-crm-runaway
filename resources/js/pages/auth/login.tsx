import { Head, Link, useForm } from '@inertiajs/react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { register } from '@/routes'
import { store } from '@/routes/login'
import { request } from '@/routes/password'

type Props = {
    status?: string
    canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        post(store.url(), {
            onSuccess: () => reset('password'),
        })
    }

    return (
        <>
            <Head title="Masuk" />

            {status && (
                <div className="mb-5 text-center text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl py-3 animate-slide-up">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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
                            autoFocus
                            autoComplete="email"
                            maxLength={20}
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
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={request.url()}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>
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
                            placeholder="Masukkan kata sandi"
                            required
                            autoComplete="current-password"
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
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                            {errors.password}
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
                            Masuk
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-400">
                    Belum punya akun?{' '}
                    <Link href={register.url()} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                        Daftar
                    </Link>
                </p>
            </form>
        </>
    )
}

Login.layout = {
    title: 'Masuk ke Akun',
    description: 'Masukkan email dan kata sandi untuk masuk ke akun kamu',
}
