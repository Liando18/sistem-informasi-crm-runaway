import { Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, ShoppingCart, Package, LogOut, User, ChevronDown, MessageCircle } from 'lucide-react'

interface AuthUser {
    nama: string
    email: string
    role: string
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const page = usePage()
    const { auth } = page.props
    const url = page.url
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const user = auth?.user as AuthUser | undefined

    const isTransparentPage = url === '/' || url === '/produk' || url?.startsWith('/produk?') || url === '/tentang'

    const isActive = (path: string) => {
        if (path === '/') return url === '/'
        return url?.startsWith(path)
    }

    function handleLogout() {
        router.post('/logout')
    }

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Produk', href: '/produk' },
        { label: 'Tentang', href: '/tentang' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                isTransparentPage
                    ? scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-lg'
                        : 'bg-transparent'
                    : 'bg-white shadow-sm border-b border-gray-100'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img src="/logo-runaway.png" alt="Runaway Denim" className="h-8 w-8 object-contain" />
                            <span className={`font-bold text-xl tracking-tight transition-colors ${
                                isTransparentPage && !scrolled ? 'text-white' : 'text-gray-900'
                            }`}>Runaway Denim</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${
                                        isTransparentPage && !scrolled
                                            ? isActive(link.href) ? 'text-white' : 'text-white/80 hover:text-white'
                                            : isActive(link.href) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                            isTransparentPage && !scrolled
                                                ? 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20'
                                                : 'bg-primary-600 text-white hover:bg-primary-700'
                                        }`}
                                    >
                                        <User size={16} />
                                        <span>{user.nama}</span>
                                        <ChevronDown size={14} />
                                    </button>
                                    {userMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                                {user.role === 'pelanggan' && (
                                                    <>
                                                        <Link href="/keranjang" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <ShoppingCart size={16} /> Keranjang
                                                        </Link>
                                                        <Link href="/pesanan" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <Package size={16} /> Pesanan Saya
                                                        </Link>
                                                        <Link href="/chat" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <MessageCircle size={16} /> Pesan
                                                        </Link>
                                                        <Link href="/settings/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <User size={16} /> Profil
                                                        </Link>
                                                        <hr className="my-2" />
                                                    </>
                                                )}
                                                {user.role === 'admin' && (
                                                    <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Dashboard Admin
                                                    </Link>
                                                )}
                                                {user.role === 'owner' && (
                                                    <Link href="/owner/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Dashboard Owner
                                                    </Link>
                                                )}
                                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className={`text-sm font-medium transition-colors ${
                                        isTransparentPage && !scrolled ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-primary-600'
                                    }`}>Login</Link>
                                    <Link href="/register" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                        isTransparentPage && !scrolled
                                            ? 'bg-white text-primary-700 hover:bg-primary-50'
                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                    }`}>
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 transition-colors ${
                            isTransparentPage && !scrolled ? 'text-white' : 'text-gray-700'
                        }`}>
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {mobileOpen && (
                        <div className={`md:hidden pb-6 rounded-b-2xl ${
                            isTransparentPage && !scrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white'
                        }`}>
                            <div className="flex flex-col gap-2 pt-4 px-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                            isActive(link.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <hr className="my-2" />
                                {user ? (
                                    <>
                                        {user.role === 'pelanggan' && (
                                            <>
                                                <Link href="/keranjang" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Keranjang</Link>
                                                <Link href="/pesanan" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Pesanan Saya</Link>
                                                <Link href="/chat" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Pesan</Link>
                                            </>
                                        )}
                                        <button onClick={handleLogout} className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-left">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Login</Link>
                                        <Link href="/register" onClick={() => setMobileOpen(false)} className="mx-2 bg-primary-600 text-white px-5 py-3 rounded-xl text-center font-semibold">Daftar</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <main className={isTransparentPage ? '' : 'pt-16'}>
                {children}
            </main>

            {user && user.role === 'pelanggan' ? (
                <Link
                    href="/chat"
                    className="fixed bottom-6 right-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-2xl hover:shadow-primary-500/40 hover:scale-110 transition-all duration-300 z-50 group"
                    aria-label="Chat"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                </Link>
            ) : !user ? (
                <a
                    href="https://wa.me/6282183539906"
                    target="_blank"
                    className="fixed bottom-6 right-6 bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300 z-50 group"
                    aria-label="Chat WhatsApp"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                </a>
            ) : null}
        </div>
    )
}
