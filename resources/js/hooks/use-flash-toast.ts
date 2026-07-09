import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    const lastToast = useRef<string>('');

    useEffect(() => {
        function show(pageToast: { type: 'success' | 'info' | 'warning' | 'error'; message: string } | undefined) {
            if (!pageToast) return;
            const key = `${pageToast.type}:${pageToast.message}`;
            if (key !== lastToast.current) {
                lastToast.current = key;
                toast[pageToast.type](pageToast.message, {
                    duration: pageToast.type === 'error' ? 6000 : 4000,
                });
            }
        }

        const pageToast = (router as any).page?.props?.toast as
            { type: 'success' | 'info' | 'warning' | 'error'; message: string } | undefined;

        show(pageToast);

        const cleanup = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as { type: 'success' | 'info' | 'warning' | 'error'; message: string } | undefined;
            show(data);
        });

        return cleanup;
    }, []);
}
