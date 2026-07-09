import { Head, Link } from '@inertiajs/react';
import { Home, Lock, ArrowLeft } from 'lucide-react';

export default function Forbidden() {
    return (
        <>
            <Head title="Akses Ditolak" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-4">
                <div className="max-w-lg w-full text-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-100">
                        <Lock className="h-14 w-14 text-amber-500" />
                    </div>

                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-amber-100">
                        Error 403
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Akses Ditolak
                    </h1>
                    <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto">
                        Kamu tidak memiliki izin untuk mengakses halaman ini.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200"
                        >
                            <Home size={18} /> Kembali ke Beranda
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
                        >
                            <ArrowLeft size={18} /> Kembali
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
