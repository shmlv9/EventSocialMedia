import React from "react";
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export default async function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const cookie = await cookies();
    const token = cookie.get('access_token')
    if (token) {
        redirect('/')
    }

    return (
        <div className="shadow-lg shadow-emerald-100 rounded-4xl">
            {children}
        </div>
    );
}
