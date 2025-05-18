'use client'

import React, {useEffect, useState} from 'react'
import {FiUser, FiSave} from 'react-icons/fi'
import {useUser} from '@/context/userContext'
import {fetchProfileClient, updateProfile} from '@/lib/api/users/apiUser'
import toast from 'react-hot-toast'
import PrettyDatePicker from '@/components/ui/DateTimePicker/DatePick'
import ImageUploader from "@/components/ui/ImageUploader"
import {avatarUpload} from "@/lib/api/apiImage"

type UserProfile = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    city: string
    bio: string
    avatar_url: string | File
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
        avatar_url: '',
        birthday: '',
    })

    const [image, setImage] = useState<File | null>(null)
    const [originalData, setOriginalData] = useState<UserProfile>({...formData})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await fetchProfileClient(userID)
                setFormData(profile)
                setOriginalData(profile)
            } catch {
                toast.error('Не удалось загрузить профиль')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [userID])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleDateChange = (date: string) => {
        setFormData(prev => ({...prev, birthday: date}))
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || !!image

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await updateProfile(formData)
            if (image) await avatarUpload(image)

            if (res) {
                toast.success('Профиль обновлён', {
                    style: {borderRadius: '12px', background: '#333', color: '#fff'},
                })
                setOriginalData(formData)
            }
        } catch {
            toast.error('Ошибка при обновлении', {
                style: {borderRadius: '12px', background: '#333', color: '#fff'},
            })
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 text-black">
            <form onSubmit={handleSubmit}
                  className="space-y-8  p-6 rounded-3xl border border-pink-500 shadow-md">
                <div className="flex items-center gap-3">
                    <FiUser className="text-2xl text-pink-500"/>
                    <h2 className="text-2xl font-bold">Настройки профиля</h2>
                </div>

                {/* Аватар */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Аватар</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-lime-400">
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="preview"
                                     className="object-cover w-full h-full"/>
                            ) : formData.avatar_url ? (
                                <img src={formData.avatar_url as string} alt="avatar"
                                     className="object-cover w-full h-full"/>
                            ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                    <FiUser className="text-gray-500 text-2xl"/>
                                </div>
                            )}
                        </div>
                        <ImageUploader isPreview={false} onUpload={setImage}/>
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
                        <div key={id}>
                            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                            <input
                                id={id}
                                name={id}
                                type={type}
                                value={(formData as any)[id] ?? ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-neutral-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                    ))}

                    {/* Дата рождения */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Дата рождения</label>
                        <PrettyDatePicker value={formData.birthday} onChange={handleDateChange}/>
                    </div>
                </div>

                {/* О себе */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">О себе</label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio ?? ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-neutral-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400"
                    />
                </div>

                {/* Кнопка сохранения */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors ${
                            hasChanges
                                ? 'bg-lime-400 text-black hover:bg-lime-300'
                                : 'bg-neutral-200 text-black cursor-not-allowed'
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
