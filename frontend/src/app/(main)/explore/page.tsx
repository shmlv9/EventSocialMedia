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
            setResults(data.results);
        } catch (err) {
            setError('Произошла ошибка при поиске');
            toast.error('Ошибка при поиске пользователей');
        } finally {
            setLoading(false);
        }
    }

    const handleRedirect = (id: string) => {
        router.push(`/profile/${id}`);
    };

    return (
        <div className="p-6 bg-neutral-900 rounded-3xl border border-pink-500 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Поиск пользователей</h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Введите имя"
                    className="flex-1 bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:bg-lime-300 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </div>

            {loading && <p className="mt-4 text-gray-400">Загрузка...</p>}
            {error && <p className="mt-4 text-pink-400">{error}</p>}

            {results && results.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {results.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition cursor-pointer border border-neutral-700"
                            onClick={() => handleRedirect(user.id.toString())}
                        >
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-10 h-10 rounded-full border border-pink-500"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-pink-400 font-medium border border-pink-500">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                            )}
                            <span className="text-white">
                                {user.first_name} {user.last_name}
                            </span>
                        </div>
                    ))}
                </ul>
            )}

            {results && results.length === 0 && !loading && (
                <p className="mt-4 text-gray-400">Ничего не найдено</p>
            )}
        </div>
    )
}