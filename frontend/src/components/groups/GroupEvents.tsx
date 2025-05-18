import React from 'react';
import EventCard from "@/components/events/EventCard/EventCard";
import {fetchEventsGroup} from "@/lib/api/groups/apiGroup";

type Participant = {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
};

type Organizer = {
    id: number;
    name: string;
    avatar_url: string | null;
};

type Event = {
    id: number;
    title: string;
    description: string;
    start_timestamptz: string;
    end_timestamptz: string;
    location: string;
    participants: number[];
    friends_participants?: Participant[];
    image: string | null;
    tags: string[];
    by_group: boolean;
    organizer: Organizer;
};

export default async function GroupEvents({groupId}: { groupId: string }) {

    const events: Event[] = await fetchEventsGroup(groupId)
    console.log(events)

    if (!events || events.length < 0) {
        return <p className="text-gray-400 text-center pb-6 mt-6">Нет мероприятий для отображения</p>;
    }

    return (
        <div className="mt-4 space-y-6 flex justify-center flex-col items-center">
            {events.map((event, index) => (
                <EventCard key={index} {...event} />
            ))}
        </div>
    );
};