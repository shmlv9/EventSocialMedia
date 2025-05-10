'use client'

import React from 'react';
import {FiLock, FiUser} from "react-icons/fi";
import {AiOutlineTag} from "react-icons/ai";

type Props = {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function NavSettings(props: Props) {

    return (<nav className="space-y-1">
            <button
                onClick={() => props.setActiveTab('profile')}
                className={`hover:cursor-pointer flex items-center w-full px-3 py-2 rounded-3xl ${props.activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <FiUser className="text-lg mr-3"/>
                Профиль
            </button>
            <button
                onClick={() => props.setActiveTab('tags')}
                className={`hover:cursor-pointer flex items-center w-full px-3 py-2 rounded-3xl ${props.activeTab === 'tags' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <AiOutlineTag className="text-lg mr-3"/>
                Выбор тегов
            </button>
            <button
                onClick={() => props.setActiveTab('security')}
                className={`hover:cursor-pointer flex items-center w-full px-3 py-2 rounded-3xl ${props.activeTab === 'security' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <FiLock className="text-lg mr-3"/>
                Безопасность
            </button>
        </nav>
    );
};