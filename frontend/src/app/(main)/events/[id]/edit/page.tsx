'use client'
import UtcDateTimePicker from "@/components/ui/DateTimePicker/UtcDateTimePicker";
import React, {useEffect, useState} from 'react';
import {deleteEvent, fetchEventClient, updateEvent} from "@/lib/api/apiEvents";
import TagSelect from "@/components/ui/TagSelect";
import {FaSave} from "react-icons/fa";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

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

type EventFormData = {
    title: string;
    description: string;
    location: string;
    tags: string[];
};

export default function EditEvent({params}: { params: Promise<{ id: string }> }) {
    const {id} = React.use(params);
    const router = useRouter();

    const [event, setEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        location: '',
        tags: [],
    });

    const [start_timestamptz, setStart_timestamptz] = useState<Date | null>(null);
    const [end_timestamptz, setEnd_timestamptz] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        async function fetchEventData() {
            try {
                const response = await fetchEventClient(id);

                if (response.event) {
                    setFormData({
                        title: response.event.title,
                        description: response.event.description,
                        location: response.event.location,
                        tags: response.event.tags,
                    });
                    setStart_timestamptz(new Date(response.event.start_timestamptz));
                    setEnd_timestamptz(new Date(response.event.end_timestamptz));
                }

            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error('Не удалось загрузить данные события');
                return (<div>Мероприятие не найдено</div>)
            }
        }

        fetchEventData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const prepareFormData = () => {
        return {
            ...formData,
            start_timestamptz: start_timestamptz?.toISOString() || '',
            end_timestamptz: end_timestamptz?.toISOString() || '',
        };
    };

    const handleSubmit = async () => {
        if (!event) return;

        try {
            setIsSubmitting(true);
            const eventData = prepareFormData();
            const response = await updateEvent(event.id.toString(), eventData);

            if (response) {
                toast.success('Изменения сохранены успешно!');
                router.push(`/events/${event.id}`);
            } else {
                toast.error('Ошибка при сохранении изменений');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Произошла ошибка. Пожалуйста, попробуйте позже');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (!event) {
                toast.error('Что-то пошло не так')
                return
            }
            const response = await deleteEvent(event.id.toString());
            if (response) {
                toast.success('Успех. Мероприятие удалено')
            } else {
                toast.error('Что-то пошло не так')
            }
        } catch (e) {
            toast.error('Что-то пошло не так')
            console.log(e)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!event) {
        return <div className="flex justify-center items-center py-10">Загрузка данных события...</div>;
    }

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Редактирование мероприятия</h2>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Название*
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Введите название"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            rows={4}
                            placeholder="Опишите мероприятие"
                        />
                    </div>

                    <div className="space-y-4">
                        <UtcDateTimePicker
                            label="Начало события*"
                            value={start_timestamptz}
                            onChange={setStart_timestamptz}
                        />
                        <UtcDateTimePicker
                            label="Конец события*"
                            value={end_timestamptz}
                            onChange={setEnd_timestamptz}
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Местоположение
                        </label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Где будет проходить"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Теги</label>
                        <TagSelect
                            value={formData.tags}
                            onChange={(selected) => setFormData(prev => ({...prev, tags: selected}))}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2 border border-gray-300 rounded-3xl text-gray-700 hover:bg-gray-100 transition-colors"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            className="bg-rose-700 p-2 rounded-3xl opacity-85 hover:bg-rose-800 text-white transition-colors"
                            onClick={handleDelete}
                        >
                            Удалить
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-emerald-600 text-white rounded-3xl hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50"
                        >
                            <FaSave className="mr-2"/>
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};