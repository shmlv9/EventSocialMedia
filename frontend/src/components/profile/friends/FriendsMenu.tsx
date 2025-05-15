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
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

    const {userID} = useUser();

    const filteredFriends = useMemo(() =>
        friends.filter(friend =>
            `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        ), [friends, searchQuery]);

    const filteredRequests = useMemo(() =>
        friendRequests.filter(request =>
            `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        ), [friendRequests, searchQuery]);

    const handleDeleteFriend = async (id: string) => {
        if (loading[id]) return;

        setLoading(prev => ({...prev, [id]: true}));

        try {
            const success = await deleteFriend(id);
            if (success) {
                toast.success('Успех');
                setFriends(friends.filter(friend => friend.id !== id));
            } else {
                toast.error("Не удалось удалить друга. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`);
        } finally {
            setLoading(prev => ({...prev, [id]: false}));
        }
    };

    const handleAcceptRequest = async (id: string) => {
        if (loading[id]) return;

        setLoading(prev => ({...prev, [id]: true}));

        try {
            const success = await acceptRequest(id);
            if (success) {
                toast.success('Заявка принята');
                setFriendRequests(friendRequests.filter(request => request.id !== id));
            } else {
                toast.error("Не удалось принять заявку. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`);
        } finally {
            setLoading(prev => ({...prev, [id]: false}));
        }
    };

    const handleRejectRequest = async (id: string) => {
        if (loading[id]) return;

        setLoading(prev => ({...prev, [id]: true}));

        try {
            const success = await rejectRequest(id);
            if (success) {
                toast.success('Заявка отклонена');
                setFriendRequests(friendRequests.filter(request => request.id !== id));
            } else {
                toast.error("Не удалось отклонить заявку. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            toast.error(`${error}`);
        } finally {
            setLoading(prev => ({...prev, [id]: false}));
        }
    };

    const router = useRouter();

    const handleRedirect = (id: string) => {
        router.push(`/profile/${id}`);
    };

    return (
        <div className="bg-neutral-900 w-full h-full rounded-3xl shadow-lg border border-pink-500 shadow-pink-500/20 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">{userID === id ? 'Мои друзья' : 'Друзья'}</h2>
                <div className="relative w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Поиск друзей..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex border-b border-neutral-700 mb-6">
                <button
                    className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'friends' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('friends')}
                >
                    <FiUserCheck className="mr-2"/>
                    Друзья ({friends.length})
                </button>
                {id === userID &&
                    <button
                        className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'requests' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400'}`}
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
                            <div key={friend.id || index} className="flex items-center justify-between p-4 hover:bg-neutral-800 rounded-3xl transition">
                                <div className="flex items-center hover:cursor-pointer"
                                     onClick={() => handleRedirect(friend.id)}>
                                    <img
                                        src={friend.avatar}
                                        alt={friend.last_name}
                                        className="w-12 h-12 rounded-full mr-4 border border-pink-500"
                                    />
                                    <h4 className="font-medium text-white">{friend.first_name} {friend.last_name} {userID === String(friend.id) && <span className="text-pink-400 text-sm"> - это вы</span>}</h4>
                                </div>
                                {userID === id && (
                                    <button
                                        onClick={() => handleDeleteFriend(friend.id)}
                                        disabled={loading[friend.id]}
                                        className="text-pink-400 hover:text-pink-300 flex items-center text-sm transition"
                                    >
                                        <FiUserX className="mr-1"/>
                                        {loading[friend.id] ? 'Удаление...' : 'Удалить'}
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">
                            {searchQuery ? 'Друзья не найдены' : (userID === id ? 'У вас пока нет друзей' : 'Друзья отсутствуют')}
                        </p>
                    )}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request, index) => (
                            <div key={request.id || index} className="flex items-center justify-between p-4 hover:bg-neutral-800 rounded-3xl transition">
                                <div className="flex items-center hover:cursor-pointer"
                                     onClick={() => handleRedirect(request.id)}>
                                    <img
                                        src={request.avatar}
                                        alt={request.last_name}
                                        className="w-12 h-12 rounded-full mr-4 border border-pink-500"
                                    />
                                    <h4 className="font-medium text-white">{request.first_name} {request.last_name}</h4>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        disabled={loading[request.id]}
                                        className="px-4 py-1 bg-lime-400 text-black rounded-lg hover:bg-lime-300 text-sm transition"
                                    >
                                        <GrCheckmark/>
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.id)}
                                        disabled={loading[request.id]}
                                        className="px-4 py-1 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 text-sm transition"
                                    >
                                        <RxCross1/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">
                            {searchQuery ? 'Заявки не найдены' : 'У вас нет новых заявок'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}