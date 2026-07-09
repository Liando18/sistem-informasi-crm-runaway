import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface SnapProps {
  snapToken: string
  pesanan: {
    id_pesanan: number
    grand_total: number
    pembayaran: {
      snap_token: string
      snap_redirect_url: string
    }
  }
}

export default function Snap({ snapToken, pesanan }: SnapProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
    script.onload = () => {
      setLoading(false)
      window.snap.pay(snapToken, {
        onSuccess: () => {
          window.location.href = route('pembayaran.sukses', pesanan.id_pesanan)
        },
        onPending: () => {
          window.location.href = route('pembayaran.sukses', pesanan.id_pesanan)
        },
        onError: () => {
          alert('Pembayaran gagal, silakan coba lagi')
        },
        onClose: () => {
          window.location.href = route('pembayaran.sukses', pesanan.id_pesanan)
        },
      })
    }
    document.body.appendChild(script)
  }, [])

  return (
    <>
      <Head title="Pembayaran" />
      <div className="flex items-center justify-center min-h-screen">
        {loading && <p className="text-lg">Memuat pembayaran...</p>}
      </div>
    </>
  )
}
