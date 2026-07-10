import { Head, router } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import { CreditCard, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react'

interface SnapProps {
  snapToken: string
  snapRedirectUrl: string
  pesanan: {
    id_pesanan: number
    grand_total: number
    pembayaran: {
      id_pembayaran: number
    }
  }
}

function rupiah(value: number): string {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value))
}

export default function Snap({ snapToken, snapRedirectUrl, pesanan }: SnapProps) {
  const [snapLoading, setSnapLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)
  const snapOpened = useRef(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
    script.onload = () => {
      setSnapLoading(false)
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!snapLoading && !snapOpened.current && !done) {
      snapOpened.current = true
      setTimeout(payWithSnap, 300)
    }
  }, [snapLoading])

  useEffect(() => {
    if (done) {
      router.post(`/pembayaran/${pesanan.pembayaran.id_pembayaran}/confirm`)
    }
  }, [done])

  function payWithSnap() {
    if (paying) return
    setPaying(true)
    window.snap.pay(snapToken, {
      onSuccess: () => {
        setDone(true)
      },
    })
  }

  function openPaymentPage() {
    window.open(snapRedirectUrl, '_blank')
  }

  function copyLink() {
    navigator.clipboard.writeText(snapRedirectUrl)
    setTimeout(() => setCopied(false), 2000)
  }

  const [copied, setCopied] = useState(false)

  function handleBack() {
    router.get(`/pembayaran/pilih/${pesanan.id_pesanan}`, {}, { preserveScroll: true })
  }

  return (
    <>
      <Head title="Pembayaran - Runaway Denim" />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
              <p className="text-gray-500 mt-1">
                Total: <span className="font-bold text-primary-600 text-lg">{rupiah(pesanan.grand_total)}</span>
              </p>
            </div>

            {snapLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Memuat halaman pembayaran...</p>
              </div>
            ) : done ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <p className="font-bold text-green-700 text-lg">Pembayaran berhasil!</p>
                <p className="text-green-600 text-sm mt-1">Mengalihkan...</p>
              </div>
            ) : (
              <>
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 mb-8">
                  <p className="text-primary-700 text-sm text-center">
                    Jika jendela pembayaran tidak muncul, klik tombol di bawah untuk membukanya kembali.
                  </p>
                </div>

                <button
                  onClick={payWithSnap}
                  disabled={paying}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3.5 rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {paying ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                </button>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Atau buka halaman pembayaran:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 overflow-hidden">
                      <p className="text-sm text-gray-600 truncate">{snapRedirectUrl}</p>
                    </div>
                    <button
                      onClick={copyLink}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all shrink-0"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                    <button
                      onClick={openPaymentPage}
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-medium transition-all shrink-0"
                    >
                      <ExternalLink size={18} />
                      Buka
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
