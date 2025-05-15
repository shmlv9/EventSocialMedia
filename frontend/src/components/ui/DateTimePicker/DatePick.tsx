'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import { format } from 'date-fns';

type Props = {
  value?: string; // dd-MM-yyyy
  onChange: (formattedDate: string) => void;
  label?: string;
};

function parseDate(dateStr: string): Date | null {
  const [day, month, year] = dateStr.split('-').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

export default function PrettyDatePicker({ value, onChange, label }: Props) {
  const initialDate = value ? parseDate(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const maxDate = new Date();

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formatted = format(date, 'yyyy-MM-dd');
      onChange(formatted);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full rounded-xl">
      {label && (
        <label className="block text-zinc-100 mb-2 font-medium">{label}</label>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd-MM-yyyy"
        placeholderText="Выберите дату рождения"
        className="rounded-3xl w-full px-8 py-2 border border-neutral-700 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-neutral-900 text-zinc-100 placeholder-gray-500"
        popperClassName="!z-[1000]"
        calendarClassName="custom-datepicker"
        showPopperArrow={false}
        maxDate={maxDate}
        dayClassName={(date) =>
          date.getDate() === new Date().getDate() &&
          date.getMonth() === new Date().getMonth()
            ? 'bg-lime-400 text-white'
            : ''
        }
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}
