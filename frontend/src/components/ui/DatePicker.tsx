'use client'

import React, { useEffect, useState } from 'react'

interface DatePickerProps {
    label?: string
    selectedDate?: string
    onChange: (date: string) => void
    className?: string
}

export function DatePicker({ label = 'Дата рождения', selectedDate, onChange, className = '' }: DatePickerProps) {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        if (selectedDate) {
            const [y, m, d] = selectedDate.split('-')
            setYear(y)
            setMonth(m)
            setDay(d)
        }
    }, [selectedDate])

    const handleUpdate = (d: string, m: string, y: string) => {
        if (d && m && y) {
            const formatted = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
            onChange(formatted)
        }
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`)
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
        { value: '12', name: 'Декабрь' },
    ]

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}{' '}
                {day && month && year ? (
                    <span className="text-gray-500">
                        — {day.padStart(2, '0')}.{month}.{year}
                    </span>
                ) : null}
            </label>
            <div className="flex gap-2">
                <select
                    value={day}
                    onChange={(e) => {
                        const newDay = e.target.value
                        setDay(newDay)
                        handleUpdate(newDay, month, year)
                    }}
                    className="hover:cursor-pointer flex px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:outline-none w-auto"
                >
                    <option value="">День</option>
                    {Array.from({ length: 31 }, (_, i) => {
                        const val = (i + 1).toString().padStart(2, '0')
                        return (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        )
                    })}
                </select>

                <select
                    value={month}
                    onChange={(e) => {
                        const newMonth = e.target.value
                        setMonth(newMonth)
                        handleUpdate(day, newMonth, year)
                    }}
                    className="hover:cursor-pointer flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:outline-none w-auto"
                >
                    <option value="">Месяц</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <select
                    value={year}
                    onChange={(e) => {
                        const newYear = e.target.value
                        setYear(newYear)
                        handleUpdate(day, month, newYear)
                    }}
                    className="hover:cursor-pointer flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:outline-none w-auto"
                >
                    <option value="">Год</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
