'use client'

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateGroup } from "@/lib/api/groups/apiGroup";

type GroupData = {
  id: string;
  name: string;
  description: string;
  tags: string[];

};

type GroupTagsProps = {
  id: string;
  initialGroupData: GroupData;
  availableTags: string[];
};

export default function GroupTags({ id, initialGroupData, availableTags }: GroupTagsProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(initialGroupData.tags || []);
    const [isSaving, setIsSaving] = useState(false);

    const toggleTagSelection = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSave = async () => {
        if (selectedTags.length === 0) {
            toast.error('Выберите хотя бы один тег!');
            return;
        }

        setIsSaving(true);
        try {
            const updatedData = {
                ...initialGroupData,
                tags: selectedTags
            };

            const response = await updateGroup(id, updatedData);
            if (response) {
                toast.success('Теги обновлены');
            } else {
                toast.error('Ошибка при обновлении тегов');
            }
        } catch (e) {
            toast.error('Ошибка сети');
            console.error('Ошибка:', e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-black mb-4">Выберите интересующие теги</h2>
            <p className="text-gray-400 mb-6">Можно выбрать несколько вариантов</p>

            <div className="flex flex-wrap gap-3 mb-6">
                {availableTags.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagSelection(tag)}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTags.includes(tag)
                                ? 'bg-blue-600 text-black'
                                : 'bg-gray-200 text-black hover:bg-gray-300'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {tag}
                        {selectedTags.includes(tag) && (
                            <span className="ml-2">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-400">
                    Выбрано: {selectedTags.length}
                </span>
                <button
                    onClick={handleSave}
                    disabled={selectedTags.length === 0 || isSaving}
                    className={`px-6 py-2 bg-lime-400 text-black rounded-full hover:bg-lime-300
                              disabled:bg-neutral-700 disabled:text-gray-400 disabled:cursor-not-allowed
                              transition-colors font-medium ${isSaving ? 'animate-pulse' : ''}`}
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить выбор'}
                </button>
            </div>
        </div>
    );
}