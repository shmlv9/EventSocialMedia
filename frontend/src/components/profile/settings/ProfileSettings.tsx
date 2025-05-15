'use client'

import React, {useEffect, useState} from 'react'
import {FiUser, FiUpload, FiSave} from 'react-icons/fi'
import {useUser} from '@/context/userContext'
import {fetchProfileClient, updateProfile} from '@/lib/api/apiUser'
import toast from 'react-hot-toast'
import PrettyDatePicker from '@/components/ui/DateTimePicker/DatePick'
import Image from 'next/image'

type UserProfile = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    city: string
    bio: string
    avatar: string | File
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
    })
    const [originalData, setOriginalData] = useState<UserProfile>({...formData})
    const [loading, setLoading] = useState(true)
    const [avatarPreview, setAvatarPreview] = useState('')

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await fetchProfileClient(userID)
                setFormData(profile)
                setOriginalData(profile)
                if (profile.avatar && typeof profile.avatar === 'string') {
                    setAvatarPreview(profile.avatar)
                }
            } catch (error) {
                toast.error('Не удалось загрузить профиль')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [userID])

    const handleDateChange = (date: string) => {
        setFormData((prev) => ({...prev, birthday: date}))
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const response = await updateProfile(formData)
            if (response) {
                toast.success('Профиль успешно обновлен', {
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff',
                    },
                })
                setOriginalData(formData)
            }
        } catch (error) {
            toast.error('Ошибка при обновлении профиля', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                },
            })
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFormData((prev) => ({...prev, avatar: file}))

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }


    return (
        <div className="text-black">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <FiUser className="text-xl text-pink-500"/>
                    <h2 className="text-xl font-bold">Настройки профиля</h2>
                </div>

                {/* Аватар */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium">Аватар</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full border-2 border-lime-400 overflow-hidden">
                            {avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    alt="Аватар"
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <FiUser className="text-gray-400 text-2xl"/>
                                </div>
                            )}
                        </div>
                        <label
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400 text-white rounded-3xl hover:bg-lime-500 transition-colors cursor-pointer">
                            <FiUpload/>
                            Загрузить
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Основные поля */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {id: 'first_name', label: 'Фамилия', type: 'text'},
                        {id: 'last_name', label: 'Имя', type: 'text'},
                        {id: 'email', label: 'Email', type: 'email'},
                        {id: 'phone_number', label: 'Телефон', type: 'tel'},
                        {id: 'city', label: 'Город', type: 'text'},
                    ].map(({id, label, type}) => (
                        <div key={id} className="space-y-2">
                            <label htmlFor={id} className="block text-sm font-medium">
                                {label}
                            </label>
                            <input
                                type={type}
                                id={id}
                                name={id}
                                value={(formData as any)[id] ?? ''}
                                onChange={handleChange}
                                className="text-black w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            />
                        </div>
                    ))}

                    {/* Дата рождения */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Дата рождения</label>
                        <PrettyDatePicker
                            value={formData.birthday}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                {/* О себе */}
                <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium">
                        О себе
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio ?? ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    />
                </div>

                {/* Кнопка сохранения */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors ${
                            hasChanges
                                ? 'bg-lime-400 text-white hover:bg-lime-500 shadow-md'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <FiSave/>
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    )
}