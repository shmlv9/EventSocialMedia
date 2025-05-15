'use client'

import React from 'react';
import { FiLock, FiUser } from "react-icons/fi";
import { AiOutlineTag } from "react-icons/ai";

type Props = {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function NavSettings({ activeTab, setActiveTab }: Props) {
    const baseClass = "flex items-center w-full px-4 py-2 rounded-3xl transition-colors";
    const iconClass = "text-lg mr-3";

    return (
        <nav className="space-y-2">
            <button
                onClick={() => setActiveTab('profile')}
                className={`${baseClass} ${
                    activeTab === 'profile'
                        ? 'bg-black text-lime-400 border border-lime-400'
                        : 'text-white hover:text-lime-300 hover:bg-black/40 border border-white/10'
                }`}
            >
                <FiUser className={iconClass} />
                Профиль
            </button>

            <button
                onClick={() => setActiveTab('tags')}
                className={`${baseClass} ${
                    activeTab === 'tags'
                        ? 'bg-black text-lime-400 border border-lime-400'
                        : 'text-white hover:text-lime-300 hover:bg-black/40 border border-white/10'
                }`}
            >
                <AiOutlineTag className={iconClass} />
                Выбор тегов
            </button>

            <button
                onClick={() => setActiveTab('security')}
                className={`${baseClass} ${
                    activeTab === 'security'
                        ? 'bg-black text-lime-400 border border-lime-400'
                        : 'text-white hover:text-lime-300 hover:bg-black/40 border border-white/10'
                }`}
            >
                <FiLock className={iconClass} />
                Безопасность
            </button>
        </nav>
    );
};
