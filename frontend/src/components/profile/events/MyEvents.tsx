import React from 'react';
import {fetchEventUserCreated, fetchEventUserParticipants} from "@/lib/api/events/apiEvents";
import EventsMenu from "@/components/profile/events/EventsMenu";


export default async function MyEvents({id}: { id: string }) {

    const eventsCreated = await fetchEventUserCreated(id)
    const eventsParticipants = await fetchEventUserParticipants(id)

    return (
        <div>
            <EventsMenu
                id={id}
                organizedEvents={eventsCreated.events}
                participatingEvents={eventsParticipants.events}
            />

        </div>
    );
};