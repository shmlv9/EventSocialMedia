'use client'

import { FiUsers, FiMapPin } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

type GroupCardProps = {
    group: {
        id: number
        name: string
        avatar_url: string | null
        members_count: number | null
        events_count: number | null
        location: string
        tags: string[]
        description?: string
    }
}

export default function GroupCard({ group }: GroupCardProps) {
    const router = useRouter()
    const displayedTags = group.tags.slice(0, 6)
    const hiddenCount = group.tags.length - displayedTags.length

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
            {/* Аватар и заголовок */}
            <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-lime-400 shadow-sm bg-white">
                    {group.avatar_url ? (
                        <img
                            src={group.avatar_url}
                            alt={group.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <FiUsers className="text-2xl" />
                        </div>
                    )}
                </div>
                <div>
                    <h3
                        className="font-semibold text-lg text-black cursor-pointer hover:underline"
                        onClick={() => router.push(`/groups/${group.id}`)}
                    >
                        {group.name}
                    </h3>
                    {group.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiMapPin className="text-lime-500" />
                            <span>{group.location}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Описание */}
            {group.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {group.description}
                </p>
            )}

            {/* Теги */}
            {group.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {displayedTags.map(tag => (
                        <span
                            key={`${group.id}-${tag}`}
                            className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
                        >
                            #{tag}
                        </span>
                    ))}
                    {hiddenCount > 0 && (
                        <span className="text-xs text-gray-500">+{hiddenCount}</span>
                    )}
                </div>
            )}

            {/* Кнопка */}
            <button
                className="mt-auto w-full bg-lime-400 hover:bg-lime-500 text-black font-medium py-2 rounded-3xl transition cursor-pointer"
                onClick={() => router.push(`/groups/${group.id}`)}
            >
                Перейти
            </button>
        </div>
    )
}
