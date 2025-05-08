import "./globals.css";
import React from "react";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className=''>
        <div className="container mx-auto px-4 flex justify-center items-center flex-row min-h-screen">
            {children}
        </div>
        </body>
        </html>
    );
}
