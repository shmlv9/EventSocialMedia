'use client'

import React, {useState} from 'react';

export default function DescriptionMenu({description}: { description: string }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="mb-4">
            <p className={`text-gray-300 ${!isExpanded && 'line-clamp-2'}`}>
                {description}
            </p>
            {description.length > 100 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-lime-400 hover:text-lime-300 hover:cursor-pointer text-sm mt-1 focus:outline-none transition-colors"
                >
                    {isExpanded ? 'Свернуть' : 'Читать далее...'}
                </button>
            )}
        </div>
    );
}