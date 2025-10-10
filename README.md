# Social Vue

Полноценный full-stack пример социальной сети: Vue 3 SPA на Vite и REST API на Express/Prisma. Проект демонстрирует авторизацию на JWT c ротацией refresh-токена, управление профилем, список пользователей с бесконечной прокруткой и заготовку для ленты постов.

## Ключевые возможности
- регистрация, вход по email или username, logout с отзывом refresh-токена;
- хранение refresh-токена в httpOnly-куке и автообновление access-токена в axios-интерцепторе;
- просмотр и редактирование собственного профиля, переключатель темы (light / dark);
- список пользователей с прокруткой (IntersectionObserver) и переключением режимов карточек;
- REST API для CRUD операций над постами (создание, лента, лайки);
- строгая валидация (Zod + vee-validate), управление состояниями через Pinia и TanStack Vue Query.

## Структура репозитория
```
backend/   – Express API, Prisma ORM, миграции, Docker-compose для PostgreSQL
frontend/  – Vite + Vue 3 SPA, Pinia, TanStack Query, Vee Validate
sn-api.http – коллекция запросов для VSCode REST Client / Thunder Client
```

## Стек технологий
**Frontend**: Vue 3, Vite, TypeScript, Pinia, TanStack Vue Query, Vee Validate + Zod, Axios, Playwright, Vitest.

**Backend**: Node.js 20, Express 4, Prisma 5, PostgreSQL, Argon2, JSON Web Token, Zod, Helmet, CORS, Rate limiting.

## Быстрый старт
### 1. Подготовка окружения
- Node.js >= 20 и npm
- Docker (для локальной PostgreSQL)
- pnpm/yarn не используются: проект собран под npm

### 2. Backend (`backend/`)
1. Установите зависимости
   ```bash
   cd backend
   npm install
   ```
2. Создайте файл `.env` (см. пример ниже)
3. Запустите PostgreSQL (вариант из репозитория)
   ```bash
   docker compose up -d
   ```
4. Примените миграции и сгенерируйте клиент
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```
5. Запустите сервер разработки
   ```bash
   npm run dev
   ```
   Сервер слушает `http://localhost:4000` и экспонирует REST под `/api/*`.

<details>
<summary>Пример backend/.env</summary>

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sn_db?schema=public"
JWT_ACCESS_SECRET="supersecret_access_key_at_least_32_chars"
JWT_REFRESH_SECRET="supersecret_refresh_key_at_least_32_chars"
ACCESS_TOKEN_TTL_MIN=15
REFRESH_TOKEN_TTL_DAYS=7
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```
</details>

### 3. Frontend (`frontend/`)
1. Установите зависимости
   ```bash
   cd frontend
   npm install
   ```
2. Запустите дев-сервер Vite
   ```bash
   npm run dev
   ```
   SPA доступна по адресу `http://localhost:5173`. При старте приложение пытается обновить access-токен и подтянуть профиль.

## Тесты и качество
**Frontend**
- `npm run test:unit` — Vitest (JSDOM)
- `npm run test:e2e` — Playwright (перед запуском установите браузеры: `npx playwright install`)
- `npm run type-check` — `vue-tsc --build`
- `npm run lint` — ESLint 9 + vite/vitest плагины
- `npm run format` — Prettier по `src/`

**Backend**
- На текущий момент отдельных тестов нет. Дополнительные проверки: `npm run build` (tsc) и `npm run dev` (tsx watch).

## REST API (основные эндпоинты)
Базовый URL: `http://localhost:4000/api`.

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| GET   | `/health` | проверка живости | не требуется |
| POST  | `/auth/register` | регистрация пользователя | нет |
| POST  | `/auth/login` | вход по email или username | нет |
| POST  | `/auth/refresh` | ротация refresh-токена (кука) | refresh-кука |
| POST  | `/auth/logout` | отзыв refresh-токена | refresh-кука |
| GET   | `/auth/me` | профиль по access-токену | Bearer |
| PATCH | `/users/me` | обновление displayName/bio/avatar | Bearer |
| GET   | `/users` | постраничный список пользователей (`limit`, `offset`) | Bearer |
| GET   | `/users/:username` | профиль по username | Bearer |
| POST  | `/posts` | создание поста | Bearer |
| GET   | `/posts` | публичная лента, с `likedByMe` для авторизованных | опционально |
| POST  | `/posts/:id/likes` | лайк поста (идемпотентно) | Bearer |
| DELETE| `/posts/:id/likes` | снять лайк | Bearer |

Для ручного тестирования используйте `sn-api.http` (VSCode REST Client). Файл содержит сценарий от регистрации до лайков и негативные кейсы.

## Архитектура и DX
- **Приложение**: monorepo без workspace — независимые `frontend/` и `backend/` директории.
- **Авторизация**: access-токен хранится в Pinia, refresh-токен — в httpOnly-куке на `/api/auth`. Axios-интерцептор перехватывает `401`, пытается вызвать `POST /auth/refresh`, затем повторяет запрос.
- **Состояния**: TanStack Vue Query управляет кешем (запросы `useMe`, `useUser`, `useUsersInfinityQuery`). Интерактивные мутации (`login`, `register`, `logout`) завязаны на Pinia store.
- **UI**: модульные компоненты профиля, карточек, форм. Темная тема включается переключателем в шапке и сохраняется в `localStorage`.
- **Backend**: Prisma описывает схему `User`, `Post`, `PostLike`, `RefreshToken`. Zod валидирует входящие данные, middleware `requireAuth` проверяет access-токен, `express-rate-limit` защищает auth-роуты от брутфорса.

## Полезные команды
| Где | Команда | Что делает |
|-----|---------|------------|
| backend | `npm run prisma:migrate` | применяет миграции (`prisma migrate dev`) |
| backend | `npm run prisma:generate` | генерирует Prisma Client |
| backend | `npm run build` | компиляция TypeScript в `dist/` |
| backend | `npm run start` | запуск сборки из `dist/` |
| frontend | `npm run dev -- --host` | делает дев-сервер доступным из локальной сети |
| frontend | `npm run preview` | предпросмотр собранного бандла |

## Советы по разработке
- После изменения Prisma-схемы запускайте `npm run prisma:migrate` и `npm run prisma:generate`.
- Если dev-старт фронтенда падает из-за CORS, убедитесь, что `CORS_ORIGIN` совпадает с адресом Vite.
- Дефолтная тема определяется системой (`prefers-color-scheme`), принудительно переключить можно кнопкой в шапке.
- При работе с API из сторонних клиентов не забудьте передавать или очищать `refreshToken` cookie: logout вручную выполняется `POST /api/auth/logout`.

---
Проект можно адаптировать под Heroku/Render/Vercel: вынесите секреты в переменные окружения и настроите CORS под домен фронтенда.
