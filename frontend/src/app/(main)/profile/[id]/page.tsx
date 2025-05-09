import {CiSettings, CiLocationOn, CiCalendar} from "react-icons/ci";
import {FiChevronRight} from "react-icons/fi";
import {fetchProfile} from "@/api/user";
import Link from "next/link";


export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const userData = await fetchProfile(id);

    if (!userData) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <div className="pb-16 md:pb-0">

            <div className="relative h-48 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-t-3xl">
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <div className="relative">
                         <img
                            src={userData.avatar}
                            alt=""
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gradient-to-r from-emerald-700 to-emerald-400"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-16 md:mt-20 px-4">
                <div className="flex items-center mb-6 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {userData.last_name + ' ' + userData.first_name || 'Без имени'}
                        </h1>
                    </div>
                    <Link href='/settings' className='m-3 p-2 rounded-full active:scale-70 duration-200'>
                        <CiSettings className='text-3xl text-emerald-700'/>
                    </Link>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center text-gray-700">
                            <CiLocationOn className="text-xl text-emerald-600 mr-2"/>
                            <span>{userData.city ? userData.city : 'Неизвестно'}</span>
                        </div>


                        <div className="flex items-center text-gray-700">
                            <CiCalendar className="text-xl text-emerald-600 mr-2"/>
                            <span>{userData.birthday ? userData.birthday : 'Неизвестно'}</span>
                        </div>

                </div>

                <div className="flex space-x-4 mb-6">
                    <Link
                        href={`/profile/${id}/friends`}
                        className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <span className="font-semibold">{userData.friendsCount || 0}</span>
                        <span>друзей</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>

                    <Link
                        href={`/profile/${id}/groups`}
                        className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <span className="font-semibold">{userData.groupsCount || 0}</span>
                        <span>групп</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>
                </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            О себе
                        </h2>
                        <p className="text-gray-700">{userData.bio ? userData.bio : 'Тишина... Пользователь пока хранит молчание о своей личности'}</p>
                    </div>

                <div className='mb-8 justify-center items-center flex flex-col'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>Мои мероприятия</h1>
                    <div className='space-y-4'>

                        Карточка
                    </div>
                </div>
            </div>
        </div>
    )
}