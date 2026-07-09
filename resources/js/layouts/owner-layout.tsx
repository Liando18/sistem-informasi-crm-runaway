import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { LayoutDashboard, Package, TrendingUp, LogOut, Menu, X, Printer } from 'lucide-react'

interface OwnerLayoutProps {
    children: React.ReactNode
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
    const { auth, url } = usePage().props
    const [mobileOpen, setMobileOpen] = useState(false)

    const user = auth?.user || { nama: '', email: '' }

    const navItems = [
        { label: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
        { label: 'Laporan Stok', href: '/owner/laporan/stok', icon: Package },
        { label: 'Laporan Penjualan', href: '/owner/laporan/penjualan', icon: TrendingUp },
    ]

    function handleLogout() {
        router.post('/logout')
    }

    const isActive = (href: string) => url?.startsWith(href)

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="max-w-full px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700">
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <Link href="/owner/dashboard" className="flex items-center gap-2">
                                <img src="/logo-runaway.png" alt="Logo" className="h-8 w-8 object-contain" />
                                <span className="font-bold text-lg text-gray-900 hidden sm:block">Runaway Denim</span>
                                <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">Owner</span>
                            </Link>
                        </div>
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 hidden sm:block">{user.nama}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
                {mobileOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <hr className="my-2" />
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>
            <main className="pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
