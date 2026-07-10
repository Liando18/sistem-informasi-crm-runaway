import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { request, update } from '@/routes/password';

export default function ResetPassword() {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const resetPw = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url());
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="space-y-6">
                <form onSubmit={resetPw} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="otp">Kode OTP</Label>
                        <Input
                            id="otp"
                            type="text"
                            name="otp"
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value)}
                            autoComplete="off"
                            autoFocus
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-lg tracking-[0.5em]"
                        />
                        <InputError message={errors.otp} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            placeholder="Password baru"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            placeholder="Ulangi password baru"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>

                <div className="space-x-1 text-center text-sm text-gray-500">
                    <span>Belum dapat OTP?</span>
                    <TextLink href={request.url()}>Kirim ulang</TextLink>
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset Password',
    description: 'Masukkan kode OTP dan password baru',
};
