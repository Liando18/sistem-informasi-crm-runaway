import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { User, Mail, MapPin, Trash2, Lock, KeyRound } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Profil Saya" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                    <p className="text-gray-500 mt-1">Kelola informasi akun kamu</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                    <User size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Informasi Profil</h2>
                                    <p className="text-sm text-gray-500">Perbarui data diri kamu</p>
                                </div>
                            </div>

                            <Form
                                {...ProfileController.update.form()}
                                options={{ preserveScroll: true }}
                                className="space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                                                <Input
                                                    id="name"
                                                    className="block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                                    defaultValue={auth.user.nama}
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Nama lengkap"
                                                />
                                                <InputError className="mt-0.5" message={errors.name} />
                                            </div>

                                            <div className="grid gap-1.5">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Alamat Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                                    defaultValue={auth.user.email}
                                                    name="email"
                                                    required
                                                    autoComplete="username"
                                                    placeholder="Email"
                                                />
                                                <InputError className="mt-0.5" message={errors.email} />
                                            </div>
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="alamat" className="text-sm font-medium text-gray-700">Alamat</Label>
                                            <textarea
                                                id="alamat"
                                                name="alamat"
                                                defaultValue={auth.user.alamat ?? ''}
                                                rows={3}
                                                data-slot="input"
                                                className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none"
                                                placeholder="Masukkan alamat lengkap"
                                            />
                                            <InputError className="mt-0.5" message={errors.alamat} />
                                        </div>

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                <p className="text-sm text-amber-700">
                                                    Email kamu belum diverifikasi.{' '}
                                                    <Link
                                                        href={send.url()}
                                                        method="post"
                                                        as="button"
                                                        className="text-primary-600 underline hover:text-primary-700 font-medium"
                                                    >
                                                        Klik untuk kirim ulang verifikasi
                                                    </Link>
                                                </p>
                                                {status === 'verification-link-sent' && (
                                                    <p className="mt-1.5 text-sm font-medium text-green-600">
                                                        Tautan verifikasi baru telah dikirim ke email kamu.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-2">
                                            <Button
                                                disabled={processing}
                                                data-test="update-profile-button"
                                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Menyimpan...
                                                    </span>
                                                ) : 'Simpan Perubahan'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                    <Lock size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Ganti Password</h2>
                                    <p className="text-sm text-gray-500">Perbarui password akun kamu</p>
                                </div>
                            </div>

                            <Form
                                {...SecurityController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) passwordInput.current?.focus();
                                    if (errors.current_password) currentPasswordInput.current?.focus();
                                }}
                                className="space-y-4"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="current_password" className="text-sm font-medium text-gray-700">Password Saat Ini</Label>
                                            <PasswordInput
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                autoComplete="current-password"
                                                placeholder="Masukkan password saat ini"
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password Baru</Label>
                                            <PasswordInput
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                autoComplete="new-password"
                                                placeholder="Masukkan password baru"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                autoComplete="new-password"
                                                placeholder="Ulangi password baru"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="flex items-center gap-4 pt-2">
                                            <Button
                                                disabled={processing}
                                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Menyimpan...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <KeyRound size={18} />
                                                        Perbarui Password
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Hapus Akun</h2>
                                    <p className="text-sm text-gray-500">Hapus akun kamu secara permanen</p>
                                </div>
                            </div>
                            <DeleteUser />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
