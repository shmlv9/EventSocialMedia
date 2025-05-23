'use client'

import {useEffect, useState} from 'react'
import {fetchGroups} from "@/lib/api/groups/apiGroup"
import toast from 'react-hot-toast'
import {fetchTags} from "@/lib/api/search/apiSeacrh";
import Link from 'next/link'
import GroupCard from "@/components/groups/card/GroupCard";

type Group = {
    id: number
    name: string
    avatar_url: string | null
    members_count: number | null
    events_count: number | null
    location: string
    tags: string[]
    description?: string
}

export default function GroupsByTags() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const groupsData = await fetchGroups()
                const tagsData = await fetchTags()
                if (groupsData) setGroups(groupsData)
                if (tagsData) setTags(tagsData)
            } catch (error) {
                console.log(error)
                toast.error('Произошла ошибка при загрузке данных')
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const filteredGroups = selectedTag
        ? groups.filter(group => group.tags.includes(selectedTag))
        : groups

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className={'flex flex-row justify-between'}>
                <h1 className="text-2xl font-bold text-black mb-6">Группы по интересам</h1>
                <Link
                    href="/groups/create"
                    className="rounded-3xl p-2 bg-lime-400 text-black hover:bg-lime-300 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2 border border-lime-400 mb-5"
                >
                    Создать группу
                </Link>
            </div>

            {/* Теги для фильтрации */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-pink-500 text-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                    Все группы
                </button>

                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-pink-500 text-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        #{tag}
                    </button>
                ))}
            </div>


                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div
                            className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredGroups.map(group => (
                                <GroupCard key={group.id} group={group}/>
                            ))}
                        </div>
                    </>
                )}
        </div>
    )

}