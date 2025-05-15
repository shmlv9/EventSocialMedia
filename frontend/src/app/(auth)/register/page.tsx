'use client';

import {useState} from 'react';
import {validateEmail, validatePhone} from "@/utils/validation";
import {useRouter} from "next/navigation";
import {registerUser} from "@/lib/api/apiAuth";
import toast from "react-hot-toast";
import PrettyDatePicker from "@/components/ui/DateTimePicker/DatePick";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async () => {
        if (!validateEmail(email)) return toast.error('Введите корректный email');
        if (!validatePhone(phone)) return toast.error('Введите корректный номер телефона');
        if (!password || password.length < 6) return toast.error('Пароль должен быть не менее 6 символов');
        if (!birthDate) return toast.error('Выберите дату рождения');

        setIsLoading(true);
        try {
            const result = await registerUser(
                email,
                password,
                firstName,
                lastName,
                phone,
                birthDate,
            )
            if (result) {
                toast.success('Регистрация прошла успешно');
                router.push('/events');
            }
        } catch (error) {
            console.log(error)
            toast.error('Ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div
                className="w-full max-w-md p-8 bg-neutral-900 shadow-pink-500 border border-pink-500 shadow-2xl rounded-3xl">
                <h1 className="text-3xl font-bold text-lime-400 mb-2 text-center">Регистрация</h1>
                <p className="text-gray-400 text-center mb-6">Создайте аккаунт для участия в событиях</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Имя</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                            placeholder="Ваше имя"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Фамилия</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                            placeholder="Ваша фамилия"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Телефон</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                            placeholder="+7 (999) 123-45-67"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Дата рождения</label>
                        <PrettyDatePicker selectedDate={birthDate} onChange={setBirthDate} className="w-full"/>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-lime-400 text-black font-bold py-2 rounded-full hover:bg-lime-300 transition"
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Уже есть аккаунт?{' '}
                        <a href="/login" className="text-lime-400 hover:underline">
                            Войти
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}