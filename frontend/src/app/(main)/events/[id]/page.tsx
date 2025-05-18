import React from 'react';
import {fetchEvent} from "@/lib/api/events/apiEvents";
import EventCard from "@/components/events/EventCard/EventCard";

export default async function Event({params}: { params: { id: string } }) {
    try {
        const event = await fetchEvent(params.id)
        return (
            <div className={'flex justify-center items-center h-full'}>
                <EventCard {...(event.event)}/>
            </div>
        );
    } catch (e) {
        console.log(e)
        return <div className={'text-2xl bg-white items-center justify-center flex h-full'}>
            <p>Мероприятие не найдено</p>
        </div>
    }
};