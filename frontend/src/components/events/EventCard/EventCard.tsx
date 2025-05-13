'use client'

import JoinButton from "@/components/events/EventCard/JoinButton";
import DescriptionMenu from "@/components/events/EventCard/DescriptionMenu";
import {useUser} from "@/context/userContext";
import Link from "next/link";
import {useState} from "react";
import {MdModeEdit} from "react-icons/md";

type Participant = {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
};

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
    start_timestamptz: string;
    end_timestamptz: string;
    location: string;
    participants: number[];
    friends_participants?: Participant[];
    image: string | null;
    tags: string[];
    organizer: Organizer;
};

export default function EventCard(event: Event) {
    const {userID} = useUser();
    const [showFriends, setShowFriends] = useState(false);

    const startDate = new Date(event.start_timestamptz).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    const endDate = new Date(event.end_timestamptz).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    const participantsCount = event.participants?.length || 0;
    const friendsCount = event.friends_participants?.length || 0;
    const isJoined: boolean = event.participants.includes(Number(userID));

    return (
        <div
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-[0_4px_16px_0_rgba(16,185,129,0.15)] transition-shadow mb-6 max-w-xl">
            <div className="relative h-48 bg-gradient-to-r from-emerald-50 to-emerald-100">
                {event.image ? (
                    <img src={event.image} className="w-full h-full object-cover" alt={event.title}/>
                ) : (
                    <div className="flex items-center justify-center h-full">

                    </div>
                )}

                {userID === event.organizer.id.toString() && <Link
                    href={`/events/${event.id}/edit`}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <MdModeEdit/>
                </Link>}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <Link className="text-xl font-bold text-gray-800 mb-1"
                              href={`/events/${event.id}`}>{event.title}</Link>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                            <div className="flex items-center text-sm text-emerald-600">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span>{startDate}</span>
                            </div>

                            <div className="flex items-center text-sm text-emerald-600">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>{endDate}</span>
                            </div>
                        </div>

                        {event.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {event.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="bg-emerald-50 text-emerald-800 text-xs px-2 py-1 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end">
                        <span
                            className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full whitespace-nowrap mb-1">
                            {participantsCount} участников
                        </span>
                        {friendsCount > 0 && (
                            <button
                                onClick={() => setShowFriends(!showFriends)}
                                className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap hover:bg-blue-100 transition-colors"
                            >
                                {friendsCount} друг{friendsCount > 1 ? 'а' : ''} идет
                            </button>
                        )}
                    </div>
                </div>

                {showFriends && friendsCount > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Идут из друзей:</h4>
                        {event.friends_participants && <div className="flex flex-wrap gap-2">
                            {event.friends_participants.map(friend => (
                                <Link
                                    key={friend.id}
                                    href={`/profile/${friend.id}`}
                                    className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900"
                                >
                                    {friend.avatar_url ? (
                                        <img
                                            src={friend.avatar_url}
                                            alt={`${friend.first_name} ${friend.last_name}`}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <div
                                            className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-xs">
                                            {friend.first_name[0]}{friend.last_name[0]}
                                        </div>
                                    )}
                                    <span>{friend.first_name} {friend.last_name}</span>
                                </Link>
                            ))}
                        </div>}
                    </div>
                )}

                <DescriptionMenu description={event.description}/>

                <div className="flex justify-between items-end mt-4 border-t pt-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <div>
                            <p className="font-medium">Место проведения</p>
                            <p>{event.location}</p>
                        </div>
                    </div>

                    <JoinButton isJoined={isJoined} id={String(event.id)}/>
                </div>

                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                    {event.organizer.avatar_url ? (
                        <img src={event.organizer.avatar_url} alt="Ава"
                             className="w-6 h-6 rounded-full"/>
                    ) : (
                        <div
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                            {event.organizer.first_name[0]}
                        </div>
                    )}
                    <div>
                        <Link
                            href={`/profile/${event.organizer.id}`}>Организатор: {event.organizer.first_name} {event.organizer.last_name}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
