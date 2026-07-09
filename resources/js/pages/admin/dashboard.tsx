import { Head, Link, usePage } from '@inertiajs/react';
import { Package, FolderOpen, ShoppingCart, Users, Eye } from 'lucide-react';

interface Akun {
    nama: string;
}

interface Pesanan {
    id_pesanan: number;
    akun?: Akun;
    grand_total: number;
    tgl_pesanan: string;
    status: string;
}

interface PageProps {
    totalProduk: number;
    totalKategori: number;
    totalPesanan: number;
    totalPelanggan: number;
    pesananTerbaru: Pesanan[];
    pendapatanHariIni: number;
}

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function AdminDashboard() {
    const { totalProduk, totalKategori, totalPesanan, totalPelanggan, pesananTerbaru, pendapatanHariIni } = usePage<PageProps>().props;

    const stats = [
        { label: 'Total Produk', value: totalProduk || 0, icon: Package, gradient: 'from-primary-500 to-primary-600' },
        { label: 'Total Kategori', value: totalKategori || 0, icon: FolderOpen, gradient: 'from-emerald-500 to-green-600' },
        { label: 'Total Pesanan', value: totalPesanan || 0, icon: ShoppingCart, gradient: 'from-amber-500 to-yellow-600' },
        { label: 'Total Pelanggan', value: totalPelanggan || 0, icon: Users, gradient: 'from-purple-500 to-violet-600' },
    ];

    const orders = pesananTerbaru || [];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        diproses: 'bg-primary-100 text-primary-800',
        dikirim: 'bg-primary-100 text-primary-800',
        selesai: 'bg-green-100 text-green-800',
        dibatalkan: 'bg-red-100 text-red-800',
    };

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`bg-gradient-to-br ${stat.gradient} p-3.5 rounded-xl shadow-sm`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Pesanan Terbaru</h3>
                            <Link href="/admin/pesanan" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"><Eye size={16} /> Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                                        <th className="text-left px-5 py-3 font-medium">Tanggal</th>
                                        <th className="text-right px-5 py-3 font-medium">Total</th>
                                        <th className="text-center px-5 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.length > 0 ? orders.map((order) => (
                                        <tr key={order.id_pesanan} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{order.akun?.nama || '-'}</td>
                                            <td className="px-5 py-3 text-gray-500">{new Date(order.tgl_pesanan).toLocaleDateString('id-ID')}</td>
                                            <td className="px-5 py-3 text-right font-medium text-gray-900">{rupiah(order.grand_total)}</td>
                                            <td className="px-5 py-3 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Belum ada pesanan</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-1">Pendapatan Hari Ini</h3>
                        <p className="text-sm text-gray-400 mb-4">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-3xl font-bold text-gray-900">{rupiah(pendapatanHariIni || 0)}</p>
                        <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
