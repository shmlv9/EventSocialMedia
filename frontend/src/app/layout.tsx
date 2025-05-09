import "./globals.css";
import type { Metadata } from 'next'
import React from "react";


export const metadata: Metadata = {
    title: 'ESM',
    description: 'Добро пожаловать в ESM',
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className='bg-gray-50'>
        <div className="container h-full mx-auto">
            {children}
        </div>
        </body>
        </html>
    );
}