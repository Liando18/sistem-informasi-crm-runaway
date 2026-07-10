import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Eye, ShoppingBag, Sparkles } from 'lucide-react';

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function PembayaranSukses() {
    const { pesanan } = usePage().props;

    return (
        <>
            <Head title="Pembayaran Berhasil - Runaway Denim" />

            <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                            <CheckCircle className="h-14 w-14 text-white" />
                        </div>

                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-green-100">
                            <Sparkles size={14} />
                            Pembayaran Berhasil
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h1>
                        <p className="text-gray-500 mb-8">Pesanan kamu sedang diproses. Kami akan segera mengirimkannya!</p>

                        {pesanan && (
                            <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-2xl p-5 mb-8 text-left space-y-3 border border-primary-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">ID Pesanan</span>
                                    <span className="font-bold text-gray-900">#{pesanan.id_pesanan}</span>
                                </div>
                                <div className="border-t border-primary-100/50 pt-3 flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Pembayaran</span>
                                    <span className="font-extrabold text-primary-600 text-xl">{rupiah(pesanan.grand_total)}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={`/pesanan/${pesanan?.id_pesanan}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200">
                                <Eye size={20} /> Detail Pesanan
                            </Link>
                            <Link href="/produk" className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                                <ShoppingBag size={20} /> Belanja Lagi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
