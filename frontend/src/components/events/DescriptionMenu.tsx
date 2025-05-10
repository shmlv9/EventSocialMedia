'use client'

import React, {useState} from 'react';

export default function DescriptionMenu({description}: { description: string }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="mb-4">
            <p className={`text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
                {description}
            </p>
            {description.length > 100 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-emerald-600 hover:text-emerald-700 hover:cursor-pointer text-sm mt-1 focus:outline-none"
                >
                    {isExpanded ? 'Свернуть' : 'Читать далее...'}
                </button>
            )}
        </div>
    );
};