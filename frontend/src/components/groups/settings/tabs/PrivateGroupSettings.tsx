'use client'

import React, {useState} from 'react';
import {FiCopy, FiRefreshCw, FiCheck, FiLock, FiUnlock} from 'react-icons/fi';
import {toast} from 'react-hot-toast';
import { updateGroup } from '@/lib/api/groups/apiGroup';

export default function PrivateGroupSettings({id, isPrivate: initialIsPrivate, }: { id: string, isPrivate: boolean }) {
    const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const generateInviteLink = async () => {
        setIsLoading(true);
        try {
            // const link = await getInvitationLink(id)
            const newLink = `https://yourapp.com/groups/join/${id}?token=${Math.random().toString(36).substring(2, 10)}`;
            setInviteLink(newLink);
            toast.success('Ссылка создана');
        } catch {
            toast.error('Ошибка при генерации');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        toast.success('Ссылка скопирована');
    };

    const handlePrivacyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsPrivate(newValue);


        try {
            await updateGroup(id, {is_private: e.target.checked});
            toast.success(`Группа теперь ${newValue ? 'приватная' : 'публичная'}`);
        } catch {
            toast.error('Ошибка при сохранении');
            setIsPrivate(!newValue); // Откат при ошибке
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    {isPrivate ? (
                        <FiLock className="text-pink-500"/>
                    ) : (
                        <FiUnlock className="text-lime-500"/>
                    )}
                    Настройки приватности
                </h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_private"
                        name="is_private"
                        checked={isPrivate}
                        onChange={handlePrivacyChange}
                        className="h-5 w-5 text-lime-500 focus:ring-lime-400 rounded border-gray-300"
                    />
                    <label htmlFor="is_private" className="ml-3 text-sm font-medium text-gray-700">
                        Закрытая группа (только по приглашениям)
                    </label>
                </div>

                {isPrivate && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                                Ссылка для приглашения
                            </h4>
                            <button
                                onClick={generateInviteLink}
                                disabled={isLoading}
                                className="flex items-center gap-1 text-sm text-lime-600 hover:text-lime-700 disabled:opacity-50"
                            >
                                <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`}/>
                                {inviteLink ? 'Перегенерировать' : 'Создать ссылку'}
                            </button>
                        </div>

                        {inviteLink ? (
                            <div className="flex rounded-md shadow-sm">
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                    <input
                                        type="text"
                                        readOnly
                                        value={inviteLink}
                                        className="block w-full rounded-l-md border-gray-300 bg-gray-50 p-2 text-sm text-gray-600 focus:border-lime-400 focus:ring-lime-400"
                                    />
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                                >
                                    <FiCopy className="h-4 w-4"/>
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-md bg-gray-50 p-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Создайте ссылку-приглашение для добавления участников
                                </p>
                                <button
                                    onClick={generateInviteLink}
                                    disabled={isLoading}
                                    className="mt-2 inline-flex items-center rounded-md border border-transparent bg-lime-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        'Генерация...'
                                    ) : (
                                        <>
                                            <FiCheck className="-ml-1 mr-2 h-4 w-4"/>
                                            Создать ссылку
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}