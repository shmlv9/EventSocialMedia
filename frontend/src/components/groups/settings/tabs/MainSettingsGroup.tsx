'use client'

import React, {useState} from 'react';
import {FiUsers, FiSave, FiUser, FiTrash2} from 'react-icons/fi';
import ImageUploader from "@/components/ui/ImageUploader";
import toast from 'react-hot-toast';
import {uploadGroupAvatar} from "@/lib/api/apiImage";
import {deleteGroup, updateGroup} from "@/lib/api/groups/apiGroup";
import { useRouter } from 'next/navigation';

type User = {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
};

type Group = {
    id: number;
    name: string;
    description: string;
    creator_id: number;
    avatar_url: string | null;
    tags: string[];
    created_at: string;
    location: string;
    creator: User;
    members_count: number;
    events_count: number;
    status: 'creator' | 'admin' | 'member' | null;
    admins: User[];

};

type GroupFormData = {
    name: string;
    description: string;
    avatar_url: string | null;
    location: string;
    tags: string[];
};

export default function GroupSettings({data, id}: { data: Group; id: string }) {
    const [formData, setFormData] = useState<GroupFormData>({
        name: data.name,
        description: data.description,
        avatar_url: data.avatar_url,
        location: data.location,
        tags: data.tags
    });

    const router = useRouter()
    const [originalData] = useState(data);
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateGroup(id, formData);
            if (image) {
                await uploadGroupAvatar(image, id);
            }

            if (res) {
                toast.success('Настройки группы обновлены', {
                    style: {borderRadius: '12px', background: '#333', color: '#fff'},
                });
            }
        } catch (error) {
            toast.error('Ошибка при обновлении', {
                style: {borderRadius: '12px', background: '#333', color: '#fff'},
            });
            console.error('Update error:', error);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            const response = await deleteGroup(id)
            if (response) {
                toast.success('Группа успешно удалена')
                router.push('/groups')
            }
        } catch (e) {
            toast.error('Произошла ошибка')
        }
    };

    const hasChanges =
        JSON.stringify(formData) !== JSON.stringify({
            name: originalData.name,
            description: originalData.description,
            avatar_url: originalData.avatar_url,
            location: originalData.location,
            tags: originalData.tags
        }) ||
        image !== null;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 text-black">
            <form onSubmit={handleSubmit} className="space-y-8 p-6 rounded-3xl border border-pink-500 shadow-md">
                <div className="flex items-center gap-3">
                    <FiUsers className="text-2xl text-pink-500"/>
                    <h2 className="text-2xl font-bold">Настройки группы</h2>
                </div>

                <div className="flex">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Аватар</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-lime-400">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="preview"
                                         className="object-cover w-full h-full"/>
                                ) : formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="avatar" className="object-cover w-full h-full"/>
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                        <FiUser className="text-gray-500 text-2xl"/>
                                    </div>
                                )}
                            </div>
                            <ImageUploader isPreview={false} onUpload={setImage}/>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Название группы *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-neutral-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Описание группы
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-neutral-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400"
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                        Местоположение
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-neutral-200 text-black rounded-2xl focus:ring-2 focus:ring-lime-400"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleDeleteGroup}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <FiTrash2/>
                        Удалить группу
                    </button>

                    <button
                        disabled={!hasChanges}
                        type="submit"
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors ${
                            hasChanges
                                ? 'bg-lime-400 text-black hover:bg-lime-300 cursor-pointer'
                                : 'bg-neutral-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <FiSave/>
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    );
}