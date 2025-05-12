import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {fetchID} from '@/lib/api/apiUser'
import NavItem from "@/components/main/NavItem";
import ClientWrapper from "@/context/ClientWrapper";
import React from "react";

export default async function MainLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    if (!token) redirect('/login')

    const userID = await fetchID()
    if (!userID || userID.detail) redirect('/logout')


    return (
        <ClientWrapper userID={String(userID)}>
            <div className="min-h-screen">
                {/* Десктоп */}
                <div className="hidden md:flex h-full max-w-7xl mx-auto gap-4 p-4">
                    <aside
                        className="sticky top-4 h-[calc(100vh-32px)] w-64 bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col flex-shrink-0">
                        <div className="p-4 border-b border-gray-200 flex flex-col items-center">
                            <h1 className='font-bold text-3xl text-emerald-800 mb-2'>ESM</h1>
                            <h3 className='text-gray-600'>Соцсеть для Т2</h3>
                        </div>

                        <nav className="p-4 space-y-1 flex-grow">
                            <NavItem href="/events" icon="1">Главная</NavItem>
                            <NavItem href="/messenger" icon="2">Сообщения</NavItem>
                            <NavItem href={`/profile/${userID}`} icon="3">Профиль</NavItem>
                        </nav>

                        <form action="/logout" method="POST" className="p-4">
                            <button
                                className={'p-2 rounded-3xl bg-emerald-600 text-white w-full hover:cursor-pointer hover:bg-emerald-700'}>Выйти
                            </button>
                        </form>
                    </aside>

                    <main className="flex-1 bg-white rounded-3xl overflow-y-auto p-4">
                        {children}
                    </main>
                </div>

                {/* Мобилка */}
                <div className="md:hidden flex flex-col min-h-screen">
                    <main className="flex-1 overflow-auto p-4 pb-16">
                        {children}
                    </main>
                    <nav
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg m-5 rounded-3xl">
                        <div className="flex">
                            <NavItem href="/events" icon="1" mobile/>
                            <NavItem href="/messenger" icon="2" mobile/>
                            <NavItem href={`/profile/${userID}`} icon="3" mobile/>
                        </div>
                    </nav>
                </div>
            </div>
        </ClientWrapper>
    )
}
