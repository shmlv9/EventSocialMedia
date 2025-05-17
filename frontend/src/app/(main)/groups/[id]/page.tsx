// app/groups/[id]/page.tsx
import {FaUsers, FaRegBell, FaBell, FaEllipsisH} from 'react-icons/fa'
import {FiMessageSquare, FiShare2} from 'react-icons/fi'
import {MdOutlinePhotoLibrary} from 'react-icons/md'

const mockGroup = {
    id: '1',
    name: 'Клуб путешественников',
    description: 'Сообщество для тех, кто любит путешествия. Делимся опытом, советами и впечатлениями.',
    avatar: '/group-avatar.jpg',
    cover: '/group-cover.jpg',
    tags: ['путешествия', 'туризм', 'отдых'],
    membersCount: 12543,
    isMember: true,
    isAdmin: false,
    isNotificationsOn: true,
    posts: [
        {
            id: '1',
            author: {
                id: 'user1',
                name: 'Иван Петров',
                avatar: '/user1.jpg'
            },
            date: '2 часа назад',
            text: 'Только что вернулся из удивительной поездки в Грузию! Рекомендую посетить Сванетию - невероятные горные пейзажи!',
            media: ['/post1-1.jpg', '/post1-2.jpg'],
            likes: 245,
            comments: 32,
            shares: 12,
            isLiked: false
        },
        {
            id: '2',
            author: {
                id: 'user2',
                name: 'Мария Сидорова',
                avatar: '/user2.jpg'
            },
            date: '5 дней назад',
            text: 'Подборка лучших хостелов Европы для бюджетных путешественников:',
            media: [],
            likes: 189,
            comments: 24,
            shares: 8,
            isLiked: true
        }
    ],
    admins: [
        {id: 'admin1', name: 'Алексей Иванов', avatar: '/admin1.jpg'},
        {id: 'admin2', name: 'Елена Смирнова', avatar: '/admin2.jpg'}
    ]
}

export default function GroupPage() {
    return (
        <div className="max-w-4xl mx-auto bg-gray-900 text-white">
            {/* Обложка группы */}
            <div className="relative h-64 w-full bg-gray-800">
                {mockGroup.cover ? (
                    <img
                        src={mockGroup.cover}
                        alt="Обложка группы"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <MdOutlinePhotoLibrary className="text-5xl"/>
                    </div>
                )}
            </div>

            {/* Шапка группы */}
            <div className="relative px-4">
                <div className="flex flex-col md:flex-row gap-4 -mt-16">
                    {/* Аватар */}
                    <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
                        {mockGroup.avatar ? (
                            <img
                                src={mockGroup.avatar}
                                alt={mockGroup.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <FaUsers className="text-4xl"/>
                            </div>
                        )}
                    </div>

                    {/* Информация о группе */}
                    <div className="flex-1 pt-4">
                        <h1 className="text-2xl font-bold">{mockGroup.name}</h1>
                        <p className="text-gray-300 mt-1">{mockGroup.description}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {mockGroup.tags.map(tag => (
                                <span key={tag} className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                  #{tag}
                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FaUsers/> {mockGroup.membersCount.toLocaleString()} участников
              </span>
                        </div>
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex gap-2 pt-4 md:pt-0 md:items-start">
                        {mockGroup.isMember ? (
                            <>
                                <button
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
                                    <FiMessageSquare/> Написать
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
                                    {mockGroup.isNotificationsOn ? <FaBell/> : <FaRegBell/>}
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
                                    <FiShare2/>
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-lime-500 hover:bg-lime-400 text-black font-medium px-6 py-2 rounded-lg">
                                Вступить
                            </button>
                        )}
                        <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg">
                            <FaEllipsisH/>
                        </button>
                    </div>
                </div>

                {/* Меню группы */}
                <nav className="flex overflow-x-auto mt-6 border-b border-gray-800">
                    {['Записи', 'Участники', 'Фото', 'Видео', 'Файлы', 'Администрация'].map(item => (
                        <button
                            key={item}
                            className={`px-4 py-3 whitespace-nowrap ${item === 'Записи' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Основное содержимое */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
                {/* Левая колонка */}
                <div className="md:col-span-1 space-y-4">
                    {/* Блок администрации */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-3">Администрация</h3>
                        <div className="space-y-3">
                            {mockGroup.admins.map(admin => (
                                <div key={admin.id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                        {admin.avatar ? (
                                            <img src={admin.avatar} alt={admin.name}
                                                 className="w-full h-full object-cover"/>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">

                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm">{admin.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Блок информации */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-3">Информация</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FaUsers className="flex-shrink-0"/>
                                <span>{mockGroup.membersCount.toLocaleString()} участников</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mockGroup.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    #{tag}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Правая колонка (посты) */}
                <div className="md:col-span-3 space-y-4">
                    {/* Создание поста */}
                    {mockGroup.isMember && (
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">

                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Напишите что-нибудь..."
                                    className="flex-1 bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                                />
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
                                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                                    <MdOutlinePhotoLibrary/> Фото
                                </button>
                                <button className="text-sm bg-lime-500 hover:bg-lime-400 text-black px-4 py-1 rounded">
                                    Опубликовать
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Посты */}
                    {mockGroup.posts.map(post => (
                        <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden">
                            {/* Шапка поста */}
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                        {post.author.avatar ? (
                                            <img src={post.author.avatar} alt={post.author.name}
                                                 className="w-full h-full object-cover"/>
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center text-gray-500">
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">{post.author.name}</div>
                                        <div className="text-xs text-gray-400">{post.date}</div>
                                    </div>
                                </div>
                                <p className="mt-3">{post.text}</p>
                            </div>

                            {/* Медиа поста */}
                            {post.media.length > 0 && (
                                <div className="bg-gray-700">
                                    <img
                                        src={post.media[0]}
                                        alt="Медиа в посте"
                                        className="w-full max-h-96 object-cover"
                                    />
                                </div>
                            )}

                            {/* Действия с постом */}
                            <div className="p-3 border-t border-gray-700">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>{post.likes} отметок Нравится</span>
                                    <div className="flex gap-3">
                                        <span>{post.comments} комментариев</span>
                                        <span>{post.shares} репостов</span>
                                    </div>
                                </div>
                                <div className="flex border-t border-gray-700 mt-2 pt-2">
                                    <button
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 ${post.isLiked ? 'text-lime-400' : 'hover:bg-gray-700'}`}>
                                        <span>Нравится</span>
                                    </button>
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-700">
                                        <FiMessageSquare/> Комментировать
                                    </button>
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-700">
                                        <FiShare2/> Поделиться
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}