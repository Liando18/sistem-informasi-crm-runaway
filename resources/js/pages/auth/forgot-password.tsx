import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { sendOtp } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const kirimOtp = (e: React.FormEvent) => {
        e.preventDefault();
        post(sendOtp.url());
    };

    return (
        <>
            <Head title="Lupa Password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={kirimOtp} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="off"
                            autoFocus
                            placeholder="email@example.com"
                            maxLength={20}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Kirim OTP
                    </Button>
                </form>

                <div className="space-x-1 text-center text-sm text-gray-500">
                    <span>Ingat password?</span>
                    <TextLink href={login.url()}>Masuk</TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Password',
    description: 'Masukkan email untuk menerima kode OTP reset password',
};
