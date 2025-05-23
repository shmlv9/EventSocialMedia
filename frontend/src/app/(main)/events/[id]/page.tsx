import                    <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                <FiCalendar className="text-pink-500 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Мероприятие не найдено</h2>
                            <p className="text-gray-600 mb-6">
                                К сожалению, мы не смогли найти мероприятие с таким идентификатором.
                            </p>
React from 'react';
import { fetchEvent } from "@/lib/api/events/apiEvents";
import EventCard from "@/components/events/EventCard/EventCard";
import { FiCalendar, FiFrown } from 'react-icons/fi';

export default async function Event({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const event = await fetchEvent(id);
        if (!event.event) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                <FiCalendar className="text-pink-500 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Мероприятие не найдено</h2>
                            <p className="text-gray-600 mb-6">
                                К сожалению, мы не смогли найти мероприятие с таким идентификатором.
                            </p>
                            <a
                                href="/events"
                                className="px-6 py-3 bg-lime-400 text-gray-900 rounded-xl font-medium hover:bg-lime-500 transition-colors"
                            >
                                Вернуться к списку мероприятий
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <EventCard {...(event.event)} />
                </div>
            </div>
        );
    } catch (e) {
        console.log(e);
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FiFrown className="text-red-500 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
                        <p className="text-gray-600 mb-6">
                            Произошла ошибка при загрузке мероприятия. Пожалуйста, попробуйте позже.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="/events"
                                className="px-6 py-3 bg-lime-400 text-gray-900 rounded-xl font-medium hover:bg-lime-500 transition-colors"
                            >
                                К мероприятиям
                            </a>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                            >
                                Попробовать снова
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}