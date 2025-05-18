'use client'

import EventsFeed from '@/components/events/feed/EventsFeed';
import {useState} from 'react';
import {fetchEvents} from "@/lib/api/events/apiEvents";
import toast from 'react-hot-toast';

type FilterType = 'recommendations' | 'friends' | 'groups';

export default function EventsPage() {
    const [events, setEvents] = useState([]);

    const handleFilterChange = async (filter: FilterType) => {

        try {
            const response = await fetchEvents(filter);

            if (response.error) {
                toast.error(response.error)
                setEvents([])
                return
            }
            setEvents(response.events);
        } catch (error) {
            console.log(error)
        } finally {
        }
    };
    return (
        <div className="container mx-auto py-8">
            <EventsFeed
                events={events}
                onFilterChange={handleFilterChange}
                initialFilter="recommendations"
            />

        </div>
    );
}