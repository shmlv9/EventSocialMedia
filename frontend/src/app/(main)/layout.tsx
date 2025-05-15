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
    {href: '/explore', icon: <MdExplore/>, label: 'Поиск'},
    {href: (userID: string) => `/profile/${userID}`, icon: <FaUser/>, label: 'Профиль'},
];


const mobileNavLinks = [
    {href: '/events', icon: <FaHome/>, label: 'Главная'},
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
            <div className="min-h-screen bg-white text-white font-sans flex flex-col">
                <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Боковое меню для десктопа */}
                    <div
                        className="hidden md:block fixed left-0 top-0 h-full w-64 bg-black shadow-xl z-10">
                        <div className="p-6 h-full flex flex-col">
                            <div
                                className="text-3xl font-extrabold tracking-tight text-white mb-8 text-center">Миротека
                            </div>
                            <nav className="flex flex-col gap-3 flex-1">
                                {desktopNavLinks.map(({href, icon, label}) => (
                                    <Link
                                        key={label}
                                        href={typeof href === 'function' ? href(String(userID)) : href}
                                        className="flex items-center gap-3 text-white px-4 py-2 rounded-3xl transition"
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
                    <section className="flex-1 md:ml-64 md:p-8 overflow-y-auto">
                        <div
                            className="w-full max-w-5xl mx-auto rounded-3xl">
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