import { Head, Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, CreditCard, MapPin, Phone, User, Check, Printer } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

const steps = [
    { key: 'pending', label: 'Pesanan Dibuat', icon: Clock },
    { key: 'dibayar', label: 'Dibayar', icon: CreditCard },
    { key: 'dipacking', label: 'Dipacking', icon: Package },
    { key: 'dikirim', label: 'Dikirim', icon: Truck },
    { key: 'selesai', label: 'Selesai', icon: CheckCircle },
];

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    dibayar: 'bg-green-100 text-green-800',
    dipacking: 'bg-primary-100 text-primary-800',
    dikirim: 'bg-primary-100 text-primary-800',
    selesai: 'bg-green-100 text-green-800',
    dibatalkan: 'bg-red-100 text-red-800',
    belum_bayar: 'bg-yellow-100 text-yellow-800',
};

const nextStatus = {
    dibayar: 'dipacking',
    dipacking: 'dikirim',
    dikirim: 'selesai',
};

const nextActionLabel = {
    dibayar: 'Proses Packing',
    dipacking: 'Kirim Pesanan',
    dikirim: 'Selesaikan Pesanan',
};

export default function AdminPesananShow() {
    const { pesanan } = usePage().props;
    const pay = pesanan.pembayaran;

    const currentStepIndex = steps.findIndex((s) => s.key === pesanan.status);
    const isDibatalkan = pesanan.status === 'dibatalkan';
    const hasNext = Object.keys(nextStatus).includes(pesanan.status);

    function updateStatus(status) {
        router.patch(`/admin/pesanan/${pesanan.id_pesanan}/status`, { status }, { preserveScroll: true });
    }

    function confirmPembayaran() {
        if (pay) {
            router.patch(`/admin/pembayaran/${pay.id_pembayaran}/konfirmasi`, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={`Pesanan #${pesanan.id_pesanan} - Admin`} />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/pesanan" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Pesanan #{pesanan.id_pesanan}</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500">{new Date(pesanan.tgl_pesanan || pesanan.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[pesanan.status] || ''}`}>
                            {pesanan.status?.charAt(0).toUpperCase() + pesanan.status?.slice(1)}
                        </span>
                    </div>

                    {isDibatalkan ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">Pesanan ini telah dibatalkan.</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-0">
                            {steps.map((step, i) => {
                                const StepIcon = step.icon;
                                const isActive = i <= currentStepIndex;
                                const isCurrent = i === currentStepIndex;
                                return (
                                    <div key={step.key} className="flex-1 relative">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <StepIcon size={18} />
                                            </div>
                                            <p className={`text-xs mt-1 text-center font-medium ${isCurrent ? 'text-primary-600' : isActive ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`absolute top-5 left-[60%] right-0 h-0.5 -translate-y-1/2 ${i < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {hasNext && (
                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button onClick={() => updateStatus(nextStatus[pesanan.status])} className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm text-sm">
                                {nextActionLabel[pesanan.status]}
                            </button>
                            {pesanan.status !== 'dibatalkan' && (
                                <button onClick={() => updateStatus('dibatalkan')} className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition-all text-sm">
                                    Batalkan Pesanan
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><User size={18} /> Data Pengiriman</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-start gap-2">
                                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                {[pesanan.alamat_detail, pesanan.kelurahan, pesanan.kecamatan, pesanan.kabupaten, pesanan.provinsi].filter(Boolean).join(', ') || '-'}
                            </p>
                            <p className="flex items-center gap-2"><Phone size={16} className="text-gray-400 flex-shrink-0" /> {pesanan.no_telp_kirim}</p>
                            {pesanan.latitude && pesanan.longitude && (
                                <div className="space-y-1">
                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${pesanan.latitude},${pesanan.longitude}&z=15&output=embed`}
                                            width="100%"
                                            height="180"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                    <a href={`https://maps.google.com/maps?q=${pesanan.latitude},${pesanan.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-xs">
                                        <MapPin size={12} /> Buka Google Maps
                                    </a>
                                </div>
                            )}
                            {pesanan.catatan && <p className="text-gray-500 italic">Catatan: {pesanan.catatan}</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CreditCard size={18} /> Pembayaran</h3>
                        {pay ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Metode</span>
                                    <span className="font-medium">{pay.metode || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[pay.status] || ''}`}>
                                        {pay.status?.charAt(0).toUpperCase() + pay.status?.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Jumlah</span>
                                    <span className="font-bold text-primary-600">{rupiah(pay.jumlah || pesanan.grand_total)}</span>
                                </div>
                                {pay.status === 'pending' && (
                                    <button onClick={confirmPembayaran} className="mt-3 w-full bg-emerald-500 text-white py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all text-sm flex items-center justify-center gap-1">
                                        <Check size={16} /> Konfirmasi Pembayaran
                                    </button>
                                )}
                                {pay?.status === 'sukses' && (
                                    <Link href={`/pesanan/${pesanan.id_pesanan}/invoice`} className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all text-sm">
                                        <Printer size={16} /> Cetak Invoice
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Belum ada pembayaran.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Produk Dipesan</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium">Produk</th>
                                    <th className="text-center px-5 py-3 font-medium">Harga</th>
                                    <th className="text-center px-5 py-3 font-medium">Qty</th>
                                    <th className="text-right px-5 py-3 font-medium">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(pesanan.detail_pesanans || pesanan.detailPesanans || []).map((item, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {item.produk?.gambar_utama?.gambar && <img src={`/storage/${item.produk.gambar_utama.gambar}`} alt={item.produk.nama_produk} className="w-10 h-10 rounded object-cover" />}
                                                <div>
                                                    <span className="font-medium text-gray-900">{item.produk?.nama_produk || item.nama_produk}</span>
                                                    {item.variasi && (
                                                        <div className="flex gap-2 mt-0.5 text-xs text-gray-500">
                                                            {item.variasi.ukuran && <span>Ukuran: {item.variasi.ukuran}</span>}
                                                            {item.variasi.warna && <span>Warna: {item.variasi.warna}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center">{rupiah(item.harga)}</td>
                                        <td className="px-5 py-3 text-center">{item.jumlah}</td>
                                        <td className="px-5 py-3 text-right font-medium">{rupiah(item.harga * item.jumlah)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={3} className="px-5 py-3 text-right font-medium text-gray-600">Total</td>
                                    <td className="px-5 py-3 text-right font-bold text-primary-600 text-base">{rupiah(pesanan.grand_total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
