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
    avatar_url: string;
};

type FriendRequest = {
    id: string;
    last_name: string;
    first_name: string;
    avatar_url: string;
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
        <div className="bg-white w-full h-full rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-black">{userID === id ? 'Мои друзья' : 'Друзья'}</h2>
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Поиск друзей..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-3xl focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'friends' ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('friends')}
                >
                    <FiUserCheck className="mr-2"/>
                    Друзья ({friends.length})
                </button>
                {id === userID &&
                    <button
                        className={`px-4 py-2 font-medium flex items-center hover:cursor-pointer ${activeTab === 'requests' ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <FiUserPlus className="mr-2"/>
                        Заявки ({friendRequests.length})
                    </button>}
            </div>

            {activeTab === 'friends' && (
                <div className="space-y-3">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <div key={friend.id || index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition">
                                <div className="flex items-center hover:cursor-pointer gap-3"
                                     onClick={() => handleRedirect(friend.id)}>
                                    {friend.avatar_url ? (
                                        <img
                                            src={friend.avatar_url}
                                            alt={friend.last_name}
                                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                            {friend.first_name[0]}{friend.last_name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-black">{friend.first_name} {friend.last_name}</h4>
                                        {userID === String(friend.id) && (
                                            <span className="text-pink-400 text-sm">Это вы</span>
                                        )}
                                    </div>
                                </div>
                                {userID === id && (
                                    <button
                                        onClick={() => handleDeleteFriend(friend.id)}
                                        disabled={loading[friend.id]}
                                        className="text-pink-500 hover:text-pink-600 flex items-center text-sm transition"
                                    >
                                        <FiUserX className="mr-1"/>
                                        {loading[friend.id] ? 'Удаление...' : 'Удалить'}
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-6">
                            {searchQuery ? 'Друзья не найдены' : (userID === id ? 'У вас пока нет друзей' : 'Друзья отсутствуют')}
                        </p>
                    )}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-3">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request, index) => (
                            <div key={request.id || index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition">
                                <div className="flex items-center hover:cursor-pointer gap-3"
                                     onClick={() => handleRedirect(request.id)}>
                                    {request.avatar_url ? (
                                        <img
                                            src={request.avatar_url}
                                            alt={request.last_name}
                                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white">
                                            {request.first_name[0]}{request.last_name[0]}
                                        </div>
                                    )}
                                    <h4 className="font-medium text-black">{request.first_name} {request.last_name}</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        disabled={loading[request.id]}
                                        className="p-2 bg-lime-400 text-black rounded-full hover:bg-lime-500 transition"
                                    >
                                        <GrCheckmark/>
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.id)}
                                        disabled={loading[request.id]}
                                        className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                                    >
                                        <RxCross1/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-6">
                            {searchQuery ? 'Заявки не найдены' : 'У вас нет новых заявок'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}