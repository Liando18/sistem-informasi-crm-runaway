import { Head, Link, usePage } from '@inertiajs/react';
import { Package, Users, ShoppingCart, TrendingUp, AlertTriangle, Eye, Wallet, CalendarDays } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import ChartCard from '@/components/chart-card';

interface Akun { nama: string }
interface StokItem { id_produk: number; nama_produk: string; stok: number }
interface Penjualan { id_pesanan: number; akun?: Akun; grand_total: number; tgl_pesanan: string }
interface RevenueItem { date: string; total: number }
interface MonthlyItem { month: number; total: number }
interface StatusItem { status: string; count: number }

interface PageProps {
    totalProduk: number; totalPelanggan: number; totalPesananSelesai: number;
    pendapatanHariIni: number; pendapatanBulanIni: number; pendapatanTahunIni: number;
    stokMenipis: StokItem[]; penjualanTerbaru: Penjualan[];
    revenueTrend: RevenueItem[]; monthlyRevenue: MonthlyItem[]; ordersByStatus: StatusItem[];
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending', dibayar: 'Dibayar', dipacking: 'Dipacking',
    dikirim: 'Dikirim', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#F59E0B', dibayar: '#3B82F6', dipacking: '#8B5CF6',
    dikirim: '#06B6D4', selesai: '#10B981', dibatalkan: '#EF4444',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

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

export default function OwnerDashboard() {
    const { totalProduk, totalPelanggan, totalPesananSelesai, pendapatanHariIni, pendapatanBulanIni, pendapatanTahunIni, stokMenipis, penjualanTerbaru, revenueTrend, monthlyRevenue, ordersByStatus } = usePage<PageProps>().props;

    const stats = [
        { label: 'Total Produk', value: totalProduk, icon: Package, color: 'from-primary-500 to-primary-600' },
        { label: 'Total Pelanggan', value: totalPelanggan, icon: Users, color: 'from-emerald-500 to-green-600' },
        { label: 'Pesanan Selesai', value: totalPesananSelesai, icon: ShoppingCart, color: 'from-amber-500 to-yellow-600' },
    ];

    const chartData = fillMissingDays(revenueTrend || [], 30);
    const monthlyData = (monthlyRevenue || []).map(m => ({ ...m, label: MONTHS[m.month - 1] || m.month }));
    const statusData = (ordersByStatus || []).map(s => ({ ...s, label: STATUS_LABELS[s.status] || s.status }));
    const lowStock = stokMenipis || [];
    const recentSales = penjualanTerbaru || [];

    return (
        <>
            <Head title="Dashboard Owner" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Owner</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                        { label: 'Hari Ini', value: pendapatanHariIni, icon: Wallet, color: 'text-primary-600' },
                        { label: 'Bulan Ini', value: pendapatanBulanIni, icon: CalendarDays, color: 'text-emerald-600' },
                        { label: 'Tahun Ini', value: pendapatanTahunIni, icon: TrendingUp, color: 'text-primary-600' },
                    ].map((rev, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <rev.icon className={`h-5 w-5 ${rev.color}`} />
                                <p className="text-sm text-gray-500">{rev.label}</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{rupiah(rev.value)}</p>
                        </div>
                    ))}
                </div>

                <ChartCard title="Trend Pendapatan (30 Hari)" subtitle="Total pendapatan per hari">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tickFormatter={v => {
                                const d = new Date(v + 'T00:00:00');
                                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                            }} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                            <YAxis tickFormatter={v => rupiah(v)} tick={{ fontSize: 12 }} width={90} />
                            <Tooltip content={<CUSTOM_TOOLTIP />} />
                            <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="grid lg:grid-cols-2 gap-6">
                    <ChartCard title="Pendapatan per Bulan" subtitle={`Tahun ${new Date().getFullYear()}`}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={v => rupiah(v)} tick={{ fontSize: 12 }} width={90} />
                                <Tooltip content={({ active, payload }: any) =>
                                    active && payload?.length ? (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm">
                                            <p className="text-gray-500 mb-1">{payload[0].payload.label}</p>
                                            <p className="font-bold text-gray-900">{rupiah(payload[0].value)}</p>
                                        </div>
                                    ) : null
                                } />
                                <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Pesanan per Status" subtitle="Distribusi status">
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
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp size={18} className="text-primary-500" /> Penjualan Terbaru</h3>
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
