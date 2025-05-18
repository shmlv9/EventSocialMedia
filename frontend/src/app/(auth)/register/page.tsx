'use client';

import {useState} from 'react';
import {validateEmail, validatePhone} from "@/utils/validation";
import {useRouter} from "next/navigation";
import {registerUser} from "@/lib/api/auth/apiAuth";
import toast from "react-hot-toast";
import PrettyDatePicker from "@/components/ui/DateTimePicker/DatePick";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<string>('');
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
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

                    <h1 className="text-2xl font-bold pt-5 text-black text-center">Регистрация</h1>


                <div className="p-6 space-y-5">
                    <p className="text-gray-600 text-center mb-5">Создайте аккаунт для участия в событиях</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Имя*</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 rounded-3xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                                placeholder="Ваше имя"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 rounded-3xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                                placeholder="Ваша фамилия"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-3xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Телефон*</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-3xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                            placeholder="+7 (999) 123-45-67"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль*</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-3xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                            placeholder="Не менее 6 символов"
                            minLength={6}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения*</label>
                        <PrettyDatePicker
                            value={birthDate}
                            onChange={setBirthDate}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-lime-400 text-black font-bold py-3 rounded-3xl hover:bg-lime-300 transition flex items-center justify-center mt-4"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Регистрация...
                            </>
                        ) : 'Зарегистрироваться'}
                    </button>

                    <div className="text-center text-sm text-gray-500 pt-4">
                        Уже есть аккаунт?{' '}
                        <a href="/login" className="text-pink-500 font-medium hover:text-pink-600 transition">
                            Войти
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}