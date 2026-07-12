import { createInertiaApp, router } from '@inertiajs/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import ErrorBoundary from '@/components/error-boundary'
import AuthLayout from '@/layouts/auth-layout'
import AdminLayout from '@/layouts/admin-layout'
import OwnerLayout from '@/layouts/owner-layout'
import MainLayout from '@/layouts/main-layout'

const appName = import.meta.env.VITE_APP_NAME || 'Runaway Denim'

if (typeof document !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault()
        console.debug('Unhandled rejection:', event.reason)
    })

    document.addEventListener('DOMContentLoaded', () => {
        router.on('error', (event) => {
            const { errors } = (event as CustomEvent).detail ?? {}
            if (errors) {
                console.debug('Validation errors:', errors)
                toast.error('Mohon periksa kembali data yang kamu masukkan.')
            }
        })

        router.on('httpException', (event) => {
            console.debug('HTTP error:', (event as CustomEvent).detail)
            const detail = (event as CustomEvent).detail as Record<string, unknown> | undefined
            const status = detail?.response?.status ?? 0
            if (status === 404) {
                toast.error('Halaman yang diminta tidak ditemukan.')
            } else if (status >= 500) {
                console.error('Server error:', detail?.response)
            } else {
                toast.error('Terjadi kesalahan. Silakan coba lagi.')
            }
        })

        router.on('networkError', (event) => {
            console.debug('Network error:', (event as CustomEvent).detail)
            toast.error('Koneksi terputus. Periksa koneksi internet kamu.')
        })
    })
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null
            case name.startsWith('errors/'):
                return null
            case name.startsWith('auth/'):
                return AuthLayout
            case name.startsWith('admin/'):
                return AdminLayout
            case name === 'owner/laporan/cetak-stok':
                return null
            case name === 'owner/laporan/cetak-penjualan':
                return null
            case name === 'pesanan/cetak-invoice':
                return null
            case name.startsWith('owner/'):
                return OwnerLayout
            default:
                return MainLayout
        }
    },
    strictMode: import.meta.env.PROD,
    withApp(app) {
        return (
            <ErrorBoundary>
                {app}
                <Toaster />
            </ErrorBoundary>
        )
    },
    progress: {
        color: '#2b2589',
    },
})
