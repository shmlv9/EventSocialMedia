'use client'

import {useState} from 'react';
import {FaPlusCircle} from 'react-icons/fa';
import {useRouter} from 'next/navigation';
import UtcDateTimePicker from "@/components/ui/DateTimePicker/UtcDateTimePicker";
import TagSelect from "@/components/ui/TagSelect";
import toast from "react-hot-toast";
import {createEvent} from "@/lib/api/apiEvents";
import ImageUploader from "@/components/ui/ImageUploader";
import {UploadEventImg} from "@/lib/api/apiImage";

type EventFormData = {
    title: string;
    description: string;
    location: string;
    tags: string[];
};

type ApiEventData = {
    title: string;
    description: string;
    location: string;
    tags: string[];
    start_timestamptz: string;
    end_timestamptz: string;
};

export default function CreateEventForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        location: '',
        tags: [],
    });

    const [image, setImage] = useState<File>()

    const [start_timestamptz, setStart_timestamptz] = useState<Date | null>(null);
    const [end_timestamptz, setEnd_timestamptz] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const prepareFormData = (): ApiEventData => {
        return {
            ...formData,
            start_timestamptz: start_timestamptz?.toISOString() || '',
            end_timestamptz: end_timestamptz?.toISOString() || '',
        };
    };


    const handleSubmit = async () => {
        if (!start_timestamptz || !end_timestamptz) {
            toast.error('Выберите дату начала и окончания');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Название мероприятия обязательно');
            return;
        }

        if (start_timestamptz >= end_timestamptz) {
            toast.error('Дата окончания должна быть позже даты начала');
            return;
        }

        try {
            setIsSubmitting(true);
            const eventData = prepareFormData();
            const response = await createEvent(eventData);
            const eid = response.event_id

            if (image) {
                const imgResponse = await UploadEventImg(eid, image)

                if (imgResponse) {
                    toast.success('Изображение успешно прикреплено\'')
                }
            }
            if (response) {
                toast.success('Мероприятие создано успешно!');
            }
            else {
                toast.error('Ошибка при создании мероприятия');
            }

        } catch (error) {
            console.error('Error creating event:', error);
            toast.error('Произошла ошибка. Пожалуйста, попробуйте позже');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-2xl bg-neutral-900 shadow-lg rounded-3xl p-8 space-y-6 border border-pink-500">
                <h2 className="text-2xl font-semibold text-white">Создание мероприятия</h2>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                            Название*
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            placeholder="Введите название"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
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
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                            Местоположение
                        </label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            placeholder="Где будет проходить"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Теги</label>
                        <TagSelect
                            value={formData.tags}
                            onChange={(selected) => setFormData(prev => ({...prev, tags: selected}))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Теги</label>
                        <ImageUploader
                            onUpload={(file: File) => {
                                setImage(file)
                            }}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2 border border-neutral-700 rounded-3xl text-gray-300 hover:bg-neutral-800 transition-colors"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-lime-400 text-black rounded-3xl hover:bg-lime-300 transition-colors flex items-center disabled:opacity-50 font-medium"
                        >
                            <FaPlusCircle className="mr-2"/>
                            {isSubmitting ? 'Создание...' : 'Создать'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}