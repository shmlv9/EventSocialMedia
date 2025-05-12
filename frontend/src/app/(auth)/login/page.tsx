'use client';

import {useState} from 'react';
import Button from "@/components/ui/Button";
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
            toast.error('Введите корректный email');
            return;
        }

        if (loginMethod === 'phone_number' && !validatePhone(loginValue)) {
            toast.error('Введите корректный номер телефона');
            return;
        }


        try {
            const userExists = await checkUserExists(loginMethod, loginValue);
            if (userExists) {
                setStep('password');
            } else {
                toast.error('Пользователь не найден.');
            }
        } catch (e) {
            console.error(e);
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
                toast.error('Пользователь не найден.');
            }
        } catch (e) {
            console.error(e);
            toast.error('Ошибка сервера.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className='bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 w-full min-w-md max-w-md'>
            <div className="text-center">
                <h1 className='font-bold text-3xl text-emerald-800 mb-2'>
                    {step === 'auth' ? 'Вход в ESM' : 'Введите пароль'}
                </h1>
                <h3 className='text-gray-600'>
                    {step === 'auth'
                        ? 'Введите email или телефон'
                        : `Пароль для ${loginValue}`
                    }
                </h3>
            </div>

            <div className='w-full h-8 flex justify-center items-center overflow-hidden'>
            </div>


            {step === 'auth' ? (
                <>
                    <SelectMethod
                        loginMethod={loginMethod}
                        setLoginMethod={setLoginMethod}
                    />

                    <div className="w-full space-y-4 mt-4">
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                                {loginMethod === 'email' ? 'Email' : 'Телефон'}
                            </label>
                            <input
                                type={loginMethod === 'email' ? 'email' : 'phone_number'}
                                id="login"
                                value={loginValue}
                                onChange={(e) => setLoginValue(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
                                placeholder={loginMethod === 'email' ? 'your@email.com' : '+7 (123) 456-78-90'}
                            />
                        </div>

                    </div>

                    <Button
                        onClick={handleCheckUser}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Проверка...' : 'Продолжить'}
                    </Button>
                </>
            ) : (
                <>
                    <div className="w-full space-y-4">
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

                    </div>
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                </>
            )}

            <div className="mt-4 text-sm text-gray-500">
                Нет аккаунта?{' '}
                <a href="/register/" className="text-emerald-600 hover:underline">
                    Зарегистрироваться
                </a>
            </div>
        </div>
    );
}