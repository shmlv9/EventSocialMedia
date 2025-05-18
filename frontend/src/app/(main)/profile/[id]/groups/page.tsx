'use client'

import React, {useState, useMemo, useEffect, use} from 'react'
import {FiSearch, FiUsers} from 'react-icons/fi'
import toast from 'react-hot-toast'
import {useRouter} from 'next/navigation'
import {useUser} from "@/context/userContext"
import LeaveButtonProfile from "@/components/profile/groups/LeaveButtonProfile";
import {fetchGroupsUser} from "@/lib/api/groups/apiGroup";

type Group = {
    id: string
    name: string
    avatar_url: string | null
    members_count: number
    description?: string
}


export default function UserGroupsMenu({params}: { params: Promise<{ id: string }> }) {
    const {id: id} = use(params)

    const [searchQuery, setSearchQuery] = useState('')
    const [groups, setGroups] = useState<Group[]>([])

    const {userID} = useUser()
    const router = useRouter()

    const filteredGroups = useMemo(() =>
        groups.filter(group =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase())
        ), [groups, searchQuery])

    useEffect(() => {
        async function loadData() {
            const response = await fetchGroupsUser(id)
            if (response) {
                setGroups(response)
            } else {
                toast.error("Что-то пошло не так. Попробуйте позже")
            }
        }

        loadData()
    }, [id]);
    const handleRedirect = (groupId: string) => {
        router.push(`/groups/${groupId}`)
    }


    return (
        <div className="bg-white w-full h-full rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-black">{userID === id ? 'Мои группы' : 'Группы'}</h2>
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Поиск групп..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group, index) => (
                        <div
                            key={group.id || index}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition"
                        >
                            <div
                                className="flex items-center hover:cursor-pointer gap-3 flex-1"
                                onClick={() => handleRedirect(group.id)}
                            >
                                {group.avatar_url ? (
                                    <img
                                        src={group.avatar_url}
                                        alt={group.name}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                        {group.name[0]}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-black">{group.name}</h4>
                                    {group.description && (
                                        <p className="text-sm text-gray-500 line-clamp-1">{group.description}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {group.members_count} участников
                                    </p>
                                </div>
                            </div>
                            {userID === id && (
                                <LeaveButtonProfile id={group.id}/>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiUsers className="mx-auto text-4xl mb-2"/>
                        <p>{searchQuery ? 'Группы не найдены' : (userID === id ? 'У вас пока нет групп' : 'Группы отсутствуют')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}