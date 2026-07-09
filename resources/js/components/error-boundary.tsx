import { Component } from 'react'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.debug('React error:', error, info.componentStack)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-white p-8">
                    <div className="text-center max-w-lg">
                        <div className="text-red-500 text-6xl mb-4">!</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
                        <p className="text-gray-500 mb-6">Silakan refresh halaman untuk melanjutkan.</p>
                        <pre className="text-xs text-left bg-gray-100 p-4 rounded-xl overflow-auto max-h-48 text-red-600 mb-6">
                            {this.state.error?.message}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
                        >
                            Refresh Halaman
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}