'use client'

import { useState } from 'react'
import { apiFetchClient } from "@/lib/api/apiFetchClient"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { FiSearch, FiUser, FiX } from 'react-icons/fi'

type User = {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
}

export default function UserSearch() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) {
            toast.error('Введите имя для поиска')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await apiFetchClient(`/search/users/?query=${query.trim()}`, { method: 'GET' })
            const data = await res.json()
            setResults(data.results)
        } catch (err) {
            setError('Произошла ошибка при поиске')
            toast.error('Ошибка при поиске пользователей')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setQuery('')
        setResults(null)
    }

    const handleRedirect = (id: string) => {
        router.push(`/profile/${id}`)
    }

    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-black">Поиск пользователей</h2>

            <div className="relative flex gap-2 mb-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Введите имя или фамилию"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 text-black rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <FiX />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-2 bg-lime-400 text-black px-6 py-3 rounded-3xl hover:bg-lime-500 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <FiSearch />
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-400"></div>
                </div>
            )}

            {error && (
                <div className="p-4 mb-4 text-pink-500 bg-pink-50 rounded-xl flex items-center gap-2">
                    <FiX className="flex-shrink-0" />
                    {error}
                </div>
            )}

            {results && results.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {results.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-3xl transition cursor-pointer border border-gray-200"
                            onClick={() => handleRedirect(user.id.toString())}
                        >
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-black">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                        </div>
                    ))}
                </ul>
            )}

            {results && results.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FiUser className="text-4xl mb-2" />
                    <p>Пользователи не найдены</p>
                    <p className="text-sm mt-1">Попробуйте изменить запрос</p>
                </div>
            )}
        </div>
    )
}