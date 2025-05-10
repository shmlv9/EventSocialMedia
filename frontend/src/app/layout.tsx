import "./globals.css";
import type {Metadata} from 'next'
import React from "react";
import {Toaster} from "react-hot-toast";


export const metadata: Metadata = {
    title: 'ESM',
    description: 'Добро пожаловать в ESM',
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className='bg-gray-50'>
        <div className="container h-full mx-auto">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#333',
                        border: '1px solid #e5e7eb',
                    },
                }}
            />
            {children}
        </div>
        </body>
        </html>
    );
}