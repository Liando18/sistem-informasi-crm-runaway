import { Link } from '@inertiajs/react'
import { home } from '@/routes'

export default function AppLogoIcon(props: React.ComponentProps<'img'>) {
    return (
        <Link href={home.url()}>
            <img src="/logo-runaway.png" alt="Runaway Denim" {...props} />
        </Link>
    )
}
