'use client'

import { useState } from "react";
import EventCard from "@/components/events/EventCard/EventCard";
import { useUser } from "@/context/userContext";

type Organizer = {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
};

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
    organizer: Organizer;
};

type Props = {
    organizedEvents: Event[];
    participatingEvents: Event[];
    id: string;
};

export default function EventsMenu({ organizedEvents, participatingEvents, id }: Props) {
    const [selectedTab, setSelectedTab] = useState<'organized' | 'participating'>('organized');
    const { userID } = useUser();
    const isOwn = userID === id;

    const renderEvents = () => {
        const events = selectedTab === 'organized' ? organizedEvents : participatingEvents;

        if (!events.length) {
            return <p className="text-gray-400 text-center mt-6">Нет мероприятий для отображения</p>;
        }

        return (
            <div className="mt-4 space-y-6 flex justify-center flex-col items-center">
                {events.map(event => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 rounded-3xl border border-pink-500">
            {/* Tabs */}
            <div className="flex justify-center gap-6 border-b border-neutral-700 mb-6 pb-2">
                <button
                    onClick={() => setSelectedTab('organized')}
                    className={`py-2 px-6 text-sm font-medium rounded-full transition-colors duration-300 ${
                        selectedTab === 'organized'
                            ? 'bg-lime-400 text-black border-lime-400'
                            : 'text-gray-400 hover:text-lime-400 border border-transparent'
                    }`}
                >
                    {isOwn ? 'Мои мероприятия' : 'Организует'}
                </button>
                <button
                    onClick={() => setSelectedTab('participating')}
                    className={`py-2 px-6 text-sm font-medium rounded-full transition-colors duration-300 ${
                        selectedTab === 'participating'
                            ? 'bg-lime-400 text-black border-lime-400'
                            : 'text-gray-400 hover:text-lime-400 border border-transparent'
                    }`}
                >
                    {isOwn ? 'Посещаю' : 'Участвует'}
                </button>
            </div>
            {renderEvents()}
        </div>
    );
}