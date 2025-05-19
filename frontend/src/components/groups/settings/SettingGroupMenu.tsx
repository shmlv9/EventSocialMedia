'use client'

import {useEffect, useState} from "react";
import NavSettings from "@/components/profile/settings/NavSettings";
import GroupSettings from "@/components/groups/settings/tabs/MainSettingsGroup";
import {FiUser, FiTag, FiLock} from "react-icons/fi";
import GroupTags from "@/components/groups/settings/tabs/SettingsGroupTags";
import {fetchGroupClient} from "@/lib/api/groups/apiGroup";
import toast from "react-hot-toast";
import {fetchTags} from "@/lib/api/search/apiSeacrh";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
};

type Group = {
    id: number;
    name: string;
    description: string;
    creator_id: number;
    avatar_url: string | null;
    tags: string[];
    created_at: string;
    location: string;
    creator: User;
    members_count: number;
    events_count: number;
    status: 'creator' | 'admin' | 'member' | null;
    admins: User[];
    is_private?: boolean;
};

type NavItem = {
    tab: string;
    icon: React.ReactNode;
    label: string;
};

export default function SettingsGroupMenu({id}: { id: string }) {
    const [activeTab, setActiveTab] = useState<string>('main');
    const [loading, setLoading] = useState<boolean>(false);
    const [groupData, setGroupData] = useState<Group | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const navItems: NavItem[] = [
        {tab: 'main', icon: <FiUser/>, label: 'Профиль'},
        {tab: 'tags', icon: <FiTag/>, label: 'Теги'},
        {tab: 'private', icon: <FiLock/>, label: 'Приватность'},
    ];

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [group, tags] = await Promise.all([
                    fetchGroupClient(id),
                    fetchTags()
                ]);
                setGroupData(group);
                setAvailableTags(tags);
            } catch (error) {
                toast.error('Не удалось загрузить данные группы');
                console.error('Error loading group data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading || !groupData) {
        return (
            <div className="max-w-3xl mx-auto py-10 px-4 text-black">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
                </div>
            </div>
        );
    }

    if (groupData.status !== 'admin' && groupData.status !== 'creator') {
        return (
            <div className="max-w-3xl mx-auto py-10 px-4 text-black">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold">Доступ ограничен</h2>
                    <p className="text-gray-500 mt-2">
                        Только администраторы и создатели группы могут изменять настройки
                    </p>
                </div>
            </div>
        );
    }



    return (
        <div className="flex flex-col md:flex-row gap-6 w-full text-black">
            <div className="w-full md:w-64 rounded-3xl shadow-sm p-4 bg-white">
                <NavSettings
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    values={navItems}
                />
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-sm p-6">
                {activeTab === 'main' && (
                    <GroupSettings data={groupData} id={id}/>
                )}
                {activeTab === 'tags' && (
                    <GroupTags
                        id={id}
                        initialGroupData={groupData}
                        availableTags={availableTags}
                    />
                )}
                {activeTab === 'private' && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Настройки приватности</h2>
                    </div>
                )}
            </div>
        </div>
    );
}