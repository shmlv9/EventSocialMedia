'use client';

import React, { useEffect, useRef, useState } from 'react';
import {apiFetchClient} from "@/lib/api/apiFetchClient";

type Props = {
  value: string[];
  onChange: (selected: string[]) => void;
};

export default function TagSelect({ value, onChange }: Props) {
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
    <div className="relative w-full mb-4" ref={ref}>
      <div
        className="w-full border border-gray-300 rounded-3xl px-4 py-2 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">Выберите теги</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <span
                key={tag}
                className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-2xl"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-md max-h-60 overflow-y-auto">
          {allTags.map((tag) => (
            <div
              key={tag}
              className={`px-4 py-2 cursor-pointer hover:bg-emerald-50 ${
                value.includes(tag) ? 'bg-emerald-100' : ''
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
