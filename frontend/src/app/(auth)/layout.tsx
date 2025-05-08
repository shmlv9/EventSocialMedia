import React from "react";

export default function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="shadow-lg shadow-emerald-100 rounded-4xl">
            {children}
        </div>
    );
}
