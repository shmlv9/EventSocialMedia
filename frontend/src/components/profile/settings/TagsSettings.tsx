'use client'

import React, {useState} from 'react';
import {toast} from 'react-hot-toast';

type Tag = {
    id: string;
    label: string;
};

const availableTags: Tag[] = [
    {id: '1', label: 'Технологии'},
    {id: '2', label: 'Спорт'},
    {id: '3', label: 'Путешествия'},
    {id: '4', label: 'Искусство'},
    {id: '5', label: 'Музыка'},
    {id: '6', label: 'Фотография'},
];

export default function TagSelector() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTagSelection = (tagId: string) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tagId)) {
                return prevTags.filter((id) => id !== tagId);
            } else {
                return [...prevTags, tagId];
            }
        });
    };

    const handleSave = () => {
        if (selectedTags.length > 0) {
            toast.success('Теги успешно сохранены!');
        } else {
            toast.error('Пожалуйста, выберите хотя бы один тег!');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Выберите теги</h2>
            <div className="space-y-2">
                {availableTags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={tag.id}
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => toggleTagSelection(tag.id)}
                            className="mr-2"
                        />
                        <label htmlFor={tag.id} className="text-sm text-gray-700">{tag.label}</label>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                    Сохранить теги
                </button>
            </div>
        </div>
    );
}
