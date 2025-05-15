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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8 w-full max-w-2xl hover:shadow-2xl transition-all duration-300">
            {/* Изображение (увеличенная область) */}
            <div className="relative h-80 bg-gray-100">
                {event.image ? (
                    <img
                        src={event.image}
                        className="w-full h-full object-cover"
                        alt={event.title}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                        Изображение мероприятия
                    </div>
                )}

                {/* Бейдж организатора */}
                {userID === event.organizer.id.toString() && (
                    <Link
                        href={`/events/${event.id}/edit`}
                        className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Редактировать мероприятие"
                    >
                        <MdModeEdit className="text-black text-xl"/>
                    </Link>
                )}
            </div>

            {/* Основное содержимое */}
            <div className="p-6">
                {/* Заголовок и даты */}
                <div className="mb-6">
                    <Link
                        href={`/events/${event.id}`}
                        className="text-2xl font-bold text-black hover:text-lime-500 transition-colors"
                    >
                        {event.title}
                    </Link>

                    <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span>{startDate}</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>{endDate}</span>
                        </div>
                    </div>
                </div>

                {/* Теги и участники */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    {event.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="bg-black text-white px-4 py-2 rounded-full text-sm">
                            {participantsCount} участников
                        </span>
                        {friendsCount > 0 && (
                            <button
                                onClick={() => setShowFriends(!showFriends)}
                                className="bg-white text-black px-4 py-2 rounded-full border border-black hover:bg-gray-100 transition-colors text-sm"
                            >
                                {friendsCount} друг{friendsCount > 1 ? 'а' : ''}
                            </button>
                        )}
                    </div>
                </div>

                {/* Друзья-участники */}
                {showFriends && friendsCount > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-black mb-3">Друзья, которые идут:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {event.friends_participants?.map(friend => (
                                <Link
                                    key={friend.id}
                                    href={`/profile/${friend.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {friend.avatar_url ? (
                                        <img
                                            src={friend.avatar_url}
                                            alt={`${friend.first_name} ${friend.last_name}`}
                                            className="w-10 h-10 rounded-full border-2 border-black object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-black">
                                            {friend.first_name[0]}{friend.last_name[0]}
                                        </div>
                                    )}
                                    <span className="font-medium">{friend.first_name} {friend.last_name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Описание */}
                <div className="mb-6">
                    <DescriptionMenu description={event.description} />
                </div>

                {/* Место проведения */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                    <svg className="flex-shrink-0 w-6 h-6 text-lime-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div>
                        <h4 className="font-bold text-lg text-black mb-1">Место проведения</h4>
                        <p className="text-gray-700">{event.location}</p>
                    </div>
                </div>

                {/* Организатор и кнопка */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        {event.organizer.avatar_url ? (
                            <img
                                src={event.organizer.avatar_url}
                                alt="Аватар организатора"
                                className="w-12 h-12 rounded-full border-2 border-black object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-black">
                                {event.organizer.first_name[0]}
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Организатор</p>
                            <Link
                                href={`/profile/${event.organizer.id}`}
                                className="font-bold text-black hover:text-lime-500 transition-colors"
                            >
                                {event.organizer.first_name} {event.organizer.last_name}
                            </Link>
                        </div>
                    </div>

                    <JoinButton isJoined={isJoined} id={String(event.id)} />
                </div>
            </div>
        </div>
    );
}