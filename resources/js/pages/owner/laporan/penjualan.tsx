import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function OwnerLaporanPenjualan() {
    const props = usePage().props;
    const { tipe, tanggal, bulan, tahun, orders, totalPesanan, totalPendapatan, totalProdukTerjual, rows } = props;

    const [curTipe, setCurTipe] = useState(tipe || 'perhari');
    const [curTanggal, setCurTanggal] = useState(tanggal || '');
    const [curBulan, setCurBulan] = useState(String(bulan || now().month));
    const [curTahun, setCurTahun] = useState(String(tahun || now().year));

    function now() {
        const d = new Date();
        return { month: d.getMonth() + 1, year: d.getFullYear() };
    }

    function filter() {
        const params: Record<string, string> = { tipe: curTipe };
        if (curTipe === 'perhari') params.tanggal = curTanggal;
        else if (curTipe === 'perbulan') { params.bulan = curBulan; params.tahun = curTahun; }
        else params.tahun = curTahun;
        router.get('/owner/laporan/penjualan', params, { preserveState: true });
    }

    function cetakUrl() {
        let url = '/owner/laporan/penjualan/cetak?tipe=' + curTipe;
        if (curTipe === 'perhari') url += '&tanggal=' + curTanggal;
        else if (curTipe === 'perbulan') url += '&bulan=' + curBulan + '&tahun=' + curTahun;
        else url += '&tahun=' + curTahun;
        return url;
    }

    return (
        <>
            <Head title="Laporan Penjualan - Owner" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                    </div>
                    <Link href={cetakUrl()} className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all shadow-sm">
                        <Printer size={18} /> Cetak
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[
                            { key: 'perhari', label: 'Perhari' },
                            { key: 'perbulan', label: 'Perbulan' },
                            { key: 'pertahun', label: 'Pertahun' },
                        ].map((p) => (
                            <button
                                key={p.key}
                                onClick={() => { setCurTipe(p.key); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${curTipe === p.key ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 items-end">
                        {curTipe === 'perhari' && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                                <input type="date" value={curTanggal} onChange={(e) => setCurTanggal(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                            </div>
                        )}
                        {curTipe === 'perbulan' && (
                            <>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Bulan</label>
                                    <select value={curBulan} onChange={(e) => setCurBulan(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
                                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((name, i) => (
                                            <option key={i + 1} value={i + 1}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tahun</label>
                                    <input type="number" value={curTahun} onChange={(e) => setCurTahun(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none w-24" />
                                </div>
                            </>
                        )}
                        {curTipe === 'pertahun' && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tahun</label>
                                <input type="number" value={curTahun} onChange={(e) => setCurTahun(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none w-24" />
                            </div>
                        )}
                        <button onClick={filter} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all text-sm">
                            Tampilkan
                        </button>
                    </div>
                </div>

                {curTipe === 'perhari' && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-900">{totalPesanan || 0}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
                                <p className="text-2xl font-bold text-emerald-600">{rupiah(totalPendapatan || 0)}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Produk Terjual</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProdukTerjual || 0}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Detail Penjualan</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                            <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                                            <th className="text-left px-5 py-3 font-medium">Produk</th>
                                            <th className="text-center px-5 py-3 font-medium">Jumlah</th>
                                            <th className="text-right px-5 py-3 font-medium">Total</th>
                                            <th className="text-center px-5 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(orders || []).length > 0 ? orders.map((order, i) => (
                                            <tr key={order.id_pesanan} className="hover:bg-gray-50">
                                                <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                                <td className="px-5 py-3 font-medium text-gray-900">{order.akun?.nama || '-'}</td>
                                                <td className="px-5 py-3 text-gray-600 text-xs">
                                                    {order.detail_pesanans?.map((d, di) => (
                                                        <div key={di}>{d.produk?.nama_produk}{d.variasi ? ' (' + d.variasi.warna + ', ' + d.variasi.ukuran + ')' : ''} x{d.jumlah}</div>
                                                    ))}
                                                </td>
                                                <td className="px-5 py-3 text-center">{order.detail_pesanans?.reduce((s, d) => s + (d.jumlah || 0), 0)}</td>
                                                <td className="px-5 py-3 text-right font-medium text-purple-600">{rupiah(order.grand_total)}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'selesai' || order.status === 'sukses' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {(curTipe === 'perbulan' || curTipe === 'pertahun') && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">
                                {curTipe === 'perbulan' ? 'Rekap Penjualan Per Minggu' : 'Rekap Penjualan Per Bulan'}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                        <th className="text-left px-5 py-3 font-medium">{curTipe === 'perbulan' ? 'Minggu Ke' : 'Bulan'}</th>
                                        <th className="text-center px-5 py-3 font-medium">Total Barang Terjual</th>
                                        <th className="text-right px-5 py-3 font-medium">Total Penjualan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(rows || []).length > 0 ? rows.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                            <td className="px-5 py-3 font-medium text-gray-900">{row.minggu_ke || row.bulan}</td>
                                            <td className="px-5 py-3 text-center">{row.total_barang}</td>
                                            <td className="px-5 py-3 text-right font-medium text-purple-600">{rupiah(row.total_penjualan)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
