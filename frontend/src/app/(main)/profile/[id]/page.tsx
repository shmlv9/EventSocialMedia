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
        return <div className="text-white">Пользователь не найден</div>;
    }

    return (
        <div className="md:pb-0 min-h-screen bg-black rounded-3xl">
            <div className="relative h-48 bg-gradient-to-r from-pink-500 to-lime-400 rounded-t-3xl">
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <div className="relative">
                        <img
                            src={userData.avatar}
                            alt="Аватар"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black bg-gradient-to-r from-pink-500 to-lime-400"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-16 md:mt-20 px-4 text-white">
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

                <div className="flex flex-wrap gap-4 mb-6 mt-2 text-neutral-300">
                    <div className="flex items-center">
                        <CiLocationOn className="text-xl text-lime-400 mr-2"/>
                        <span>{userData.city || 'Неизвестно'}</span>
                    </div>
                    <div className="flex items-center">
                        <CiCalendar className="text-xl text-lime-400 mr-2"/>
                        <span>{userData.birthday || 'Неизвестно'}</span>
                    </div>
                </div>

                <div className="flex space-x-4 mb-6">
                    <Link
                        href={`/profile/${id}/friends`}
                        className="flex items-center space-x-1 text-lime-400 hover:text-lime-300 transition-colors hover:underline underline-offset-2"
                    >
                        <span className="font-semibold">{userData.friends_count || 0}</span>
                        <span>друзей</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>

                    <Link
                        href={`/profile/${id}/groups`}
                        className="flex items-center space-x-1 text-lime-400 hover:text-lime-300 transition-colors hover:underline underline-offset-2"
                    >
                        <span className="font-semibold">{userData.groups_count || 0}</span>
                        <span>групп</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">О себе</h2>
                    <p className={`text-neutral-300 ${!userData.bio && 'italic text-neutral-500'}`}>
                        {userData.bio || 'Тишина... Пользователь пока хранит молчание о своей личности'}
                    </p>
                </div>
            </div>

            <div className=" flex flex-col items-center h-full justify-center rounded-2xl p-6 md:p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-4">
                    {String(userID) === String(id) ? 'Мои мероприятия' : 'Мероприятия'}
                </h1>
                <div className="space-y-4 w-full">
                    <MyEvents id={id}/>
                </div>
            </div>
        </div>
    );
}
