'use client'

import {useState} from 'react'
import {apiFetchClient} from "@/lib/api/apiFetchClient";
import {useRouter} from "next/navigation";
import toast from 'react-hot-toast';

type User = {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
}

export default function UserSearch() {

    const router = useRouter();

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) {
            toast.error('Введите корректное значение')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await apiFetchClient(`/search/users/?query=${query.trim()}`, {method: 'GET'});
            const data = await res.json();
            console.log(data)
            setResults(data.results);
        } catch (err) {
            setError('Произошла ошибка при поиске');
        } finally {
            setLoading(false);
        }
    }

    const handleRedirect = (id: string) => {
        router.push(`/profile/${id}`);
    };


    return (
        <div className="p-4 bg-white rounded-3xl">
            <h2 className="text-xl font-semibold mb-4">Поиск пользователей</h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Введите имя"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                    onClick={handleSearch}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                >
                    Найти
                </button>
            </div>

            {loading && <p className="mt-4 text-gray-500">Загрузка...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {results && results.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {results.map(user => (
                        <div key={user.id}
                             className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:cursor-pointer"
                             onClick={() => handleRedirect(user.id.toString())}>
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                            )}
                            <span className="text-gray-800">
                {user.first_name} {user.last_name}
              </span>
                        </div>
                    ))}
                </ul>
            )}

            {results && results.length === 0 && !loading && (
                <p className="mt-4 text-gray-500">Ничего не найдено</p>
            )}
        </div>
    )
}