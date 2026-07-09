import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    useFlashToast();

    return (
        <>
            <div className="hidden md:block">
                <Sonner
                    position="bottom-right"
                    richColors
                    closeButton
                    duration={4000}
                    className="toaster group"
                    toastOptions={{
                        style: {
                            padding: '14px 18px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                            gap: '10px',
                        },
                    }}
                    {...props}
                />
            </div>
            <div className="md:hidden">
                <Sonner
                    position="top-right"
                    richColors
                    closeButton
                    duration={4000}
                    className="toaster group"
                    toastOptions={{
                        style: {
                            padding: '14px 18px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                            gap: '10px',
                        },
                    }}
                    {...props}
                />
            </div>
        </>
    );
}

export { Toaster };
