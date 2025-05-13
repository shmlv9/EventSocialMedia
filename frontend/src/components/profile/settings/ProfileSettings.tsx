'use client'

import React, {useEffect, useState} from 'react'
import {FiUser} from 'react-icons/fi'
import {useUser} from "@/context/userContext";
import {fetchProfileClient, updateProfile} from "@/lib/api/apiUser";
import toast from "react-hot-toast";
import PrettyDatePicker from "@/components/ui/DateTimePicker/DatePick";

type UserProfile = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    city: string
    bio: string
    avatar: string | File;
    birthday: string
}

export default function ProfileSettings() {
    const {userID} = useUser()

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

    useEffect(() => {
        async function loadProfile() {
            const profile = await fetchProfileClient(userID);
            setFormData(profile);
            setOriginalData(profile);
            setLoading(false);
        }

        loadProfile();
    }, [userID]);

    const handleDateChange = (date: string) => {
        setFormData(prev => ({...prev, ['birthday']: date}));
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const response = await updateProfile(formData);
        if (!response) {
            toast.error('Произошла ошибка. Попробуйте позже');
        } else {
            toast.success('Успех. Обновите страницу');
            setOriginalData(formData);
        }
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    function handleFile(file: File) {
        setFormData(prev => ({...prev, ['avatar']: file}));
    }

    console.log(formData);
    return (
        <div>
            {loading ? <p>Загрузка...</p> : (
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FiUser className="text-emerald-500 mr-2"/>
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
                            <label
                                className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-3xl hover:bg-emerald-100 text-sm cursor-pointer">
                                Загрузить изображение {formData.avatar && <span>(Загружено)</span>}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) handleFile(e.target.files[0]);
                                    }}
                                    className="hidden"
                                />
                            </label>
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
                                value={formData.first_name ?? ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name"
                                   className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name ?? ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email ?? ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone_number"
                                   className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number ?? ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                                value={formData.city ?? ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Дата рождения</label>
                            <PrettyDatePicker
                                value={formData.birthday}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">О себе</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={formData.bio ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>


                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={!hasChanges}
                            className={`hover:cursor-pointer px-6 py-2 ${hasChanges ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'} text-white rounded-3xl hover:bg-emerald-700 transition-colors flex flex-row`}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
