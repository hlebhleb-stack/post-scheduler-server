# Post Scheduler API — Документация

## Базовый URL

```
http://localhost:3000
```

## Аутентификация

Все защищённые маршруты требуют заголовок:

```
Authorization: Bearer <JWT-токен>
```

Токен получается через `POST /auth/login`.

---

## Эндпоинты аутентификации

### POST /auth/register

Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "mypassword",
  "role": "user"
}
```

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| email | string | да | Уникальный email |
| password | string | да | Мин. 6 символов |
| role | string | нет | user / admin (по умолчанию: user) |

**Ответы:**

`201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2026-10-26T12:00:00.000Z"
}
```

`400 Bad Request` — ошибка валидации
```json
{
  "errors": ["Пароль должен содержать минимум 6 символов"]
}
```

`409 Conflict` — email уже занят
```json
{
  "error": "Пользователь с таким email уже существует"
}
```

---

### POST /auth/login

Вход и получение JWT-токена.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

**Ответы:**

`200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

`401 Unauthorized` — неверные учётные данные
```json
{
  "error": "Неверный email или пароль"
}
```

---

### GET /auth/me

Информация о текущем пользователе. **Требует токен.**

**Ответы:**

`200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2026-10-26T12:00:00.000Z",
  "updatedAt": "2026-10-26T12:00:00.000Z"
}
```

`401 Unauthorized` — нет токена или токен недействителен

---

## Эндпоинты публикаций

### GET /posts

Список всех публикаций. **Публичный.**

**Query-параметры (фильтрация):**

| Параметр | Описание |
|---|---|
| platform | Фильтр по платформе (instagram, telegram, vk, twitter, facebook) |
| status | Фильтр по статусу (draft, scheduled, published) |

**Пример:** `GET /posts?platform=telegram&status=scheduled`

`200 OK`
```json
[
  {
    "id": 1,
    "content": "Текст поста",
    "platform": "telegram",
    "scheduledAt": "2026-10-30T12:00:00.000Z",
    "status": "scheduled",
    "priority": 2,
    "UserId": 1,
    "createdAt": "2026-10-26T12:00:00.000Z",
    "updatedAt": "2026-10-26T12:00:00.000Z"
  }
]
```

---

### GET /posts/:id

Одна публикация по ID. **Публичный.**

`200 OK` — публикация найдена

`404 Not Found`
```json
{
  "error": "Публикация с id=99 не найдена"
}
```

---

### POST /posts

Создать публикацию. **Требует токен (любая роль).**

**Тело запроса:**
```json
{
  "content": "Текст публикации",
  "platform": "telegram",
  "scheduledAt": "2026-10-30T12:00:00Z",
  "status": "draft",
  "priority": 2
}
```

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| content | string | да | Текст поста |
| platform | string | да | instagram / telegram / vk / twitter / facebook |
| scheduledAt | string (ISO 8601) | да | Дата публикации |
| status | string | нет | draft / scheduled / published (по умолчанию: draft) |
| priority | number | нет | 1 / 2 / 3 (по умолчанию: 2) |

`201 Created` — пост создан

`400 Bad Request` — ошибки валидации

`401 Unauthorized` — нет токена

---

### PUT /posts/:id

Обновить публикацию. **Требует токен. Доступно автору поста или админу.**

**Тело запроса** — любые поля из POST (минимум одно):
```json
{
  "content": "Обновлённый текст",
  "status": "published"
}
```

`200 OK` — пост обновлён

`403 Forbidden` — не автор и не админ
```json
{
  "error": "Редактировать публикацию может только её автор или админ"
}
```

`404 Not Found` — пост не найден

---

### DELETE /posts/:id

Удалить публикацию. **Требует роль admin.**

`204 No Content` — пост удалён

`403 Forbidden` — недостаточно прав

`404 Not Found` — пост не найден

---

## Коды ошибок

| Код | Описание |
|---|---|
| 400 | Ошибка валидации входных данных |
| 401 | Нет токена или токен недействителен |
| 403 | Недостаточно прав |
| 404 | Ресурс не найден |
| 409 | Конфликт (email уже занят) |
| 429 | Превышен лимит запросов |
| 500 | Внутренняя ошибка сервера |

---

## Меры безопасности

| Мера | Реализация |
|---|---|
| Хеширование паролей | bcryptjs, salt rounds = 10 |
| JWT | jsonwebtoken, срок жизни 1 час |
| Защита от SQL-инъекций | Sequelize ORM (параметризованные запросы) |
| XSS и заголовки | helmet |
| Rate limiting | express-rate-limit: 100 req / 15 min |
| Валидация | Joi: проверка типов, форматов, обязательных полей |
| Ограничение тела | express.json({ limit: '10kb' }) |
| Generic errors | NODE_ENV=production скрывает детали ошибок |
| Логирование | console.warn для неудачных входов, 403, rate limit |
