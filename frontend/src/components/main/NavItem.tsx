'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

type Props = {
    href: string;
    icon: string;
    children?: React.ReactNode;
    mobile?: boolean;
}

export default function NavItem({
                                    href,
                                    icon,
                                    children,
                                    mobile = false,
                                }: Props) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={`flex items-center justify-center rounded-3xl ${
                mobile
                    ? `flex-1 p-3 text-xs ${isActive ?
                        'text-emerald-600 bg-emerald-100 ' :
                        'text-gray-500 hover:bg-gray-100 '}`
                    : `p-3 ${isActive ?
                        'text-emerald-600' :
                        'hover:bg-gray-100'}`
            } transition-colors duration-200`}
        >
            <span className={`t ext-gray-600 ${mobile ? "text-lg" : "mr-2"}`}>{icon}</span>
            {mobile ? null : children}
        </Link>
    );
}