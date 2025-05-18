'use client'

import React from 'react';
import {useUser} from "@/context/userContext";
import {useRouter} from 'next/navigation';

type Member = {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    is_admin: boolean;
}

export default function MembersMenu({filteredMembers, searchQuery}: {
    filteredMembers: Member[],
    searchQuery: string
}) {

    const {userID} = useUser()
    const router = useRouter()
    function handleRout(id: string) {
        router.push(`/profile/${id}`)
    }

    return (
        <div className="space-y-3">
            {filteredMembers.length > 0 ? (
                filteredMembers.map((member, index) => (
                    <div key={index}
                         onClick={() => handleRout(member.user_id)}
                         className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition cursor-pointer">

                        <div className="flex items-center gap-3">
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
                                    {member.first_name} {member.last_name} {member.user_id}
                                </h4>
                                {member.is_admin && (
                                    <span className="text-pink-400 text-sm">Администратор</span>
                                )}
                                {member.user_id === userID && (
                                    <span className="text-lime-500 text-sm"> - Вы</span>
                                )}
                            </div>
                        </div>
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