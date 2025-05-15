'use client'

import React, { useEffect, useState } from 'react'
import UtcDateTimePicker from "@/components/ui/DateTimePicker/UtcDateTimePicker"
import { deleteEvent, fetchEventClient, updateEvent } from "@/lib/api/apiEvents"
import TagSelect from "@/components/ui/TagSelect"
import { FaSave, FaTrash } from 'react-icons/fa'
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useUser } from "@/context/userContext"
import ImageUploader from "@/components/ui/ImageUploader"
import { UploadEventImg } from "@/lib/api/apiImage"
import { FiArrowLeft } from 'react-icons/fi'

type Participant = {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
}

type Organizer = {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
}

type Event = {
    id: number
    title: string
    description: string
    start_timestamptz: string
    end_timestamptz: string
    location: string
    participants: number[]
    friends_participants?: Participant[]
    image: string | null
    tags: string[]
    organizer: Organizer
}

type EventFormData = {
    title: string
    description: string
    location: string
    tags: string[]
}

export default function EditEvent({ params }: { params: { id: string } }) {
    const { id } = params
    const router = useRouter()
    const { userID } = useUser()

    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const [event, setEvent] = useState<Event | null>(null)
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        location: '',
        tags: [],
    })
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function fetchEventData() {
            try {
                const response = await fetchEventClient(id)
                if (!response?.event) {
                    toast.error('Не удалось загрузить данные события')
                    router.push('/events')
                    return
                }

                setEvent(response.event)
                setFormData({
                    title: response.event.title,
                    description: response.event.description,
                    location: response.event.location,
                    tags: response.event.tags,
                })
                setStartDate(new Date(response.event.start_timestamptz))
                setEndDate(new Date(response.event.end_timestamptz))
            } catch (error) {
                console.error('Error fetching event:', error)
                toast.error('Не удалось загрузить данные события')
                router.push('/events')
            } finally {
                setLoading(false)
            }
        }

        fetchEventData()
    }, [id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!event || !startDate || !endDate) return

        if (!formData.title.trim()) {
            toast.error('Название мероприятия обязательно')
            return
        }

        if (startDate >= endDate) {
            toast.error('Дата окончания должна быть позже даты начала')
            return
        }

        try {
            setIsSubmitting(true)
            const eventData = {
                ...formData,
                start_timestamptz: startDate.toISOString(),
                end_timestamptz: endDate.toISOString(),
            }

            const response = await updateEvent(event.id.toString(), eventData)

            if (image) {
                await UploadEventImg(event.id, image)
                toast.success('Изображение обновлено')
            }

            if (response) {
                toast.success('Изменения сохранены!')
                router.push(`/events/${event.id}`)
            } else {
                throw new Error()
            }
        } catch (error) {
            console.error('Error updating event:', error)
            toast.error('Ошибка при сохранении изменений')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!event) return

        try {
            const response = await deleteEvent(event.id.toString())
            if (response) {
                toast.success('Мероприятие удалено')
                router.push('/events')
            } else {
                throw new Error()
            }
        } catch (error) {
            console.error('Error deleting event:', error)
            toast.error('Ошибка при удалении мероприятия')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center min-h-[300px] text-gray-500">
                Мероприятие не найдено
            </div>
        )
    }

    if (userID !== event.organizer.id.toString()) {
        return (
            <div className="flex justify-center items-center min-h-[300px] text-gray-500">
                Вы не являетесь организатором этого мероприятия
            </div>
        )
    }

    return (
        <div className="flex justify-center items-start py-6 px-4 sm:py-10">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-gray-200">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiArrowLeft className="text-lg" />
                    </button>
                    <h2 className="text-2xl font-bold text-black">Редактирование мероприятия</h2>
                    <div className="w-8"></div> {/* Для выравнивания */}
                </div>

                <div className="space-y-5">
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            rows={4}
                            placeholder="Опишите мероприятие"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UtcDateTimePicker
                            label="Начало события*"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <UtcDateTimePicker
                            label="Конец события*"
                            value={endDate}
                            onChange={setEndDate}
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            placeholder="Где будет проходить"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Теги</label>
                        <TagSelect
                            value={formData.tags}
                            onChange={(selected) => setFormData(prev => ({ ...prev, tags: selected }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                        <ImageUploader
                            onUpload={setImage}
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="px-5 py-3 text-black bg-blue-600 rounded-2xl hover:bg-blue-500 flex items-center justify-center gap-2"
                        >
                            <FaTrash />
                            Удалить
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-3 bg-lime-400 text-black rounded-2xl hover:bg-lime-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                        >
                            <FaSave />
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}