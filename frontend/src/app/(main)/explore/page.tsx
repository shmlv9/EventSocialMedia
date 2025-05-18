'use client'

import { useState } from 'react'
import { apiFetchClient } from "@/lib/api/apiFetchClient"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { FiSearch, FiUser, FiUsers, FiX } from 'react-icons/fi'

type User = {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
}

type Group = {
    id: number
    name: string
    avatar_url: string | null
    members_count: number
}

export default function UniversalSearch() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [searchType, setSearchType] = useState<'users' | 'groups'>('users')
    const [results, setResults] = useState<(User | Group)[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) {
            toast.error('Введите поисковый запрос')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const endpoint = searchType === 'users'
                ? `/search/users/?query=${query.trim()}`
                : `/search/groups/?query=${query.trim()}`

            const res = await apiFetchClient(endpoint, { method: 'GET' })
            const data = await res.json()
            setResults(data)
        } catch (err) {
            setError('Произошла ошибка при поиске')
            toast.error('Ошибка при поиске')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setQuery('')
        setResults(null)
    }

    const handleRedirect = (id: string, type: 'users' | 'groups') => {
        router.push(type === 'users' ? `/profile/${id}` : `/groups/${id}`)
    }


    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-black">Поиск</h2>

            {/* Type selector */}
            <div className="flex mb-4 border-b border-gray-200">
                <button
                    className={`flex-1 py-2 font-medium flex items-center justify-center ${searchType === 'users' ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-600'}`}
                    onClick={() => setSearchType('users')}
                >
                    <FiUser className="mr-2" />
                    Пользователи
                </button>
                <button
                    className={`flex-1 py-2 font-medium flex items-center justify-center ${searchType === 'groups' ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-600'}`}
                    onClick={() => setSearchType('groups')}
                >
                    <FiUsers className="mr-2" />
                    Группы
                </button>
            </div>

            {/* Search input */}
            <div className="relative flex gap-2 mb-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={searchType === 'users' ? 'Введите имя или фамилию' : 'Введите название группы'}
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
                    {results.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-3xl transition cursor-pointer border border-gray-200"
                            onClick={() => handleRedirect(item.id.toString(), searchType)}
                        >
                            {item.avatar_url ? (
                                <img
                                    src={item.avatar_url}
                                    alt={''}
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                    {'first_name' in item
                                        ? `${item.first_name[0]}${item.last_name[0]}`
                                        : item.name[0]}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-black">
                                    {'first_name' in item
                                        ? `${item.first_name} ${item.last_name}`
                                        : item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {searchType === 'groups' && 'members_count' in item
                                        ? `${item.members_count} участников`
                                        : `ID: ${item.id}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </ul>
            )}

            {results && results.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    {searchType === 'users' ? <FiUser className="text-4xl mb-2" /> : <FiUsers className="text-4xl mb-2" />}
                    <p>{searchType === 'users' ? 'Пользователи не найдены' : 'Группы не найдены'}</p>
                    <p className="text-sm mt-1">Попробуйте изменить запрос</p>
                </div>
            )}
        </div>
    )
}