'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
  import './custom-datepicker.css';

type Props = {
  value?: Date;
  onChange: (utcDate: Date) => void;
  label?: string;
};

export default function UtcDateTimePicker({ value, onChange, label }: Props) {
  const [localDate, setLocalDate] = useState<Date | null>(value || null);

  const handleChange = (date: Date | null) => {
    setLocalDate(date);
    if (date) {
      onChange(date); // передаём как есть — UTC извлекается через toISOString()
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="block text-gray-700 mb-2 font-medium">{label}</label>}

      <div className="relative">
        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" />
        <DatePicker
          selected={localDate}
          onChange={handleChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="Выберите дату и время"
          className="w-full pl-10 pr-4 py-2 rounded-3xl border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
          popperClassName="!z-[1000]"
          calendarClassName="custom-datepicker" // кастомный класс
        />
      </div>

      {localDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Время в UTC: {localDate.toISOString().slice(0, 16).replace('T', ' ')}
        </p>
      )}
    </div>
  );
}
