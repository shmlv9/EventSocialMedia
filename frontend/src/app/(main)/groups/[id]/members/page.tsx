'use client'

import {FiSearch, FiUserCheck} from 'react-icons/fi'
import {useEffect, useState} from 'react'
import {use} from 'react'
import MembersMenu from "@/components/groups/members/MembersMenu"
import {fetchGroupClient, fetchMembers} from '@/lib/api/groups/apiGroup'
import {useUser} from "@/context/userContext";


type Member = {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    is_admin: boolean;
}


export default function GroupMembersPage({params}: { params: Promise<{ id: string }> }) {
    const {id: groupId} = use(params)

    const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'admins'>('members')
    const [searchQuery, setSearchQuery] = useState('')
    const [members, setMembers] = useState<Member[]>([])
    const [isAdmin, setisAdmin] = useState<boolean>(false)

    const {userID} = useUser()

    useEffect(() => {
        async function getMembers() {
            try {
                const membersData: Member[] = await fetchMembers(groupId)
                setMembers(membersData)
                const data = await fetchGroupClient(groupId)
                setisAdmin(data.creator.id.toString() === userID)
            } catch (error) {
                console.error('Error fetching members:', error)
            } finally {
            }
        }

        getMembers()
    }, [groupId, userID])

    const filteredMembers = members.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="bg-white w-full h-full rounded-3xl shadow-lg border border-gray-200 p-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-black">Участники группы</h2>
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Поиск участников..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'members' ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('members')}
                >
                    <FiUserCheck className="mr-2"/>
                    Участники ({members.length})
                </button>
            </div>

            {activeTab === 'members' && (
                <MembersMenu
                    groupId={groupId}
                    status={isAdmin}
                    filteredMembers={filteredMembers}
                    searchQuery={searchQuery}

                />
            )}
        </div>
    )
}