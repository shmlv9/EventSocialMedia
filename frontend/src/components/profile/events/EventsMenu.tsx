'use client'

import {useState} from "react";
import EventCard from "@/components/events/EventCard/EventCard";
import {useUser} from "@/context/userContext";

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

export default function EventsMenu({organizedEvents, participatingEvents, id}: Props) {

    const [selectedTab, setSelectedTab] = useState<'organized' | 'participating'>('organized');

    const {userID} = useUser()

    const isOwn = userID === id

    const renderEvents = () => {
        const events = selectedTab === 'organized' ? organizedEvents : participatingEvents;

        if (!events.length) {
            return <p className="text-gray-500 text-center mt-6">Нет мероприятий для отображения</p>;
        }

        return (
            <div className="mt-4 space-y-6">
                {events.map(event => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Tabs */}
            <div className="flex justify-center gap-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setSelectedTab('organized')}
                    className={`py-2 px-4 text-sm font-medium hover:cursor-pointer ${
                        selectedTab === 'organized'
                            ? 'border-b-2 border-emerald-500 text-emerald-600'
                            : 'text-gray-500 hover:text-emerald-600'
                    }`}
                >
                    Мои мероприятия
                </button>
                <button
                    onClick={() => setSelectedTab('participating')}
                    className={`py-2 px-4 text-sm font-medium hover:cursor-pointer ${
                        selectedTab === 'participating'
                            ? 'border-b-2 border-emerald-500 text-emerald-600'
                            : 'text-gray-500 hover:text-emerald-600'
                    }`}
                >
                    Посещаю
                </button>
            </div>
            {renderEvents()}
        </div>
    );
}
