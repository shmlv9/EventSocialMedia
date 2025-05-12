'use client'

import {useState} from 'react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaTag,
    FaImage,
    FaAlignLeft,
    FaPlusCircle
} from 'react-icons/fa';
import {useRouter} from 'next/navigation';

export default function CreateEventForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        tags: '',
        image: null
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь обработка отправки формы
        console.log(formData);
        router.push('/events');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            Хуйня буду переделывать
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <FaPlusCircle className="mr-2 text-emerald-600"/>
                Создать мероприятие
            </h1>

            <form onSubmit={handleSubmit}>
                {/* Название мероприятия */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Название</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Введите название"
                            required
                        />
                        <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Описание */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Описание</label>
                    <div className="relative">
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={4}
                placeholder="Добавьте описание мероприятия"
            />
                        <FaAlignLeft className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Дата и время */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Дата начала</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                            <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Время начала</label>
                        <div className="relative">
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                            <FaClock className="absolute left-3 top-3.5 text-gray-400"/>
                        </div>
                    </div>
                </div>

                {/* Местоположение */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Местоположение</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Укажите место проведения"
                        />
                        <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Теги */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Теги</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Добавьте теги через запятую"
                        />
                        <FaTag className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Загрузка изображения */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Обложка мероприятия</label>
                    <div className="relative">
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            accept="image/*"
                        />
                        <FaImage className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                        <FaPlusCircle className="mr-2"/>
                        Создать мероприятие
                    </button>
                </div>
            </form>
        </div>
    );
}