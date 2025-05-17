'use client'

import {useState} from 'react'
import DatePicker from 'react-datepicker'
import {FiCalendar} from 'react-icons/fi'
import 'react-datepicker/dist/react-datepicker.css'
import './custom-datepicker.css'

type Props = {
    value?: Date | null
    onChange: (utcDate: Date) => void
    label?: string
    minDate?: Date
    maxDate?: Date
    className?: string
    disabled?: boolean
}

export default function UtcDateTimePicker({
                                              value,
                                              onChange,
                                              label,
                                              minDate,
                                              maxDate,
                                              className = '',
                                              disabled = false
                                          }: Props) {
    const [localDate, setLocalDate] = useState<Date | null>(value || null)

    const handleChange = (date: Date | null) => {
        setLocalDate(date)
        if (date) {
            onChange(new Date(date.getTime() - date.getTimezoneOffset() * 60000))
        }
    }

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
                    {label}
                </label>
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className={`${disabled ? 'text-gray-400' : 'text-lime-500'}`}/>
                </div>
                <DatePicker
                    selected={localDate}
                    onChange={handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd.MM.yyyy HH:mm"
                    placeholderText="Выберите дату и время"
                    minDate={minDate}
                    maxDate={maxDate}
                    disabled={disabled}
                    className={`
            w-full pl-10 pr-4 py-2.5 rounded-xl
            border ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white'}
            ${disabled ? 'text-gray-400' : 'text-gray-900'} placeholder-gray-400
            focus:ring-2 focus:ring-lime-500 focus:border-transparent
            ${disabled ? '' : 'hover:border-gray-400'} transition-all
            shadow-sm text-sm
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
                    calendarClassName="react-datepicker-custom"
                    popperClassName="react-datepicker-popper"

                    adjustDateOnChange
                    withPortal={window.innerWidth < 768}
                />
            </div>

            {localDate && !disabled && (
                <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">UTC:</span> {localDate.toISOString().slice(0, 16).replace('T', ' ')}
                </div>
            )}
        </div>
    )
}