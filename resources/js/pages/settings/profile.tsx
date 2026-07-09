import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { User, Mail, Shield } from 'lucide-react';

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

    return (
        <>
            <Head title="Profil Saya" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Profil</h1>
                <p className="text-gray-500 mb-8">Kelola informasi akun kamu</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                        <User size={20} className="text-primary-600" />
                        Informasi Profil
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Perbarui nama dan email kamu</p>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama lengkap"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email"
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
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
                                            <p className="mt-2 text-sm font-medium text-green-600">
                                                Tautan verifikasi baru telah dikirim ke email kamu.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all"
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

                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                    <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                        <Shield size={20} className="text-red-500" />
                        Hapus Akun
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Hapus akun kamu secara permanen</p>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-700">
                            Setelah akun dihapus, semua data akan dihapus secara permanen. Harap备份 data penting sebelum melanjutkan.
                        </p>
                    </div>
                    <DeleteUser />
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
