import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { QrCode, CreditCard, Building } from 'lucide-react'

interface PilihProps {
  pesanan: {
    id_pesanan: number
    grand_total: number
    pembayaran: any | null
  }
}

function rupiah(value: number): string {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value))
}

export default function Pilih({ pesanan }: PilihProps) {
  const [loading, setLoading] = useState(false)

  function handleLanjut() {
    setLoading(true)
    router.get(`/pembayaran/snap/${pesanan.id_pesanan}`, {}, { preserveScroll: true })
  }

  return (
    <>
      <Head title="Pilih Pembayaran - Runaway Denim" />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
              <p className="text-gray-500 mt-1">
                Total: <span className="font-bold text-primary-600">{rupiah(pesanan.grand_total)}</span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 bg-gray-50">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Virtual Account</p>
                  <p className="text-sm text-gray-400">BCA, BNI, BRI, Mandiri</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 bg-gray-50">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <QrCode className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">QRIS</p>
                  <p className="text-sm text-gray-400">Scan QR menggunakan e-Wallet atau Mobile Banking</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-8">
              <p className="text-primary-700 text-sm text-center">
                Setelah klik "Lanjutkan Pembayaran", kamu bisa memilih metode pembayaran yang tersedia di halaman Midtrans.
              </p>
            </div>

            <button
              onClick={handleLanjut}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3.5 rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
