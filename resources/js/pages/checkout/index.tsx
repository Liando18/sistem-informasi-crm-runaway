import { Head, Link, usePage, useForm } from '@inertiajs/react'
import AddressPicker from '@/components/address-picker'
import MapPicker, { STORE_LOCATION } from '@/components/map-picker'
import { ShoppingCart, Check, MapPin, ArrowLeft, CreditCard, Package, Sparkles, Truck, Gift } from 'lucide-react'
import { proses } from '@/routes/checkout'
import type { Auth } from '@/types'
import { useState, useEffect } from 'react'

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value))
}

interface Variasi {
    id_produk_variasi: number
    ukuran: string
    warna: string
    stok: number
}

interface GambarUtama {
    gambar: string
}

interface Produk {
    id_produk: number
    nama_produk: string
    harga: number
    gambar_utama?: GambarUtama
    gambarUtama?: GambarUtama
    variasis?: Variasi[]
    diskon?: DiskonItem | null
}

interface KeranjangItem {
    id: number
    produk_id: number
    produk_variasi_id: number | null
    jumlah: number
    produk: Produk
}

interface DiskonItem {
    id_diskon: number
    nama_diskon: string
    tipe: 'persen' | 'nominal'
    nilai: number
    min_belanja: number | null
    status: string
    tanggal_mulai: string
    tanggal_berakhir: string
    jenis_diskon?: string
    pemilik_id?: number | null
    maks_penggunaan?: number | null
    digunakan?: number
}

interface VoucherItem extends DiskonItem {}

export default function CheckoutIndex() {
    const { items, total, diskons, vouchers, auth, ongkirSetting } = usePage<{ props: { items: KeranjangItem[]; total: number; diskons: DiskonItem[]; vouchers: VoucherItem[]; auth: Auth; ongkirSetting: { jarak_gratis: number; ongkir_per_km: number; jarak_per_kenaikan: number } } }>().props

    const { data, setData, post, processing, errors } = useForm({
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        alamat_detail: '',
        no_telp_kirim: (auth.user?.no_telp as string) ?? '',
        latitude: '',
        longitude: '',
        catatan: '',
        ongkir: 0,
        jarak: 0,
        voucher_id: null as number | null,
    })

    const [jarak, setJarak] = useState(0)
    const [loadingJarak, setLoadingJarak] = useState(false)
    const [voucherDipilih, setVoucherDipilih] = useState<number | null>(null)

    const itemsWithDiskon = items.filter((item) => item.produk.diskon && diskons.some((d) => d.id_diskon === item.produk.diskon.id_diskon && d.status === 'aktif'))
    const diDalamGratis = jarak <= (ongkirSetting?.jarak_gratis ?? 0)

    const totalHarga: number = total || items.reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0)
    const potongan: number = itemsWithDiskon.reduce((sum, item) => {
        const d = item.produk.diskon as DiskonItem
        return sum + (d.tipe === 'persen' ? item.produk.harga * item.jumlah * d.nilai / 100 : Math.min(d.nilai, item.produk.harga * item.jumlah))
    }, 0)
    const jarakKenaikan = ongkirSetting?.jarak_per_kenaikan ?? 10
    const ongkirPerKm = ongkirSetting?.ongkir_per_km ?? 2500
    const jarakGratis = ongkirSetting?.jarak_gratis ?? 0
    const jarakBayar = diDalamGratis ? 0 : jarak
    const ongkirNormal = diDalamGratis ? 0 : (jarakBayar / jarakKenaikan) * ongkirPerKm
    const ongkir = voucherDipilih ? 0 : ongkirNormal
    const grandTotal: number = totalHarga - potongan + ongkir

    useEffect(() => {
        setData('ongkir', ongkir)
        setData('jarak', jarak)
        setData('voucher_id', voucherDipilih)
    }, [ongkir, jarak, voucherDipilih])

    useEffect(() => {
        if (data.latitude && data.longitude) {
            hitungJarak(parseFloat(data.latitude), parseFloat(data.longitude))
        }
    }, [data.latitude, data.longitude])

    async function hitungJarak(lat: number, lng: number) {
        setLoadingJarak(true)
        try {
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${STORE_LOCATION.lng},${STORE_LOCATION.lat};${lng},${lat}?overview=false`
            )
            const json = await res.json()
            if (json.code === 'Ok' && json.routes.length > 0) {
                setJarak(Math.round(json.routes[0].distance / 1000))
            } else {
                fallbackJarak(lat, lng)
            }
        } catch {
            fallbackJarak(lat, lng)
        }
        setLoadingJarak(false)
    }

    function fallbackJarak(lat: number, lng: number) {
        const R = 6371
        const dLat = (lat - STORE_LOCATION.lat) * Math.PI / 180
        const dLng = (lng - STORE_LOCATION.lng) * Math.PI / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(STORE_LOCATION.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        setJarak(Math.round(R * c))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(proses.url(), { preserveScroll: true })
    }

    return (
        <>
            <Head title="Checkout - Runaway Denim" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/keranjang" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Keranjang</span>
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary-600" />
                                    Alamat Pengiriman
                                </h2>
                                <AddressPicker
                                    value={data}
                                    onChange={(field, value) => setData(field as keyof typeof data, value)}
                                    errors={errors}
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary-600" />
                                    Pilih Lokasi di Peta
                                </h2>
                                <MapPicker
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    onChange={(field, value) => setData(field as keyof typeof data, value)}
                                />
                                {errors.latitude && <p className="text-red-500 text-sm mt-2">{errors.latitude}</p>}
                                {errors.longitude && <p className="text-red-500 text-sm mt-2">{errors.longitude}</p>}

                                {data.latitude && data.longitude && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <Truck size={18} className="text-primary-600 shrink-0" />
                                            <span>
                                                Jarak pengantaran:{' '}
                                                <strong>{loadingJarak ? 'Menghitung...' : `${jarak} km`}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm mt-1.5">
                                            <Package size={18} className="text-primary-600 shrink-0" />
                                            <span>
                                                {diDalamGratis ? (
                                                    <span className="text-green-600 font-medium">GRATIS ongkir (dalam {jarakGratis} km)</span>
                                                ) : voucherDipilih ? (
                                                    <span className="text-green-600 font-medium">GRATIS ongkir (Voucher)</span>
                                                ) : (
                                                    <span>Ongkos kirim: <strong>{rupiah(ongkir)}</strong> ({rupiah(ongkirPerKm)}/km, per {jarakKenaikan}km)</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {vouchers.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                    <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                        <Gift size={20} className="text-primary-600" />
                                        Voucher Ongkir
                                    </h2>
                                    <div className="space-y-3">
                                        {vouchers.map((v) => {
                                            const dipilih = voucherDipilih === v.id_diskon
                                            const habis = v.maks_penggunaan != null && (v.digunakan ?? 0) >= v.maks_penggunaan
                                            return (
                                                <div
                                                    key={v.id_diskon}
                                                    onClick={() => { if (!habis) setVoucherDipilih(dipilih ? null : v.id_diskon); }}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                        habis ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' :
                                                        dipilih ? 'border-primary-600 bg-primary-50' : 'border-gray-100 bg-white hover:border-primary-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dipilih ? 'bg-primary-600' : 'bg-purple-100'}`}>
                                                            <Gift size={20} className={dipilih ? 'text-white' : 'text-purple-600'} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm text-gray-900">{v.nama_diskon}</p>
                                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                                                <span>Berlaku hingga {new Date(v.tanggal_berakhir).toLocaleDateString('id-ID')}</span>
                                                                {v.min_belanja > 0 && <span>Min. {rupiah(v.min_belanja)}</span>}
                                                            </div>
                                                        </div>
                                                        {dipilih && <Check size={20} className="text-primary-600 shrink-0" />}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5">Catatan (opsional)</h2>
                                <textarea
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    rows={2}
                                    placeholder="Catatan untuk penjual..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50/50"
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <Sparkles size={20} className="text-primary-600" />
                                    Promo
                                </h2>
                                {itemsWithDiskon.length > 0 ? (
                                    <div className="space-y-3">
                                        {itemsWithDiskon.map((item) => {
                                            const d = item.produk.diskon as DiskonItem
                                            return (
                                                <div key={item.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-amber-800">
                                                                {item.produk.nama_produk}
                                                            </p>
                                                            <p className="text-xs text-amber-700 mt-0.5">
                                                                {d.tipe === 'persen' ? `Diskon ${d.nilai}%` : `Diskon ${rupiah(d.nilai)}`}
                                                                {d.tanggal_berakhir && ` — promo hingga ${new Date(d.tanggal_berakhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                                            </p>
                                                            <p className="text-xs text-amber-600 mt-1 font-medium">
                                                                Checkout sekarang dan hemat {rupiah(d.tipe === 'persen' ? item.produk.harga * item.jumlah * d.nilai / 100 : Math.min(d.nilai, item.produk.harga * item.jumlah))}!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border border-green-100">
                                            <Check size={18} className="text-green-500 shrink-0" />
                                            Potongan promo otomatis: <strong>-{rupiah(potongan)}</strong>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Tidak ada promo aktif saat ini</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm h-fit lg:sticky lg:top-24">
                            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                <Package size={20} className="text-primary-600" />
                                Ringkasan Pesanan
                            </h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => {
                                    const produk = item.produk
                                    const selectedVariasi = produk.variasis?.find(
                                        (v) => v.id_produk_variasi === item.produk_variasi_id
                                    )
                                    return (
                                        <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {(produk.gambar_utama?.gambar || produk.gambarUtama?.gambar) && (
                                                    <img
                                                        src={`/storage/${(produk.gambar_utama?.gambar || produk.gambarUtama?.gambar)}`}
                                                        alt={produk.nama_produk}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{produk.nama_produk}</p>
                                                {item.produk_variasi_id && selectedVariasi && (
                                                    <p className="text-xs text-gray-400">
                                                        {selectedVariasi.ukuran} / {selectedVariasi.warna}
                                                    </p>
                                                )}
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-400">x{item.jumlah}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{rupiah(produk.harga * item.jumlah)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold">{rupiah(totalHarga)}</span>
                                </div>
                                {potongan > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Potongan</span>
                                        <span>-{rupiah(potongan)}</span>
                                    </div>
                                )}
                                {data.latitude && data.longitude && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Truck size={14} /> Ongkir
                                        </span>
                                        <span className={diDalamGratis || voucherDipilih ? 'text-green-600 font-medium' : 'font-semibold'}>
                                            {voucherDipilih ? 'GRATIS 🎉' : diDalamGratis ? 'GRATIS' : rupiah(ongkir)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Grand Total</span>
                                    <span className="text-primary-600">{rupiah(grandTotal)}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing || items.length === 0 || loadingJarak}
                                className="mt-6 w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3.5 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</span>
                                ) : (
                                    <><CreditCard size={20} /> Bayar Sekarang</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
