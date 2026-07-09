import { useEffect } from 'react'
import { router } from '@inertiajs/react'

export default function Dashboard() {
    useEffect(() => {
        router.visit('/')
    }, [])
    return null
}
