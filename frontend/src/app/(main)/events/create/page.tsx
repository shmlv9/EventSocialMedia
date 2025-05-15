'use client'

import {useState} from 'react'
import {FaPlusCircle, FaTimes} from 'react-icons/fa'
import {useRouter} from 'next/navigation'
import toast from "react-hot-toast"
import {createEvent} from "@/lib/api/apiEvents"
import ImageUploader from "@/components/ui/ImageUploader"
import {UploadEventImg} from "@/lib/api/apiImage"
import TagSelect from "@/components/ui/TagSelect"
import UtcDateTimePicker from "@/components/ui/DateTimePicker/UtcDateTimePicker"

type EventFormData = {
    title: string
    description: string
    location: string
    tags: string[]
}

export default function CreateEventForm() {
    const router = useRouter()
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        location: '',
        tags: [],
    })

    const [image, setImage] = useState<File | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async () => {
        if (!startDate || !endDate) {
            toast.error('Выберите дату начала и окончания')
            return
        }

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

            const response = await createEvent(eventData)
            const eventId = response.event_id

            if (image && eventId) {
                await UploadEventImg(eventId, image)
                toast.success('Изображение успешно загружено')
            }

            toast.success('Мероприятие создано успешно!')
            router.push(`/events/${eventId}`)
        } catch (error) {
            console.error('Error creating event:', error)
            toast.error('Произошла ошибка. Пожалуйста, попробуйте позже')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-start py-6 px-4 sm:py-10">
            <div
                className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black">Создание мероприятия</h2>
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes className="text-lg"/>
                    </button>
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

                    <div className="flex flex-col ">
                        <div className={'mb-2'}>
                            <UtcDateTimePicker
                                label="Начало события*"
                                value={startDate}
                                onChange={setStartDate}
                            />
                        </div>
                        <div>
                            <UtcDateTimePicker
                                label="Конец события*"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
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
                            onChange={(selected) => setFormData(prev => ({...prev, tags: selected}))}
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
                            onClick={() => router.back()}
                            className="px-5 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-3 bg-lime-400 text-black rounded-2xl hover:bg-lime-500 transition-colors flex items-center justify-center disabled:opacity-50 font-medium"
                        >
                            <FaPlusCircle className="mr-2"/>
                            {isSubmitting ? 'Создание...' : 'Создать мероприятие'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}