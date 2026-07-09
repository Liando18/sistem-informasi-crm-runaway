import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
import { Lock, KeyRound } from 'lucide-react';

type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Keamanan Akun" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Keamanan</h1>
                <p className="text-gray-500 mb-8">Jaga keamanan akun kamu</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                    <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                        <Lock size={20} className="text-primary-600" />
                        Perbarui Password
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Pastikan akunmu menggunakan password yang kuat dan acak</p>

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
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }
                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-sm font-semibold text-gray-700">Password Saat Ini</Label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        autoComplete="current-password"
                                        placeholder="Masukkan password saat ini"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password Baru</Label>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        autoComplete="new-password"
                                        placeholder="Masukkan password baru"
                                        passwordrules={props.passwordRules}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">Konfirmasi Password Baru</Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        autoComplete="new-password"
                                        placeholder="Ulangi password baru"
                                        passwordrules={props.passwordRules}
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all"
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
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Keamanan',
            href: edit(),
        },
    ],
};
