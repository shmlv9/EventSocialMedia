'use client';

import {useState} from 'react';
import Button from "@/components/ui/Button";
import {validateEmail, validateName, validatePhone} from "@/utils/validation";
import {useRouter} from "next/navigation";
import {registerUser} from "@/lib/api/apiAuth";
import toast from "react-hot-toast";
import PrettyDatePicker from "@/components/ui/DateTimePicker/DatePick";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [dateBirth, setDateBirth] = useState('null');
    const router = useRouter();

    const handleDateChange = (date: string) => {
        setDateBirth(date);
    };

    const handleRegister = async () => {
        if (!validateName(name)) {
            toast.error('Введите имя по образцу');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Введите корректный email');
            return;
        }

        if (!validatePhone(phone)) {
            toast.error('Введите корректный номер телефона');
            return;
        }

        if (password.length < 6) {
            toast.error('Пароль должен содержать минимум 6 символов');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        if (!name.trim()) {
            toast.error('Введите ваше имя');
            return;
        }

        setIsLoading(true);

        try {
            const reg = await registerUser(email, password, name, dateBirth, phone);
            if (reg) {
                localStorage.setItem('token', "token");
                router.push('/login/');
            }
        } catch (e) {
            toast.error(String(e));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className='bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 w-full min-w-md max-w-md'>
            <div className="text-center">
                <h1 className='font-bold text-3xl text-emerald-800 mb-2'>Регистрация в ESM</h1>
                <h3 className='text-gray-600'>Создайте новый аккаунт</h3>
            </div>

            <div className='w-full h-8 flex justify-center items-center'>
            </div>

            <div className="w-full space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ваше имя
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
                        placeholder="Иван Иванов"
                    />
                </div>


                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type='email'
                        id="login"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
                        placeholder='your@email.com'
                    />
                </div>
                <div>
                    <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                    </label>
                    <input
                        type='tel'
                        id="login"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
                        placeholder='+7 (123) 456-78-90'
                    />
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition pr-10"
                        placeholder="••••••••"
                    />

                    <button
                        type="button"
                        className="absolute right-3 top-8 p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Подтвердите пароль
                    </label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition pr-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-8 p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
                <div className={'relative'}>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                        Дата рождения
                    </label>
                    <div className={'block'}>
                        <PrettyDatePicker onChange={handleDateChange}/>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <div className="mt-4 text-sm text-gray-500">
                Уже есть аккаунт?{' '}
                <a href="/login/" className="text-emerald-600 hover:underline">
                    Войти
                </a>
            </div>
        </div>
    );
}