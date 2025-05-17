import "./globals.css";
import type {Metadata} from 'next'
import React from "react";
import {Toaster} from "react-hot-toast";
import './globals.css'



export const metadata: Metadata = {
    title: 'Миротека',
    description: 'Добро пожаловать в Миротеку',
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={'bg-white'}>
        <div>
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