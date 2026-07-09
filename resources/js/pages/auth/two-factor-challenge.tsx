import { Head } from '@inertiajs/react';

export default function TwoFactorChallenge() {
    return (
        <>
            <Head title="Two-factor authentication" />
            <div className="p-6 text-center text-muted-foreground">
                Two-factor authentication is not available.
            </div>
        </>
    );
}

TwoFactorChallenge.layout = {
    title: 'Two-factor authentication',
    description: 'Two-factor authentication is not available.',
};
