'use client'

import Link from 'next/link';
import { CiSettings } from 'react-icons/ci';

export default function SettingButton() {
    return (
        <div className="max-h-10">
            <Link
                href="/settings"
                className="m-3 p-2"
                aria-label="Настройки"
            >
                <CiSettings className="text-3xl text-lime-400 hover:text-lime-600" />
            </Link>
        </div>
    );
}