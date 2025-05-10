import React from "react";
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export default async function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const cookie = await cookies();
    const token = cookie.get('token')
    if (token) {
        redirect('/')
    }

    return (
        <div className="min-h-screen justify-center items-center flex">
            {children}
        </div>
    );
}
