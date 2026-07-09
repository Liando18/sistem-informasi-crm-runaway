import { Head, Link, usePage } from '@inertiajs/react';
import { Package, Users, ShoppingCart, TrendingUp, AlertTriangle, Eye } from 'lucide-react';

interface Akun {
    nama: string;
}

interface StokItem {
    id_produk: number;
    nama_produk: string;
    stok: number;
}

interface Penjualan {
    id_pesanan: number;
    akun?: Akun;
    grand_total: number;
    tgl_pesanan: string;
}

interface PageProps {
    totalProduk: number;
    totalPelanggan: number;
    totalPesananSelesai: number;
    pendapatanHariIni: number;
    pendapatanBulanIni: number;
    pendapatanTahunIni: number;
    stokMenipis: StokItem[];
    penjualanTerbaru: Penjualan[];
}

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function OwnerDashboard() {
    const { totalProduk, totalPelanggan, totalPesananSelesai, pendapatanHariIni, pendapatanBulanIni, pendapatanTahunIni, stokMenipis, penjualanTerbaru } = usePage<PageProps>().props;

    const stats = [
        { label: 'Total Produk', value: totalProduk || 0, icon: Package, gradient: 'from-primary-500 to-primary-600' },
        { label: 'Total Pelanggan', value: totalPelanggan || 0, icon: Users, gradient: 'from-emerald-500 to-green-600' },
        { label: 'Pesanan Selesai', value: totalPesananSelesai || 0, icon: ShoppingCart, gradient: 'from-amber-500 to-yellow-600' },
    ];

    const revenue = [
        { label: 'Pendapatan Hari Ini', value: pendapatanHariIni || 0, color: 'text-primary-600' },
        { label: 'Pendapatan Bulan Ini', value: pendapatanBulanIni || 0, color: 'text-emerald-600' },
        { label: 'Pendapatan Tahun Ini', value: pendapatanTahunIni || 0, color: 'text-primary-600' },
    ];

    const lowStock = stokMenipis || [];
    const recentSales = penjualanTerbaru || [];

    return (
        <>
            <Head title="Dashboard Owner" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Owner</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {revenue.map((rev, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className={`h-5 w-5 ${rev.color}`} />
                                <p className="text-sm text-gray-500">{rev.label}</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{rupiah(rev.value)}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" /> Stok Menipis</h3>
                            <Link href="/owner/laporan/stok" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"><Eye size={16} /> Lihat Semua</Link>
                        </div>
                        {lowStock.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {lowStock.map((item) => (
                                    <div key={item.id_produk} className="px-5 py-3 flex justify-between items-center">
                                        <span className="font-medium text-gray-900 text-sm">{item.nama_produk}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stok === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {item.stok === 0 ? 'Habis' : `Stok: ${item.stok}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">Semua stok aman</div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Penjualan Terbaru</h3>
                            <Link href="/owner/laporan/penjualan" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"><Eye size={16} /> Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                                        <th className="text-right px-5 py-3 font-medium">Total</th>
                                        <th className="text-center px-5 py-3 font-medium">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentSales.length > 0 ? recentSales.map((sale) => (
                                        <tr key={sale.id_pesanan} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{sale.akun?.nama || '-'}</td>
                                            <td className="px-5 py-3 text-right font-medium text-primary-600">{rupiah(sale.grand_total)}</td>
                                            <td className="px-5 py-3 text-center text-gray-500">{new Date(sale.tgl_pesanan).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">Belum ada penjualan</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
