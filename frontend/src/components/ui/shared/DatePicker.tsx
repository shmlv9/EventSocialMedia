'use client';

import { useState } from 'react';

interface DatePickerProps {
    label?: string;
    value?: string;
    onChange?: (date: string) => void;
    className?: string;
}

export function DatePicker({ label = 'Дата рождения', value, onChange, className = '' }: DatePickerProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        { value: '01', name: 'Январь' },
        { value: '02', name: 'Февраль' },
        { value: '03', name: 'Март' },
        { value: '04', name: 'Апрель' },
        { value: '05', name: 'Май' },
        { value: '06', name: 'Июнь' },
        { value: '07', name: 'Июль' },
        { value: '08', name: 'Август' },
        { value: '09', name: 'Сентябрь' },
        { value: '10', name: 'Октябрь' },
        { value: '11', name: 'Ноябрь' },
        { value: '12', name: 'Декабрь' }
    ];

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const handleDateChange = () => {
        if (selectedDay && selectedMonth && selectedYear) {
            const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay.padStart(2, '0')}`;
            onChange?.(formattedDate);
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="flex gap-2">
                <select
                    value={selectedDay}
                    onChange={(e) => {
                        setSelectedDay(e.target.value);
                        handleDateChange();
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                    <option value="">День</option>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>


                <select
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        handleDateChange();
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                    <option value="">Месяц</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                        handleDateChange();
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                    <option value="">Год</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}