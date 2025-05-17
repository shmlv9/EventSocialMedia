## Требуемые эндпоинты для Backend API

### 1. **Аутентификация и управление аккаунтом**
- `POST /auth/login` — Авторизация (логин, пароль)
- `POST /auth/register` — Регистрация (логин, номер телефона, фамилия, имя, город, возраст, теги, пароль)
- `PUT /profile` — Редактирование профиля (номер телефона, фамилия, имя, город, возраст, теги)
- `POST /profile/avatar` — Установка аватара
- `DELETE /profile` — Удаление аккаунта

---

### 2. **Мероприятия**
#### 2.1. Получение мероприятий
- `GET /events/recommended` — Получить мероприятия по рекомендациям (по тегам пользователя)
- `GET /events/friends` — Получить мероприятия от друзей
- `GET /events/groups` — Получить мероприятия от групп
- `GET /events/search` — Поиск мероприятий

#### 2.2. Управление мероприятиями (от своего лица)
- `POST /events` — Создать мероприятие
- `PUT /events/{eventId}` — Редактировать мероприятие
- `DELETE /events/{eventId}` — Удалить мероприятие

#### 2.3. Управление мероприятиями (от лица группы)
- `POST /groups/{groupId}/events` — Создать мероприятие от имени группы
- `PUT /groups/{groupId}/events/{eventId}` — Редактировать мероприятие от имени группы
- `DELETE /groups/{groupId}/events/{eventId}` — Удалить мероприятие от имени группы

#### 2.4. Прочее
- `GET /events/attending` — Получить мероприятия, на которые идёт пользователь

---

### 3. **Чаты**
- `GET /chats` — Получить список чатов пользователя
- `GET /chats/search` — Поиск чатов пользователя
- `POST /chats` — Создать чат
- `DELETE /chats/{chatId}` — Удалить чат
- `POST /chats/{chatId}/messages` — Отправить сообщение
- `GET /chats/{chatId}/messages` — Получить сообщения

---

### 4. **Друзья**
- `GET /friends` — Просмотр списка друзей
- `POST /friends/requests` — Отправить заявку в друзья
- `DELETE /friends/requests/{requestId}` — Отозвать заявку в друзья
- `GET /friends/requests` — Просмотр входящих заявок
- `POST /friends/requests/{requestId}/accept` — Принять заявку в друзья
- `POST /friends/requests/{requestId}/decline` — Отклонить заявку в друзья
- `DELETE /friends/{friendId}` — Удалить друга
- `GET /users/search` — Поиск пользователей
- `GET /users/{userId}` — Просмотр профиля пользователя

---

### 5. **Группы**
- `GET /groups/search` — Поиск групп
- `GET /groups/{groupId}` — Просмотр страницы группы
- `POST /groups/{groupId}/join` — Вступить в группу
- `POST /groups/{groupId}/leave` — Выйти из группы
- `GET /groups` — Просмотр своих групп

#### 5.1. Управляемые группы
- `POST /groups` — Создать управляемую группу (название, описание, тематика)
- `PUT /groups/{groupId}` — Редактировать управляемую группу
- `GET /groups/managed` — Просмотр управляемых групп
- `DELETE /groups/{groupId}` — Удалить управляемую группу

---

