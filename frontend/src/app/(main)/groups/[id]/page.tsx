import {FiChevronRight} from 'react-icons/fi'
import {MdOutlinePhotoLibrary} from 'react-icons/md'
import {CiLocationOn, CiCalendar} from "react-icons/ci"
import Link from "next/link"
import JoinGroupButton from "@/components/groups/JoinGroupButton";
import {fetchGroup} from "@/lib/api/groups/apiGroup";
import SettingsGroupButton from '@/components/groups/settings/SettingsGroupButton';

type Admin = {
    id: string,
    first_name: string
    last_name: string,
    avatar_url: string,
}

type Group = {
    id: string,
    name: string,
    description: string,
    avatar_url: string,
    cover_url: string,
    location: string,
    created_at: string,
    tags: string[],
    members_count: number,
    events_count: number,
    status: string | null,
    admins: Admin[],
}

export default async function GroupPage({params}: { params: { id: string } }) {
    const {id} = params

    const groupData: Group = await fetchGroup(id)
    console.log(groupData.status)
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Шапка профиля группы */}
            <div className="relative h-48 bg-black rounded-t-3xl">
                {groupData.cover_url ? (
                    <img
                        src={groupData.cover_url}
                        alt="Обложка группы"
                        className="w-full h-full object-cover rounded-t-3xl"
                    />
                ) : (
                    <div
                        className="w-full h-full bg-gray-800 rounded-t-3xl flex items-center justify-center text-gray-500">
                        <MdOutlinePhotoLibrary className="text-5xl"/>
                    </div>
                )}

                {/* Аватар группы */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                    <div className="relative">
                        {groupData.avatar_url ? (
                            <img
                                src={groupData.avatar_url}
                                alt="Аватар группы"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white object-cover"
                            />
                        ) : (
                            <div
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-lime-500 flex items-center justify-center text-white text-4xl font-bold">
                                {groupData.name[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Основная информация */}
            <div className="mt-16 md:mt-20 px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{groupData.name}</h1>

                        {/* Местоположение и дата создания */}
                        <div className="flex flex-wrap gap-4 mt-3">
                            {groupData.location && (
                                <div className="flex items-center text-gray-700">
                                    <CiLocationOn className="text-xl text-lime-500 mr-2"/>
                                    <span>{groupData.location}</span>
                                </div>
                            )}
                            <div className="flex items-center text-gray-700">
                                <CiCalendar className="text-xl text-lime-500 mr-2"/>
                                <span>Создана {new Date(groupData.created_at).toLocaleDateString('ru-RU')}</span>
                            </div>
                        </div>
                    </div>

                    {/*Прописать логику*/}

                    {groupData.status === 'member' &&
                        <div className="flex gap-2 flex-wrap">
                            <JoinGroupButton
                                status={groupData.status}
                                groupId={id}
                            />
                        </div>}
                    {groupData.status === null &&
                        <div className="flex gap-2 flex-wrap">
                            <JoinGroupButton
                                status={groupData.status}
                                groupId={id}
                            />
                        </div>}
                    {(groupData.status === 'admin' || groupData.status === 'creator') &&
                        <div className="flex gap-2 flex-wrap">
                                <SettingsGroupButton
                                groupId={id}
                            />
                        </div>}

                </div>

                {/* Теги */}
                {groupData.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {groupData.tags.map(tag => (
                            <span
                                key={tag}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Описание */}
                <div className="my-6">
                    <h2 className="text-lg font-semibold mb-2">О группе</h2>
                    <p className={`text-gray-700 ${!groupData.description && 'italic text-gray-500'}`}>
                        {groupData.description || 'Группа пока не добавила описание'}
                    </p>
                </div>

                {/* Статистика */}
                <div className="flex space-x-6 mb-6">
                    <Link
                        href={`/groups/${id}/members`}
                        className="flex items-center space-x-1 text-black hover:text-lime-500 transition-colors group"
                    >
                        <span
                            className="font-semibold group-hover:underline">{groupData.members_count.toLocaleString()}</span>
                        <span>участников</span>
                        <FiChevronRight className="h-4 w-4"/>
                    </Link>

                    {/*<Link*/}
                    {/*    href={`/groups/${id}/events`}*/}
                    {/*    className="flex items-center space-x-1 text-black hover:text-lime-500 transition-colors group"*/}
                    {/*>*/}
                    {/*    <span className="font-semibold group-hover:underline">{groupData.events_count}</span>*/}
                    {/*    <span>мероприятий</span>*/}
                    {/*    <FiChevronRight className="h-4 w-4"/>*/}
                    {/*</Link>*/}
                </div>
            </div>

            {/* Администрация */
            }
            <div className="px-6 py-4">
                <h3 className="text-lg font-semibold mb-3">Администрация</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {groupData.admins.map(admin => (
                        <Link
                            key={admin.id}
                            href={`/profile/${admin.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {admin.avatar_url ? (
                                <img
                                    src={admin.avatar_url}
                                    alt={`${admin.first_name} ${admin.last_name}`}
                                    className="w-12 h-12 rounded-full border-2 border-black object-cover"
                                />
                            ) : (
                                <div
                                    className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-black">
                                    {admin.first_name[0]}{admin.last_name[0]}
                                </div>
                            )}
                            <div>
                                <p className="font-medium">{admin.first_name} {admin.last_name}</p>
                                <p className="text-sm text-gray-500">Администратор</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Мероприятия группы */
            }
            <div className="rounded-3xl bg-gray-50 mt-6">
                <h2 className="text-2xl font-bold mb-6 text-center pt-6">Ближайшие мероприятия</h2>
                <div className="space-y-4 w-full mb-5 px-6">
                    {/*<GroupEvents groupId={id}/>*/}
                </div>
                <div className="text-center pb-6">
                    <Link
                        href={`/groups/${id}/events`}
                        className="text-lime-500 hover:text-lime-600 font-medium"
                    >
                        Все мероприятия →
                    </Link>
                </div>
            </div>
        </div>
    )
}