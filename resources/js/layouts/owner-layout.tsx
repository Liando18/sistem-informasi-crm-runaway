import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { LayoutDashboard, Package, TrendingUp, LogOut, Menu, X, Users, Star, User, ChevronDown } from 'lucide-react'

interface OwnerLayoutProps {
    children: React.ReactNode
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
    const page = usePage()
    const { auth } = page.props
    const url = page.url
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    const user = auth?.user || { nama: '', email: '' }

    const dropdowns: Record<string, { label: string; href: string; icon: any }[]> = {
        Pelanggan: [
            { label: 'Data Pelanggan', href: '/owner/pelanggan', icon: Users },
            { label: 'Testimoni', href: '/owner/testimoni', icon: Star },
        ],
        Laporan: [
            { label: 'Laporan Stok', href: '/owner/laporan/stok', icon: Package },
            { label: 'Laporan Penjualan', href: '/owner/laporan/penjualan', icon: TrendingUp },
        ],
    }

    const allItems = [
        { label: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
        ...Object.values(dropdowns).flat(),
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
                            <Link
                                href="/owner/dashboard"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/owner/dashboard')
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            {Object.entries(dropdowns).map(([groupName, items]) => (
                                <div key={groupName} className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === groupName ? null : groupName)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            items.some((i) => isActive(i.href))
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {groupName === 'Pelanggan' && <Users size={16} />}
                                        {groupName === 'Laporan' && <Package size={16} />}
                                        {groupName}
                                        <ChevronDown size={14} className={`transition-transform ${openDropdown === groupName ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === groupName && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                                {items.map((item) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setOpenDropdown(null)}
                                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                                isActive(item.href)
                                                                    ? 'text-purple-600 bg-purple-50'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <Icon size={16} />
                                                            {item.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/settings/profile" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-colors">
                                <User size={16} />
                                <span className="hidden sm:block">{user.nama}</span>
                            </Link>
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
                            {allItems.map((item) => {
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
                            <Link href="/settings/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full">
                                <User size={18} /> Profil
                            </Link>
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
