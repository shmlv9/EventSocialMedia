import {CiLocationOn, CiCalendar} from "react-icons/ci";
import {FiChevronRight} from "react-icons/fi";
import {fetchID, fetchProfile} from "@/lib/api/apiUser";
import Link from "next/link";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import SettingButton from "@/components/profile/settings/SettingButton";
import FriendButton from "@/components/profile/friends/FriendButton";
import MyEvents from "@/components/profile/events/MyEvents";

export default async function ProfilePage({params}: { params: { id: string } }) {
    const {id} = await params;
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const userData = await fetchProfile(id);

    const cookieStore = await cookies();
    const rawToken = cookieStore.get('token');
    if (!rawToken) redirect('/login');
    const token = rawToken.value;

    const userID = await fetchID();
    if (!userID || userID.detail) redirect('/logout');

    if (!userData) {
        return <div className="text-black">Пользователь не найден</div>;
    }
    return (
        <div className="min-h-screen bg-white">
            {/* Шапка профиля */}
            <div className="relative h-48 bg-black rounded-t-3xl">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                    <div className="relative">
                        <img
                            src={userData.avatar_url}
                            alt="Аватар"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Основная информация */}
            <div className="mt-16 md:mt-20 px-6 text-black">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {userData.last_name + ' ' + userData.first_name || 'Без имени'}
                    </h1>
                    <div>
                        {String(userID) !== String(id) ? (
                            <FriendButton id={id} apiUrl={apiUrl ?? ''} token={token ?? ''}
                                          status={userData.friendship_status}/>
                        ) : (
                            <SettingButton/>
                        )}
                    </div>
                </div>

                {/* Местоположение и дата рождения */}
                <div className="flex flex-wrap gap-4 my-4">
                    <div className="flex items-center">
                        <CiLocationOn className="text-xl text-lime-500 mr-2"/>
                        <span>{userData.city || 'Не указано'}</span>
                    </div>
                    <div className="flex items-center">
                        <CiCalendar className="text-xl text-lime-500 mr-2"/>
                        <span>{userData.birthday || 'Не указана'}</span>
                    </div>
                </div>

                {/* Статистика */}
                <div className="flex space-x-6 mb-6">
                    <Link
                        href={`/profile/${id}/friends`}
                        className="flex items-center space-x-1 text-black hover:text-lime-500 transition-colors group"
                    >
                        <span className="font-semibold group-hover:underline">{userData.friends_count || 0}</span>
                        <span>друзей</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>

                    <Link
                        href={`/profile/${id}/groups`}
                        className="flex items-center space-x-1 text-black hover:text-lime-500 transition-colors group"
                    >
                        <span className="font-semibold group-hover:underline">{userData.groups_count || 0}</span>
                        <span>групп</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>
                </div>

                {/* О себе */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">О себе</h2>
                    <p className={`text-gray-700 ${!userData.bio && 'italic text-gray-500'}`}>
                        {userData.bio || 'Пользователь пока ничего не рассказал о себе'}
                    </p>
                </div>
            </div>

            {/* Мероприятия */}
            <div className="rounded-3xl">
                <h1 className="text-2xl font-bold text-black mb-6 text-center pt-6">
                    {String(userID) === String(id) ? 'Мои мероприятия' : 'Мероприятия'}
                </h1>
                <div className="space-y-4 w-full mb-5">
                    <MyEvents id={id}/>
                </div>
            </div>
        </div>
    );
}