'use client'

import {useState} from "react";
import ProfileSettings from "@/components/profile/settings/ProfileSettings";
import NavSettings from "@/components/profile/settings/NavSettings";
import TagsSettings from "@/components/profile/settings/TagsSettings";
import {FiTag, FiUser} from "react-icons/fi";

export default function SettingsMenu() {
    const [activeTab, setActiveTab] = useState('profile');


    return (
        <div className="flex flex-col md:flex-row gap-6 w-full text-black ">
            {/* Навигация */}
            <div className="w-full md:w-64 rounded-3xl shadow-sm p-4 bg-white">
                <NavSettings
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    values={[
                        {tab: 'profile', icon: <FiUser/>, label: 'Профиль'},
                        {tab: 'tags', icon: <FiTag/>, label: 'Теги'},
                    ]}
                />
            </div>

            {/* Контент */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm p-6">
                {activeTab === 'profile' && <ProfileSettings/>}
                {activeTab === 'tags' && <TagsSettings/>}
            </div>
        </div>
    );
}