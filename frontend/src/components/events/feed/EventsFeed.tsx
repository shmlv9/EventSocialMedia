'use client'

import EventCard from "@/components/events/EventCard/EventCard";
import Link from "next/link";
import {useState} from "react";

type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_timestamptz: string;
    end_timestamptz: string;
    sponsor_id: number;
    tags: string[];
    participants: number[];
    created_at: string;
    image: string | null;
    organizer: {
        id: number;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    };
};

type FilterType = 'recommendations' | 'friends' | 'groups';

type EventsFeedProps = {
    events: Event[];
    onFilterChange?: (filter: FilterType) => void;
    initialFilter?: FilterType;
};

export default function EventsFeed({
                                       events,
                                       onFilterChange,
                                       initialFilter = 'recommendations',
                                   }: EventsFeedProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        onFilterChange?.(filter);
    };

    console.log(events)
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFilterChange('recommendations')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                            activeFilter === 'recommendations'
                                ? 'bg-emerald-100 text-emerald-800 shadow-inner'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Рекомендации
                    </button>

                    <button
                        onClick={() => handleFilterChange('friends')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                            activeFilter === 'friends'
                                ? 'bg-emerald-100 text-emerald-800 shadow-inner'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Друзья
                    </button>

                    <button
                        onClick={() => handleFilterChange('groups')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                            activeFilter === 'groups'
                                ? 'bg-emerald-100 text-emerald-800 shadow-inner'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Группы
                    </button>
                </div>

                {/* Create button - aligned to the right with emphasis */}
                <Link
                    href="/events/create"
                    className="rounded-3xl p-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >

                    Создать мероприятие
                </Link>
            </div>
                {events.length > 0 ? (
                    <div className="w-full space-y-6 flex flex-col items-center justify-center">
                        {events.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{'Мероприятий не найдено'}</p>
                    </div>
                )}

        </div>
    );
}