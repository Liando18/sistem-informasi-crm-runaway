import { Head, Link, usePage, router } from '@inertiajs/react';
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, MapPin, Phone, User, ArrowLeft, ShoppingBag, Map, Printer } from 'lucide-react';

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

const steps = [
    { key: 'pending', label: 'Pesanan Dibuat', icon: Clock },
    { key: 'dibayar', label: 'Dibayar', icon: CreditCard },
    { key: 'dipacking', label: 'Dipacking', icon: Package },
    { key: 'dikirim', label: 'Dikirim', icon: Truck },
    { key: 'selesai', label: 'Selesai', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    dibayar: 'bg-green-50 text-green-700 border-green-200',
    dipacking: 'bg-primary-50 text-primary-700 border-primary-200',
    dikirim: 'bg-primary-50 text-primary-700 border-primary-200',
    selesai: 'bg-green-50 text-green-700 border-green-200',
    dibatalkan: 'bg-red-50 text-red-700 border-red-200',
    belum_bayar: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function PesananShow() {
    const { pesanan } = usePage().props;

    const currentStepIndex = steps.findIndex((s) => s.key === pesanan.status);
    const isDibatalkan = pesanan.status === 'dibatalkan';

    function handlePayNow() {
        router.get(`/pembayaran/pilih/${pesanan.id_pesanan}`, {}, { preserveScroll: true });
    }

    const pay = pesanan.pembayaran;

    return (
        <>
            <Head title={`Pesanan #${pesanan.id_pesanan} - Runaway Denim`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/pesanan" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Pesanan</span>
                </Link>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pesanan #{pesanan.id_pesanan}</h1>
                            <p className="text-sm text-gray-400 mt-1">{new Date(pesanan.tgl_pesanan || pesanan.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${statusColors[pesanan.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {pesanan.status?.charAt(0).toUpperCase() + pesanan.status?.slice(1)}
                        </span>
                    </div>

                    {isDibatalkan ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                <XCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-700">Pesanan Dibatalkan</p>
                                <p className="text-red-500 text-sm">Pesanan ini telah dibatalkan.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex items-start gap-0 overflow-x-auto pb-4">
                                {steps.map((step, i) => {
                                    const StepIcon = step.icon;
                                    const isActive = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    return (
                                        <div key={step.key} className="flex-1 min-w-[100px] relative">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 relative transition-all ${
                                                    isActive
                                                        ? isCurrent
                                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110'
                                                            : 'bg-primary-600 text-white'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <StepIcon size={20} />
                                                </div>
                                                <p className={`text-xs mt-2 text-center font-semibold px-1 ${
                                                    isCurrent ? 'text-primary-600' : isActive ? 'text-gray-700' : 'text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                            {i < steps.length - 1 && (
                                                <div className={`absolute top-6 left-[55%] right-0 h-1 -translate-y-1/2 rounded-full ${
                                                    i < currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-primary-600" />
                            Data Pengiriman
                        </h3>
                        <div className="space-y-3 text-sm">
                            <p className="flex items-start gap-2 text-gray-600">
                                <MapPin size={16} className="text-primary-500 mt-0.5 shrink-0" />
                                {[pesanan.alamat_detail, pesanan.kelurahan, pesanan.kecamatan, pesanan.kabupaten, pesanan.provinsi].filter(Boolean).join(', ') || '-'}
                            </p>
                            <p className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} className="text-primary-500 shrink-0" />
                                {pesanan.no_telp_kirim}
                            </p>
                            {pesanan.latitude && pesanan.longitude && (
                                <div className="space-y-2">
                                    <div className="rounded-xl overflow-hidden border border-gray-200">
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${pesanan.latitude},${pesanan.longitude}&z=15&output=embed`}
                                            width="100%"
                                            height="200"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <a href={`https://maps.google.com/maps?q=${pesanan.latitude},${pesanan.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium text-xs">
                                        <Map size={14} /> Buka di Google Maps
                                    </a>
                                </div>
                            )}
                            {pesanan.catatan && (
                                <div className="bg-gray-50 rounded-xl p-3 mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                                    <p className="text-gray-700 italic">{pesanan.catatan}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary-600" />
                            Pembayaran
                        </h3>
                        {pay ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-500">Metode</span>
                                    <span className="font-semibold text-gray-900">{pay.metode || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[pay.status] || ''}`}>
                                        {pay.status?.charAt(0).toUpperCase() + pay.status?.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-bold text-primary-600 text-lg">{rupiah(pay.jumlah || pesanan.grand_total)}</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-400 text-sm mb-4">Belum ada pembayaran.</p>
                            </div>
                        )}
                        {pesanan.status === 'pending' && (!pay || pay.status !== 'sukses') && (
                            <button onClick={handlePayNow} className="mt-2 w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-md shadow-primary-200 text-sm">
                                Bayar Sekarang
                            </button>
                        )}
                        {pay?.status === 'sukses' && (
                            <Link href={`/pesanan/${pesanan.id_pesanan}/invoice`} className="mt-2 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all text-sm">
                                <Printer size={16} /> Cetak Invoice
                            </Link>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-primary-600" />
                            Produk Dipesan
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Produk</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-600">Harga</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-600">Qty</th>
                                    <th className="text-right px-6 py-4 font-semibold text-gray-600">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(pesanan.detail_pesanans || pesanan.detailPesanans || []).map((item: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                                    {item.produk?.gambar_utama?.gambar && <img src={`/storage/${item.produk.gambar_utama.gambar}`} alt={item.produk.nama_produk} className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-900">{item.produk?.nama_produk || item.nama_produk}</span>
                                                    {(item.variasi?.ukuran || item.variasi?.warna) && (
                                                        <div className="flex gap-2 mt-0.5 text-xs text-gray-400">
                                                            {item.variasi.ukuran && <span>Ukuran: {item.variasi.ukuran}</span>}
                                                            {item.variasi.warna && <span>Warna: {item.variasi.warna}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{rupiah(item.harga)}</td>
                                        <td className="px-6 py-4 text-center font-medium">{item.jumlah}</td>
                                        <td className="px-6 py-4 text-right font-bold">{rupiah(item.harga * item.jumlah)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gradient-to-r from-primary-50 to-primary-50">
                                    <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-700">Total</td>
                                    <td className="px-6 py-4 text-right font-bold text-primary-600 text-lg">{rupiah(pesanan.grand_total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link href="/produk" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        <ShoppingBag size={18} /> Belanja Lagi
                    </Link>
                </div>
            </div>
        </>
    );
}
