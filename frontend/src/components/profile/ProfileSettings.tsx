'use client'

import React, { useEffect, useState } from 'react'
import { IoMdCheckmark } from "react-icons/io";
import { FiUser } from 'react-icons/fi'
import { useUser } from "@/context/userContext";
import { fetchProfile, updateProfile } from "@/api/user";
import { DatePicker } from "@/components/ui/shared/DatePicker";
import toast from "react-hot-toast";

type UserProfile = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    city: string
    bio: string
    avatar: string
    birthday: string
}

export default function ProfileSettings() {
    const { userID } = useUser()

    const [formData, setFormData] = useState<UserProfile>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        city: '',
        bio: '',
        avatar: '',
        birthday: '',
    });

    const [originalData, setOriginalData] = useState<UserProfile>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        city: '',
        bio: '',
        avatar: '',
        birthday: '',
    });

    const [loading, setLoading] = useState(true);
    const [isChanging, setIsChanging] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            const profile = await fetchProfile(userID);
            setFormData(profile);
            setOriginalData(profile); // Сохраняем исходные данные
            setLoading(false);
        }

        loadProfile();
    }, [userID]);

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData); // Проверяем, есть ли изменения

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const response = await updateProfile(formData);
        if (!response) {
            toast.error('Произошла ошибка. Попробуйте позже');
        } else {
            toast.success('Успех. Обновите страницу');
            setOriginalData(formData); // Обновляем оригинальные данные после успешного обновления
        }
    }

    function setDateBirth(date: string) {
        setFormData(prev => ({ ...prev, ['birthday']: date }));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    console.log(formData);
    return (
        <div>
            {loading ? <p>Загрузка...</p> : (
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FiUser className="text-emerald-500 mr-2" />
                        Настройки профиля
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Аватар</label>
                        <div className="flex items-center">
                            <img
                                src={formData.avatar}
                                alt=""
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-sm"
                                onClick={() => alert("Иди нахуй")}
                            >
                                Изменить фото
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="first_name"
                                className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone_number"
                                className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="city"
                                className="block text-sm font-medium text-gray-700 mb-2">Место
                                проживания(город)</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">О себе</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <DatePicker selectedDate={formData.birthday}
                            onChange={(date) => setDateBirth(date)}></DatePicker>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={!hasChanges}
                            className={`px-6 py-2 ${hasChanges ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'} text-white rounded-lg hover:bg-emerald-700 transition-colors flex flex-row`}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
