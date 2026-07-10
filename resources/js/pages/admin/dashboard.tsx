import { Head, Link, usePage } from '@inertiajs/react';
import { Package, FolderOpen, ShoppingCart, Users, Eye, TrendingUp, CircleDollarSign } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import ChartCard from '@/components/chart-card';

interface Akun { nama: string }
interface Pesanan { id_pesanan: number; akun?: Akun; grand_total: number; tgl_pesanan: string; status: string }
interface RevenueItem { date: string; total: number }
interface StatusItem { status: string; count: number }
interface ProductItem { nama_produk: string; total_terjual: number }

interface PageProps {
    totalProduk: number; totalKategori: number;
    totalPesanan: number; totalPelanggan: number;
    pesananTerbaru: Pesanan[]; pendapatanHariIni: number;
    revenueTrend: RevenueItem[]; ordersByStatus: StatusItem[];
    topProducts: ProductItem[];
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending', dibayar: 'Dibayar', dipacking: 'Dipacking',
    dikirim: 'Dikirim', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#F59E0B', dibayar: '#3B82F6', dipacking: '#8B5CF6',
    dikirim: '#06B6D4', selesai: '#10B981', dibatalkan: '#EF4444',
};

const TABLE_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', diproses: 'bg-primary-100 text-primary-800',
    dikirim: 'bg-primary-100 text-primary-800', selesai: 'bg-green-100 text-green-800',
    dibatalkan: 'bg-red-100 text-red-800',
};

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

function fillMissingDays(data: RevenueItem[], days: number): RevenueItem[] {
    const map = new Map(data.map(d => [d.date, d.total]));
    const result: RevenueItem[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        result.push({ date: key, total: map.get(key) || 0 });
    }
    return result;
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm">
            <p className="text-gray-500 mb-1">{label}</p>
            <p className="font-bold text-gray-900">{rupiah(payload[0].value)}</p>
        </div>
    );
};

export default function AdminDashboard() {
    const { totalProduk, totalKategori, totalPesanan, totalPelanggan, pesananTerbaru, pendapatanHariIni, revenueTrend, ordersByStatus, topProducts } = usePage<PageProps>().props;

    const stats = [
        { label: 'Total Produk', value: totalProduk, icon: Package, color: 'from-primary-500 to-primary-600' },
        { label: 'Total Kategori', value: totalKategori, icon: FolderOpen, color: 'from-emerald-500 to-green-600' },
        { label: 'Total Pesanan', value: totalPesanan, icon: ShoppingCart, color: 'from-amber-500 to-yellow-600' },
        { label: 'Total Pelanggan', value: totalPelanggan, icon: Users, color: 'from-purple-500 to-violet-600' },
    ];

    const chartData = fillMissingDays(revenueTrend || [], 7);
    const statusData = (ordersByStatus || []).map(s => ({ ...s, label: STATUS_LABELS[s.status] || s.status }));
    const products = topProducts || [];

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                    <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl">
                        <CircleDollarSign size={18} />
                        <span className="text-sm font-medium">{rupiah(pendapatanHariIni)} hari ini</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`bg-gradient-to-br ${s.color} p-3.5 rounded-xl shadow-sm`}>
                                <s.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{s.value ?? 0}</p>
                                <p className="text-sm text-gray-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <ChartCard title="Trend Pendapatan" subtitle="7 hari terakhir">
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tickFormatter={v => {
                                const d = new Date(v + 'T00:00:00');
                                return d.toLocaleDateString('id-ID', { weekday: 'short' });
                            }} tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={v => rupiah(v)} tick={{ fontSize: 12 }} width={90} />
                            <Tooltip content={<CUSTOM_TOOLTIP />} />
                            <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={3} dot={{ fill: '#6366F1', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="grid lg:grid-cols-2 gap-6">
                    <ChartCard title="Produk Terlaris" subtitle="Top 5 produk">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={products} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="nama_produk" tick={{ fontSize: 12 }} width={120} />
                                <Tooltip content={({ active, payload }: any) =>
                                    active && payload?.length ? (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm">
                                            <p className="font-medium">{payload[0].payload.nama_produk}</p>
                                            <p className="text-gray-900 font-bold">{payload[0].value} terjual</p>
                                        </div>
                                    ) : null
                                } />
                                <Bar dataKey="total_terjual" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Pesanan per Status" subtitle="Distribusi status pesanan">
                        {statusData.length > 0 ? (
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="count" nameKey="label" paddingAngle={3}>
                                            {statusData.map((entry, i) => (
                                                <Cell key={i} fill={STATUS_COLORS[entry.status] || '#9CA3AF'} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={({ active, payload }: any) =>
                                            active && payload?.length ? (
                                                <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm">
                                                    <p className="font-medium">{payload[0].name}</p>
                                                    <p className="text-gray-900 font-bold">{payload[0].value} pesanan</p>
                                                </div>
                                            ) : null
                                        } />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
                                    {statusData.map((s, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-xs">
                                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: STATUS_COLORS[s.status] || '#9CA3AF' }} />
                                            <span className="text-gray-500">{s.label}</span>
                                            <span className="font-medium text-gray-800">{s.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
                        )}
                    </ChartCard>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp size={18} className="text-primary-500" /> Pesanan Terbaru</h3>
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
                                {(pesananTerbaru || []).length > 0 ? pesananTerbaru.map((order) => (
                                    <tr key={order.id_pesanan} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900">{order.akun?.nama || '-'}</td>
                                        <td className="px-5 py-3 text-gray-500">{new Date(order.tgl_pesanan).toLocaleDateString('id-ID')}</td>
                                        <td className="px-5 py-3 text-right font-medium text-gray-900">{rupiah(order.grand_total)}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TABLE_STATUS_COLORS[order.status] || ''}`}>
                                                {STATUS_LABELS[order.status] || order.status}
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
            </div>
        </>
    );
}
