'use client'

import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {FaUserMinus, FaUserPlus} from 'react-icons/fa';
import {joinGroup, leaveGroup} from "@/lib/api/groups/apiGroup";


export default function JoinGroupButton({groupId, status}: { groupId: string, status: string | null }) {

    const [userStatus, setUserStatus] = useState<string | null>(status)
    const [loading, setLoading] = useState<boolean>(false)

    async function handleJoin() {

        try {
            setLoading(true);
            const response = await joinGroup(groupId)

            if (response) {
                toast.success('Заявка на вступление отправлена');

                setUserStatus('member')
            } else {
                toast.error('Ошибка при добавлении');
            }
        } catch (e) {
            toast.error('Ошибка запроса');
            console.error(e);
        } finally {
            setLoading(false);
        }

    }

    async function handleLeave() {
        try {
            setLoading(true);
            const response = await leaveGroup(groupId)

            if (response) {
                toast.success('Вы вышли из группы');

                setUserStatus(null)
            } else {
                toast.error('Ошибка при добавлении');
            }
        } catch (e) {
            toast.error('Ошибка запроса');
            console.error(e);
        } finally {
            setLoading(false);
        }

    }

    console.log(userStatus)

    return (
        <div>
            {userStatus === null && (
                <button
                    onClick={handleJoin}
                    className={`flex items-center gap-2 p-2 rounded-2xl bg-lime-500 text-black hover:bg-lime-400 transition'
                    }`}
                >
                    <FaUserPlus/>
                    {loading ? 'Отправка...' : 'Вступить'}
                </button>
            )}
            {userStatus === 'member' && (
                <button
                    onClick={handleLeave}
                    className={`flex items-center gap-2 p-2 rounded-2xl text-black bg-pink-500 hover:bg-pink-400 transition'
                    }`}
                >
                    <FaUserMinus/>
                    {'Выйти'}
                </button>
            )}
        </div>
    );
};