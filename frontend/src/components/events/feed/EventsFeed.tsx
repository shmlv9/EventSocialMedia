'use client'

import EventCard from "@/components/events/EventCard/EventCard";
import Link from "next/link";
import { useState } from "react";

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

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex gap-2">
                    {/* Filter Buttons */}
                    {['recommendations', 'friends', 'groups'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter as FilterType)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                                activeFilter === filter
                                    ? 'bg-lime-400 text-black shadow-inner'
                                    : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 border border-neutral-700'
                            }`}
                        >
                            {filter === 'recommendations' ? 'Рекомендации' : filter === 'friends' ? 'Друзья' : 'Группы'}
                        </button>
                    ))}
                </div>

                {/* Create Event Button */}
                <Link
                    href="/events/create"
                    className="rounded-3xl p-2 bg-lime-400 text-black hover:bg-lime-300 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2 border border-lime-400"
                >
                    Создать мероприятие
                </Link>
            </div>

            {/* Event List or Empty State */}
            {events.length > 0 ? (
                <div className="w-full space-y-6 flex flex-col items-center justify-center">
                    {events.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Мероприятий не найдено</p>
                </div>
            )}
        </div>
    );
}