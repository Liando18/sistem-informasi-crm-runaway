import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link
                    href={home.url()}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <img
                        src="/logo-runaway.png"
                        alt="Runaway Denim"
                        className="mr-2 h-8 w-8 object-contain bg-white rounded-lg p-0.5"
                    />
                    {name}
                </Link>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home.url()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <img
                            src="/logo-runaway.png"
                            alt="Runaway Denim"
                            className="h-10 object-contain sm:h-12 bg-white rounded-xl p-1"
                        />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
