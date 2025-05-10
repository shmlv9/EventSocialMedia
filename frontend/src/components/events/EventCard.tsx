import {fetchEvent} from "@/lib/api/apiEvents";
import JoinButton from "@/components/events/JoinButton";
import DescriptionMenu from "@/components/events/DescriptionMenu";

type Event = {
    id: string
    title: string
    startDate: string
    endDate: string
    location: string
    description: string
    organizer: {
        name: string
        avatar: string
    }
    participantsCount: number
    image?: string
}

export default async function EventCard({ id }: { id: string }) {

    const event: Event = await fetchEvent(id)


    const startDate = new Date(event.startDate).toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    const endDate = new Date(event.endDate).toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow mb-6 max-w-xl">
            {/* Обложка мероприятия */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-50 to-emerald-100">
                {event.image ? (
                    <img
                        src={event.image}
                        className="w-full h-full object-cover"
                     alt={'1'}/>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-emerald-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Основное содержимое */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                            <div className="flex items-center text-sm text-emerald-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{startDate}</span>
                            </div>

                            <div className="flex items-center text-sm text-emerald-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{endDate}</span>
                            </div>
                        </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
            {event.participantsCount} участников
          </span>
                </div>

                <div className="flex items-center mb-4">
                    <img
                        src={event.organizer.avatar}
                        className="w-8 h-8 rounded-full mr-2 border-2 border-emerald-100"
                    />
                    <span className="text-sm text-gray-600">Организатор: {event.organizer.name}</span>
                </div>

                <DescriptionMenu description={event.description}/>

                {/* Блок локации */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <p className="font-medium">Место проведения</p>
                            <p>{event.location}</p>
                        </div>
                    </div>

                    <JoinButton />
                </div>
            </div>
        </div>
    )
}
