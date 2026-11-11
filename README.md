# Post Scheduler API, ИПР2

REST API планировщика постов с CI/CD, мониторингом и логированием.

## Продакшен

- **Backend:** https://post-scheduler-server.onrender.com *(заменить после деплоя)*
- **Мониторинг uptime:** https://uptimerobot.com *(ссылка на статус-страницу после настройки)*
- **Дашборд ошибок:** https://sentry.io *(ссылка на проект после настройки)*
- **Telegram-бот уведомлений:** @post_scheduler_bot *(заменить)*

## Стек

- Node.js + Express.js
- PostgreSQL (Neon) + Sequelize
- JWT + bcryptjs
- Helmet, express-rate-limit, Joi
- Winston + Logtail (логи)
- Sentry (сбор ошибок)
- GitHub Actions (CI/CD)
- Render (хостинг бекенда)

## Переменные окружения

Скопировать `.env.example` → `.env` и заполнить:

```
DATABASE_URL     — строка подключения к Neon PostgreSQL
JWT_SECRET       — секрет для JWT
SENTRY_DSN       — DSN проекта на sentry.io
LOGTAIL_SOURCE_TOKEN — токен источника на betterstack.com/logs
```

## Запуск локально

```bash
npm install
cp .env.example .env   # заполнить
npx sequelize-cli db:migrate
npm run dev
```

Тестовые данные: `npx sequelize-cli db:seed:all`

## Эндпоинты мониторинга

| Метод | URL | Описание |
|---|---|---|
| GET | /health | Проверка доступности (200 OK) |
| GET | /metrics | Uptime, память, кол-во запросов |
| GET | /test-error | Генерирует тестовую ошибку для Sentry |

## Роли

| Роль | Права |
|---|---|
| `user` | регистрация, просмотр и создание постов |
| `moderator` | + редактирование |
| `admin` | + удаление |

## Эндпоинты API

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
- ограничение тела запроса до 10KB
- generic errors в продакшене (`NODE_ENV=production`)
- проверка сложности пароля (мин. 8 симв., цифра, спецсимвол)
- логи не содержат паролей/токенов
