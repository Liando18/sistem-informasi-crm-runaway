import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { LayoutDashboard, Package, FolderOpen, Ticket, ShoppingCart, CreditCard, MessageSquare, Star, LogOut, Menu, X, ChevronDown, Users, ShoppingBag, DollarSign } from 'lucide-react'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const page = usePage()
    const { auth } = page.props
    const url = page.url
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    const user = auth?.user || { nama: '', email: '' }

    const dropdowns: Record<string, { label: string; href: string; icon: any }[]> = {
        Toko: [
            { label: 'Produk', href: '/admin/produk', icon: Package },
            { label: 'Kategori', href: '/admin/kategori', icon: FolderOpen },
            { label: 'Diskon', href: '/admin/diskon', icon: Ticket },
        ],
        Transaksi: [
            { label: 'Pesanan', href: '/admin/pesanan', icon: ShoppingCart },
            { label: 'Pembayaran', href: '/admin/pembayaran', icon: CreditCard },
        ],
        Pelanggan: [
            { label: 'Kelola Pelanggan', href: '/admin/pelanggan', icon: Users },
            { label: 'Testimoni', href: '/admin/testimoni', icon: Star },
            { label: 'Chat', href: '/admin/chat', icon: MessageSquare },
        ],
    }

    const allItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
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
                            <Link href="/admin/dashboard" className="flex items-center gap-2">
                                <img src="/logo-runaway.png" alt="Logo" className="h-8 w-8 object-contain" />
                                <span className="font-bold text-lg text-gray-900 hidden sm:block">Runaway Denim</span>
                                <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full">Admin</span>
                            </Link>
                        </div>
                        <div className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/admin/dashboard"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/admin/dashboard')
                                        ? 'bg-primary-50 text-primary-700'
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
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {groupName === 'Toko' && <ShoppingBag size={16} />}
                                        {groupName === 'Transaksi' && <DollarSign size={16} />}
                                        {groupName === 'Pelanggan' && <Users size={16} />}
                                        {groupName}
                                        <ChevronDown size={14} className={`transition-transform ${openDropdown === groupName ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === groupName && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                                {items.map((item) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setOpenDropdown(null)}
                                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                                isActive(item.href)
                                                                    ? 'text-primary-600 bg-primary-50'
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
                            {allItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-primary-50 text-primary-700'
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
