'use client'

import {FiUser, FiTag} from "react-icons/fi";

export default function NavSettings({
                                        activeTab,
                                        setActiveTab
                                    }: {
    activeTab: 'profile' | 'tags',
    setActiveTab: (tab: 'profile' | 'tags') => void
}) {
    return (
        <nav className="space-y-2">
            <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-3xl text-left transition-colors ${
                    activeTab === 'profile'
                        ? ' text-black bg-pink-500 font-medium'
                        : 'text-gray-400 hover:text-black'
                }`}
            >
                <FiUser className="flex-shrink-0"/>
                Профиль
            </button>

            <button
                onClick={() => setActiveTab('tags')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-3xl text-left transition-colors ${
                    activeTab === 'tags'
                        ? ' text-black bg-pink-500 font-medium'
                        : 'text-gray-400 hover:text-black'
                }`}
            >
                <FiTag className="flex-shrink-0"/>
                Интересы
            </button>
        </nav>
    );
}