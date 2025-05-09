import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export default async function MainLayout({children}: { children: React.ReactNode }) {
    const cookie = await cookies();
    const token = cookie.get('access_token')
    if (!token) {
        redirect('/login')
    }

    return (
        <div>
            <header>
                <h1>Моя социальная сеть</h1>
            </header>
            <main>{children}</main>
        </div>
    )
}
