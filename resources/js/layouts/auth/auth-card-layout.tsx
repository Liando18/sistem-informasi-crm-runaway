import { Link } from '@inertiajs/react'
import { home, tentang } from '@/routes'
import { useEffect, useState } from 'react'

interface AuthCardLayoutProps {
    children: React.ReactNode
    title?: string
    description?: string
}

function Particles() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([])

    useEffect(() => {
        const items = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 3,
        }))
        setParticles(items)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white/20"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
                    }}
                />
            ))}
        </div>
    )
}

export default function AuthCardLayout({ children, title, description }: AuthCardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) scale(1); opacity: 0.3; }
                    100% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
                }
                .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
            `}</style>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.3),transparent_50%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.3),transparent_50%)]" />
                </div>

                <Particles />

                <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full blur-[100px] opacity-20 animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 text-center text-white max-w-md animate-fade-in">
                    <div className="flex items-center justify-center mb-8">
                        <img src="/logo-runaway.png" alt="Runaway Denim" className="h-20 w-20 object-contain bg-white rounded-2xl p-2" />
                    </div>

                    <h2 className="text-3xl font-bold mb-3 tracking-wide">Runaway Denim</h2>
                    <p className="text-primary-200/90 text-lg leading-relaxed mb-10 font-light">
                        Temukan gaya terbaikmu dengan koleksi denim premium. Kualitas internasional, fashion tanpa batas.
                    </p>

                    <div className="flex justify-center gap-8">
                        <Link href={tentang.url()} className="text-primary-200/80 hover:text-white transition-all duration-300 text-sm tracking-wide">
                            Tentang Kami
                        </Link>
                        <Link href={home.url()} className="text-primary-200/80 hover:text-white transition-all duration-300 text-sm tracking-wide">
                            Beranda
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />

                <div className="w-full max-w-md animate-slide-up">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href={home.url()} className="flex items-center gap-2">
                            <img src="/logo-runaway.png" alt="Runaway Denim" className="h-8 w-8 object-contain bg-white rounded-lg p-0.5" />
                            <span className="text-xl font-bold text-gray-900">Runaway Denim</span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex justify-center mb-8">
                        <Link href={home.url()}>
                            <img src="/logo-runaway.png" alt="Runaway Denim" className="h-16 w-16 object-contain bg-white rounded-2xl p-1.5" />
                        </Link>
                    </div>

                    {title && (
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1.5">{title}</h1>
                    )}
                    {description && (
                        <p className="text-gray-400 text-center mb-8 text-sm">{description}</p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    )
}
