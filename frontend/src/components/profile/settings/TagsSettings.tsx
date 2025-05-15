'use client'

import React, {useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import {fetchProfileClient, updateProfile} from "@/lib/api/apiUser";
import {useUser} from "@/context/userContext";

export default function TagSelector() {

    const availableTags = [
        "спорт", "музыка", "технологии", "искусство", "путешествия",
        "кино", "волонтёрство", "наука", "экология", "бизнес",
        "стартапы", "образование", "фотография", "гейминг", "литература",
        "театр", "здоровье", "йога", "танцы", "кулинария",
        "мода", "финансы", "маркетинг", "дизайн", "архитектура"
    ];

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
        try {
            const response = await updateProfile({tags: selectedTags})
            if (response) {
                toast.success('Теги обновлены')
            } else {
                toast.error('Что-то пошло не так. Попробуйте позже')
            }
        } catch (e) {
            toast.error('Что-то пошло не так. Попробуйте позже')
            console.log(e)
        }
    };

    const {userID} = useUser()

    useEffect(() => {
    async function loadProfile() {
      const profile = await fetchProfileClient(userID);
      if (profile.tags) {
          setSelectedTags(profile.tags)
      }
    }

    loadProfile()
  }, [userID])
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
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTags.includes(tag)
                                ? 'bg-blue-600 text-black'
                                : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
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
                    disabled={selectedTags.length === 0}
                    className="px-6 py-2 bg-lime-400 text-black rounded-full hover:bg-lime-300
                              disabled:bg-neutral-700 disabled:text-gray-400 disabled:cursor-not-allowed
                              transition-colors font-medium"
                >
                    Сохранить выбор
                </button>
            </div>
        </div>
    );
}