'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parse } from 'date-fns'
import { FiCalendar } from 'react-icons/fi'
import 'react-datepicker/dist/react-datepicker.css'
import './custom-datepicker.css'

type Props = {
  value?: string // Формат dd-MM-yyyy
  onChange: (formattedDate: string) => void // Возвращает yyyy-MM-dd
  label?: string
  disabled?: boolean
}

export default function PrettyDatePicker({ value, onChange, label, disabled = false }: Props) {
  const parseInputDate = (dateStr: string) => {
    try {
      return parse(dateStr, 'dd-MM-yyyy', new Date())
    } catch {
      return null
    }
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? parseInputDate(value) : null)
  const maxDate = new Date()

  const handleChange = (date: Date | null) => {
    setSelectedDate(date)
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
    } else {
      onChange('')
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiCalendar className={`${disabled ? 'text-gray-400' : 'text-lime-500'}`} />
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="dd-MM-yyyy"
          placeholderText="Выберите дату"
          disabled={disabled}
          maxDate={maxDate}
          className={`
            w-full pl-10 pr-4 py-2.5 rounded-xl border
            ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 '}
            ${disabled ? 'text-gray-400' : 'text-gray-900'} placeholder-gray-400
            focus:ring-2 focus:ring-lime-500 focus:border-transparent
            ${disabled ? '' : 'hover:border-gray-400'} transition-all
            shadow-sm text-sm
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          popperClassName="react-datepicker-popper"
          calendarClassName="react-datepicker-custom"
          showPopperArrow={false}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-2 py-1">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="flex gap-2">
                <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) => changeMonth(parseInt(value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(0, i), 'MMMM')}
                    </option>
                  ))}
                </select>

                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(parseInt(value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  {Array.from({ length: 100 }).map((_, i) => {
                    const year = new Date().getFullYear() - 99 + i
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  })}
                </select>
              </div>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}