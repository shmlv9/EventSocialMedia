import InvitationActions from '@/components/groups/InvitationActions';
import React from 'react';
import {FiMapPin, FiUsers} from 'react-icons/fi';

export default async function JoinPrivateGroupPage({params}: { params: { token: string } }) {

    const group = {
        id: 1,
        name: 'Путешественники по России',
        avatar_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd',
        members_count: 124,
        upcoming_event: 'Поход на Байкал',
        event_date: '15 августа 2023',
        location: 'Москва, Россия',
        description: 'Сообщество для любителей активного отдыха и путешествий по России. Организуем походы, поездки и встречи.'
    }

    const {token} = params
    // const {group} = await getInvitationData(token)

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="bg-pink-500 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">
                        Приглашение в частную группу
                    </h1>
                </div>

                <div className="p-6">

                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                            <img
                                src={group.avatar_url}
                                alt={group.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-center text-gray-800">
                            {group.name}
                        </h2>
                    </div>


                    <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                            <FiUsers className="text-lime-500 mr-3 text-lg"/>
                            <span className="text-gray-700">
                {group.members_count} участников
              </span>
                        </div>

                        <div className="flex items-center">
                            <FiMapPin className="text-lime-500 mr-3 text-lg"/>
                            <span className="text-gray-700">{group.location}</span>
                        </div>
                    </div>


                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">О группе</h3>
                        <p className="text-gray-600">{group.description}</p>
                    </div>


                    <InvitationActions groupId={group.id}/>
                </div>

            </div>
        </div>
    )
}