'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {FiUpload, FiX} from 'react-icons/fi'
import {createGroup} from '@/lib/api/groups/apiGroup'
import toast from 'react-hot-toast'
import {uploadGroupAvatar} from "@/lib/api/apiImage";
import TagSelect from "@/components/ui/TagSelect";

export default function CreateGroupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPrivate: false,
        tags: [] as string[],
        location: ''
    })
    const [tagInput, setTagInput] = useState('')
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const avatar_url = await uploadGroupAvatar(image)

            const response = await createGroup({
                name: formData.name,
                description: formData.description,
                tags: formData.tags,
                location: formData.location,
                avatar_url: avatar_url,
            })

            if (response) {
                toast.success('Группа успешно создана!')
                router.push(`/groups/${response.group_id}`)
            } else {
                toast.error('Не удалось создать группу')
            }
        } catch (error) {
            toast.error('Произошла ошибка при создании группы')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
            <h1 className="text-2xl font-bold text-black mb-6">Создать новую группу</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Загрузка аватарки */}
                <div className="flex items-start gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Аватар группы</label>
                        <div className="relative w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden">
                            {avatarPreview ? (
                                <>
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover"/>
                                    <button
                                        type="button"
                                        onClick={() => setAvatarPreview(null)}
                                        className="absolute top-0 right-0 p-1 bg-black rounded-full shadow-md hover:bg-gray-100"
                                    >
                                        <FiX size={14}/>
                                    </button>
                                </>
                            ) : (
                                <label className="w-full h-full flex items-center justify-center cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e)}
                                    />
                                    <FiUpload className="text-gray-400"/>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Название группы */}
                    <div className="flex-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Название группы *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            placeholder="Придумайте название группы"
                        />
                    </div>
                </div>

                {/* Описание группы */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Описание группы
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        placeholder="Расскажите о вашей группе"
                    />
                </div>

                {/* Местоположение */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Местоположение
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        placeholder="Где базируется ваша группа?"
                    />
                </div>

                {/* Теги */}
                <TagSelect value={formData.tags} onChange={(selected) => setFormData(prev => ({...prev, tags: selected}))}/>

                {/*/!* Приватность *!/*/}
                {/*<div className="flex items-center">*/}
                {/*    <input*/}
                {/*        type="checkbox"*/}
                {/*        id="isPrivate"*/}
                {/*        name="isPrivate"*/}
                {/*        checked={formData.isPrivate}*/}
                {/*        onChange={handleCheckboxChange}*/}
                {/*        className="h-4 w-4 text-lime-500 focus:ring-lime-400 border-gray-300 rounded"*/}
                {/*    />*/}
                {/*    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">*/}
                {/*        Закрытая группа (только по заявкам)*/}
                {/*    </label>*/}
                {/*</div>*/}

                {/* Кнопки */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.name || isLoading}
                        className="px-6 py-2 bg-lime-400 text-black rounded-xl hover:bg-lime-500 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {isLoading ? 'Создание...' : 'Создать группу'}
                    </button>
                </div>
            </form>
        </div>
    )
}