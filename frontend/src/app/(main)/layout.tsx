import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {fetchID} from '@/lib/api/apiUser';
import ClientWrapper from '@/context/ClientWrapper';
import Link from 'next/link';
import React from 'react';
import {FaHome, FaComments, FaUser} from 'react-icons/fa';
import {MdExplore} from 'react-icons/md';


const desktopNavLinks = [
    {href: '/events', icon: <FaHome/>, label: 'Главная'},
    {href: '/messenger', icon: <FaComments/>, label: 'Сообщения'},
    {href: '/explore', icon: <MdExplore/>, label: 'Поиск'},
    {href: (userID: string) => `/profile/${userID}`, icon: <FaUser/>, label: 'Профиль'},
];


const mobileNavLinks = [
    {href: '/events', icon: <FaHome/>, label: 'Главная'},
    {href: '/messenger', icon: <FaComments/>, label: 'Сообщения'},
    {href: '/explore', icon: <MdExplore/>, label: 'Поиск'},
    {href: (userID: string) => `/profile/${userID}`, icon: <FaUser/>, label: 'Профиль'},
];

export default async function MainLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) redirect('/login');

    const userID = await fetchID();
    if (!userID || userID.detail) redirect('/logout');

    return (
        <ClientWrapper userID={String(userID)}>
            <div className="min-h-screen bg-black text-white font-sans flex flex-col">
                <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Боковое меню для десктопа */}
                    <div
                        className="hidden md:block fixed left-0 top-0 h-full w-64 bg-black border-r border-pink-500 shadow-xl z-10">
                        <div className="p-6 h-full flex flex-col">
                            <div className="text-3xl font-extrabold tracking-tight text-pink-500 mb-8">Миротека</div>
                            <nav className="flex flex-col gap-3 flex-1">
                                {desktopNavLinks.map(({href, icon, label}) => (
                                    <Link
                                        key={label}
                                        href={typeof href === 'function' ? href(String(userID)) : href}
                                        className="flex items-center gap-3 text-white hover:bg-pink-500 hover:text-black px-4 py-2 rounded-xl transition"
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto">
                                <form action="/logout" method="POST">
                                    <button
                                        className="w-full px-4 py-2 bg-lime-400 text-black font-bold rounded-full hover:bg-lime-300 transition">
                                        Выйти
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Основной контент */}
                    <section className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto bg-neutral-950">
                        <div
                            className="w-full max-w-5xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:">
                            {children}
                        </div>
                    </section>
                </main>

                {/* Мобильное нижнее меню */}
                <nav
                    className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-pink-500 shadow-md py-3 px-6 z-50 flex justify-around">
                    {mobileNavLinks.map(({href, icon, label}) => (
                        <Link
                            key={label}
                            href={typeof href === 'function' ? href(String(userID)) : href}
                            className="text-white flex flex-col items-center justify-center gap-1 hover:text-lime-400"
                        >
                            {icon}
                            <span className="text-xs">{label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </ClientWrapper>
    );
}