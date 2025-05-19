'use client';

import React, {useEffect, useRef, useState} from 'react';
import {apiFetchClient} from '@/lib/api/apiFetchClient';

type Props = {
    value: string[];
    onChange: (selected: string[]) => void;
};

export default function TagSelect({value, onChange}: Props) {
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchTags() {
            try {
                const res = await apiFetchClient('/events/tags', {method: 'GET'});
                const tags = await res.json();
                setAllTags(tags);
            } catch (error) {
                console.error('Ошибка при загрузке тегов:', error);
            }
        }

        fetchTags();
    }, []);

    useEffect(() => {
        const closeOnClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnClickOutside);
        return () => document.removeEventListener('mousedown', closeOnClickOutside);
    }, []);

    const toggleTag = (tag: string) => {
        if (value.includes(tag)) {
            onChange(value.filter((t) => t !== tag));
        } else {
            onChange([...value, tag]);
        }
    };

    return (
        <div className="relative w-full" ref={ref}>
            {/* Поле выбора тегов */}
            <div
                className="w-full border-2 border-black rounded-xl px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value.length === 0 ? (
                    <span className="text-gray-500">Выберите теги (необязательно)</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {value.map((tag) => (
                            <span
                                key={tag}
                                className="bg-lime-400 text-black text-sm px-3 py-1 rounded-full font-medium"
                            >
                {tag}
              </span>
                        ))}
                    </div>
                )}
                <span className="absolute right-3 top-3.5 text-gray-400">
          {isOpen ? '▲' : '▼'}
        </span>
            </div>

            {isOpen && (
                <div
                    className="absolute z-20 mt-1 w-full bg-white border-2 text-black border-black rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {allTags.map((tag) => (
                        <div
                            key={tag}
                            className={`px-4 py-2.5 cursor-pointer transition-colors ${
                                value.includes(tag)
                                    ? 'bg-lime-400 text-black font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                                toggleTag(tag);
                            }}
                        >
              <span className="flex items-center">
                {value.includes(tag) && (
                    <span className="mr-2">✓</span>
                )}
                  {tag}
              </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}