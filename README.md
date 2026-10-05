# Post Scheduler API — ИПР1

REST API планировщика постов. JWT-аутентификация, роли, Sequelize + PostgreSQL.

## Стек

- Node.js + Express.js
- PostgreSQL (Neon) + Sequelize
- JWT + bcryptjs
- Helmet, express-rate-limit, Joi

## Запуск

```bash
npm install
cp .env.example .env   # заполнить DATABASE_URL, JWT_SECRET
npx sequelize-cli db:migrate
npm run dev
```

Тестовые данные (опционально): `npx sequelize-cli db:seed:all`

## Роли

| Роль | Права |
|---|---|
| `user` | регистрация, просмотр и создание постов |
| `moderator` | + редактирование |
| `admin` | + удаление |

## Эндпоинты

### Аутентификация

| Метод | URL | Доступ |
|---|---|---|
| POST | /auth/register | публичный |
| POST | /auth/login | публичный |
| GET | /auth/me | токен |

### Посты

| Метод | URL | Доступ |
|---|---|---|
| GET | /posts | публичный |
| GET | /posts/:id | публичный |
| POST | /posts | user+ |
| PUT | /posts/:id | moderator+ |
| DELETE | /posts/:id | admin |

## Безопасность

- bcrypt для паролей, JWT для сессий
- валидация входных данных через Joi
- параметризованные запросы (Sequelize)
- Helmet + rate limit 100 req/15 min
- логирование неудачных входов и нарушений прав доступа
- ограничение тела запроса до 10KB
- generic errors в продакшене (`NODE_ENV=production`)
- проверка сложности пароля (мин. 8 симв., цифра, спецсимвол)
