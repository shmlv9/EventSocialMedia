'use client'

import React, { useEffect, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { useUser } from '@/context/userContext'
import { fetchProfileClient, updateProfile } from '@/lib/api/apiUser'
import toast from 'react-hot-toast'
import PrettyDatePicker from '@/components/ui/DateTimePicker/DatePick'

type UserProfile = {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  city: string
  bio: string
  avatar: string | File
  birthday: string
}

export default function ProfileSettings() {
  const { userID } = useUser()

  const [formData, setFormData] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    city: '',
    bio: '',
    avatar: '',
    birthday: '',
  })

  const [originalData, setOriginalData] = useState<UserProfile>({ ...formData })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const profile = await fetchProfileClient(userID)
      setFormData(profile)
      setOriginalData(profile)
      setLoading(false)
    }

    loadProfile()
  }, [userID])

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, birthday: date }))
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await updateProfile(formData)
    if (!response) {
      toast.error('Произошла ошибка. Попробуйте позже')
    } else {
      toast.success('Успех. Обновите страницу')
      setOriginalData(formData)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleFile(file: File) {
    setFormData((prev) => ({ ...prev, avatar: file }))
  }

  return (
    <div className="text-white">
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiUser className="text-lime-400 mr-2" />
            Настройки профиля
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Аватар</label>
            <div className="flex items-center">
              {formData.avatar && typeof formData.avatar === 'string' && (
                <img
                  src={formData.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover mr-4 border border-lime-400"
                />
              )}
              <label className="inline-block px-4 py-2 bg-black border border-lime-400 text-lime-400 rounded-3xl hover:bg-lime-400 hover:text-black transition-colors text-sm cursor-pointer">
                Загрузить изображение
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) handleFile(e.target.files[0])
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { id: 'first_name', label: 'Фамилия' },
              { id: 'last_name', label: 'Имя' },
              { id: 'email', label: 'Email' },
              { id: 'phone_number', label: 'Телефон' },
              { id: 'city', label: 'Город' },
            ].map(({ id, label }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
                  {label}
                </label>
                <input
                  type={id === 'email' ? 'email' : 'text'}
                  id={id}
                  name={id}
                  value={(formData as any)[id] ?? ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-white/20 rounded-3xl text-white placeholder-white/40 focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Дата рождения</label>
              <PrettyDatePicker value={formData.birthday} onChange={handleDateChange} />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
              О себе
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-3xl text-white placeholder-white/40 focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-3xl transition-colors ${
                hasChanges
                  ? 'bg-lime-400 text-black hover:bg-lime-300'
                  : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
