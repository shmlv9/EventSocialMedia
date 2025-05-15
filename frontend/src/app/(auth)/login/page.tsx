'use client';

import {useState} from 'react';
import SelectMethod from "@/components/auth/SelectMethod";
import {checkLogin, checkUserExists} from "@/lib/api/apiAuth";
import {validateEmail, validatePhone} from "@/utils/validation";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<"email" | "phone_number">("email");
    const [loginValue, setLoginValue] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'auth' | 'password'>('auth');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleCheckUser = async () => {
        if (loginMethod === 'email' && !validateEmail(loginValue)) {
            return toast.error('Введите корректный email');
        }

        if (loginMethod === 'phone_number' && !validatePhone(loginValue)) {
            return toast.error('Введите корректный номер телефона');
        }

        setIsLoading(true);
        try {
            const userExists = await checkUserExists(loginMethod, loginValue);
            if (userExists) {
                setStep('password');
            } else {
                toast.error('Пользователь не найден.');
            }
        } catch (e) {
            toast.error('Ошибка сервера.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userLogin = await checkLogin(loginMethod, loginValue, password);
            if (userLogin) {
                router.push('/events');
            } else {
                toast.error('Неверный логин или пароль.');
            }
        } catch (e) {
            toast.error('Ошибка сервера.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div
                className="w-full max-w-md p-8 bg-neutral-900 shadow-pink-500 border border-pink-500 shadow-2xl rounded-3xl">
                <h1 className="text-3xl font-bold text-lime-400 mb-2 text-center">
                    {step === 'auth' ? 'Вход в Миротеку' : 'Введите пароль'}
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    {step === 'auth' ? 'Введите email или телефон' : `Пароль для ${loginValue}`}
                </p>

                {step === 'auth' ? (
                    <>
                        <SelectMethod loginMethod={loginMethod} setLoginMethod={setLoginMethod}/>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="login" className="block text-sm font-medium text-white mb-1">
                                    {loginMethod === 'email' ? 'Email' : 'Телефон'}
                                </label>
                                <input
                                    type={loginMethod === 'email' ? 'email' : 'tel'}
                                    id="login"
                                    value={loginValue}
                                    onChange={(e) => setLoginValue(e.target.value)}
                                    placeholder={loginMethod === 'email' ? 'your@email.com' : '+7 (999) 123-45-67'}
                                    className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                                />
                            </div>
                            <button
                                onClick={handleCheckUser}
                                disabled={isLoading}
                                className="w-full bg-lime-400 text-black font-bold py-2 rounded-full hover:bg-lime-300 transition"
                            >
                                {isLoading ? 'Проверка...' : 'Продолжить'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                    Пароль
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 pr-10 transition"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-gray-400 hover:text-lime-400 transition"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59M21 21l-3.59-3.59"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-lime-400 text-black font-bold py-2 rounded-full hover:bg-lime-300 transition"
                            >
                                {isLoading ? 'Вход...' : 'Войти'}
                            </button>
                        </div>
                    </>
                )}

                <p className="mt-6 text-center text-sm text-gray-400">
                    Нет аккаунта?{' '}
                    <a href="/register" className="text-lime-400 hover:underline">
                        Зарегистрироваться
                    </a>
                </p>
            </div>
        </div>
    );
}
