'use client'

import React from 'react';
import { useUser } from "@/context/userContext";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { toggleAdminId } from "@/lib/api/groups/apiGroup";
import { FiShield, FiShieldOff } from 'react-icons/fi';

type Member = {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    is_admin: boolean;
}

export default function MembersMenu({ filteredMembers, searchQuery, status, groupId }: {
    filteredMembers: Member[],
    searchQuery: string,
    status: boolean,
    groupId: string,
}) {
    const { userID } = useUser()
    const router = useRouter()

    function handleRout(id: string) {
        router.push(`/profile/${id}`)
    }

    async function toggleAdmin(id: string, last_name: string, first_name: string, currentStatus: boolean) {
        try {
            const response = await toggleAdminId(groupId, id)
            if (response) {
                toast.success(
                    currentStatus
                        ? `Пользователь ${last_name} ${first_name} больше не администратор`
                        : `Пользователь ${last_name} ${first_name} назначен администратором`
                )
            }
        } catch (e) {
            toast.error('Произошла ошибка')
        }
    }

    return (
        <div className="space-y-3">
            {filteredMembers.length > 0 ? (
                filteredMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition">
                        <div
                            onClick={() => handleRout(member.user_id)}
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                            {member.avatar_url ? (
                                <img
                                    src={member.avatar_url}
                                    alt={`${member.first_name} ${member.last_name}`}
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div
                                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                    {member.first_name[0]}{member.last_name[0]}
                                </div>
                            )}
                            <div>
                                <h4 className="font-medium text-black">
                                    {member.first_name} {member.last_name}
                                </h4>
                                {member.is_admin && (
                                    <span className="text-pink-400 text-sm">Администратор</span>
                                )}
                                {member.user_id === userID && (
                                    <span className="text-lime-500 text-sm"> - Вы</span>
                                )}
                            </div>
                        </div>
                        {status && member.user_id.toString() !== userID.toString() && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAdmin(member.user_id, member.last_name, member.first_name, member.is_admin);
                                    }}
                                    className={`p-2 rounded-full transition-colors ${
                                        member.is_admin 
                                            ? 'text-red-500 hover:bg-red-50' 
                                            : 'text-lime-500 hover:bg-lime-50'
                                    }`}
                                    title={member.is_admin ? "Убрать админа" : "Назначить админом"}
                                >
                                    {member.is_admin ? <FiShieldOff /> : <FiShield />}
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-6">
                    {searchQuery ? 'Участники не найдены' : 'В группе пока нет участников'}
                </p>
            )}
        </div>
    )
}