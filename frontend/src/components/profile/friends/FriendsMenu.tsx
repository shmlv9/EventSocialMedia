'use client'

import React, {useState, useMemo} from 'react';
import {FiSearch, FiUserPlus, FiUserCheck, FiUserX} from 'react-icons/fi';
import {GrCheckmark} from 'react-icons/gr';
import {RxCross1} from 'react-icons/rx';
import {acceptRequest, deleteFriend, rejectRequest} from "@/lib/api/apiFriends";
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation'
import {useUser} from "@/context/userContext";

type Friend = {
    id: string;
    last_name: string;
    first_name: string;
    avatar: string;
};

type FriendRequest = {
    id: string;
    last_name: string;
    first_name: string;
    avatar: string;
};

type Props = {
    id: string;
    friendsData: Friend[];
    requestsData: FriendRequest[];
};

export default function FriendsMenu({id, friendsData, requestsData}: Props) {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState<Friend[]>(friendsData);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(requestsData);

    const {userID} = useUser()

    const filteredFriends = useMemo(() =>
        friends.filter(friend =>
            `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        ), [friends, searchQuery]);

    const filteredRequests = useMemo(() =>
        friendRequests.filter(request =>
            `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        ), [friendRequests, searchQuery]);

    const handleDeleteFriend = async (id: string) => {
        try {
            const success = await deleteFriend(id);
            if (success) {
                toast.success('Успех')
            } else {
                toast.error("Не удалось удалить друга. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`)
        }
    };


    const handleAcceptRequest = async (id: string) => {
        try {
            const success = await acceptRequest(id);
            if (success) {
                toast.success('Успех')
            } else {
                toast.error("Не удалось принять заявку. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`)

        }
    };

    const handleRejectRequest = async (id: string) => {
        try {
            const success = await rejectRequest(id);
            toast.success('Идет запрос')
            if (success) {
                toast.success('Успех')
            } else {
                toast.error("Не удалось отклонить заявку. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`)
        }
    };

    const router = useRouter();

    const handleRedirect = (id: string) => {
        router.push(`/profile/${id}`)
    };
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{userID === id ? (<p>Мои друзья</p>) : (
                    <p>Друзья</p>)}</h2>
                <div className="relative w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Поиск друзей..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'friends' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('friends')}
                >
                    <FiUserCheck className="mr-2"/>
                    Друзья ({friends.length})
                </button>
                {id === userID &&
                    <button
                        className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'requests' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <FiUserPlus className="mr-2"/>
                        Заявки ({friendRequests.length})
                    </button>}
            </div>

            {activeTab === 'friends' && (
                <div className="space-y-4">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <div key={friend.id || index}
                                 className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center hover:cursor-pointer"
                                     onClick={() => handleRedirect(friend.id)}>
                                    <img
                                        src={friend.avatar}
                                        alt={friend.last_name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <h4 className="font-medium">{friend.first_name} {friend.last_name} {userID === String(friend.id) &&
                                        <span className={'text-emerald-700 text-sm'}> - это вы</span>}</h4>
                                </div>
                                {userID === id && (<button
                                    onClick={() => handleDeleteFriend(friend.id)}
                                    className="text-emerald-600 hover:cursor-pointer hover:text-emerald-900 flex items-center text-sm active:scale-90 duration-100"
                                >
                                    <FiUserX className="mr-1"/>
                                    Удалить
                                </button>)}
                            </div>

                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            {searchQuery ? 'Друзья не найдены' : (userID === id ? 'У вас пока нет друзей' : 'Друзья отсутствуют')}
                        </p>
                    )}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request, index) => (
                            <div key={request.id || index}
                                 className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center hover:cursor-pointer "
                                     onClick={() => handleRedirect(request.id)}>
                                    <img
                                        src={request.avatar}
                                        alt={request.last_name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <h4 className="font-medium">{request.first_name} {request.last_name}</h4>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        className="px-4 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm hover:cursor-pointer"
                                    >
                                        <GrCheckmark/>
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.id)}
                                        className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm hover:cursor-pointer"
                                    >
                                        <RxCross1/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            {searchQuery ? 'Заявки не найдены' : 'У вас нет новых заявок'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}