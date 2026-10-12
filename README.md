# Мой вишлист

Статический сайт-вишлист на [Astro](https://astro.build), деплоится на GitHub Pages.
Каждый подарок — отдельная страница с ценой, категорией и ссылкой на магазин.
Список фильтруется и сортируется, а гости могут **забронировать** подарок в один
клик — статус «занято» тут же видят остальные.

## Локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## Деплой на GitHub Pages

1. **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Secrets and variables → Actions → New repository secret** — добавить:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
3. Запушить в `master` — workflow `.github/workflows/deploy.yml` соберёт и опубликует.
   Сайт будет на `https://<username>.github.io/wishlist`.

Адрес сайта берётся из имени репозитория: `owner/wishlist` → `https://owner.github.io/wishlist`,
`owner/owner.github.io` → `https://owner.github.io`. Для своего домена задайте в
**Settings → Secrets and variables → Actions → Variables** `SITE` (напр. `https://wish.example.com`)
и `BASE_PATH` (`/`).

## Настройки — `wishlist.config.json`

```json
{
  "schemaVersion": 1,
  "title": "Мой вишлист",
  "defaultCurrency": "RUB"
}
```

- `title` — заголовок главной страницы.
- `defaultCurrency` — валюта карточки, если `currency` не указан.
- `schemaVersion` — версия формата карточек. По ней Wishlist Editor понимает, что умеет
  редактировать этот репозиторий. Не меняйте вручную.

## Аналитика (Яндекс.Метрика)

Опционально. Создайте счётчик на [metrika.yandex.ru](https://metrika.yandex.ru), возьмите
его номер и задайте переменную `PUBLIC_YM_ID`:

- локально — в `.env`;
- для деплоя — **Settings → Secrets and variables → Actions → Variables** →
  `PUBLIC_YM_ID` (это не секрет — номер счётчика и так виден в коде страницы).

Без переменной счётчик просто не подключается (в разметке его нет).

## Добавить подарок

**Проще всего — интерактивно:**

```bash
npm run new
```

**Или вручную** — создать файл `src/content/items/<slug>.md`:

```markdown
---
title: Название подарка
type: вещь # вещь | впечатление | навык | услуга | другое (фильтр)
category: Электроника # свободный тег внутри типа, необязательно
price: 4990 # необязательно (для свободного подарка можно опустить)
currency: RUB # RUB | USD | EUR | … — приводится к евро на сайте
priority: 2 # 1 (очень хочу) … 5 — метр «хочу» + сортировка
deadline: 2026-08-12 # необязательно — желательный срок (напр. ко дню рождения)
url: https://… # ссылка на покупку (у свободного подарка её нет)
links: # доп. ссылки: референсы, альтернативы, обзоры
  - label: Альтернатива — другая модель
    url: https://…
image: https://… # URL картинки ИЛИ локальный файл рядом
images: # ИЛИ несколько фото (галерея с превью)
  - https://…
  - ./local.jpg
hidden: false # true — временно спрятать
description: Короткое описание для карточки.
---

Произвольный текст в теле — покажется на странице подарка (напр. альтернативы,
пожелания по цвету/размеру и т.п.).
```

**Свободный подарок** (без конкретной ссылки на покупку) — просто не указывайте `url`
и `price`, опишите желаемое в теле и дайте `links` с референсом. Пример —
`src/content/items/gravy-boat.md`.

## Управление бронями

Гость, забронировавший подарок, видит на нём кнопку **«Снять мою бронь»** (у остальных —
просто «Занято»). Это работает по токену: у гостя в браузере хранится случайный токен,
в БД лежит только его хэш, поэтому снять бронь может лишь тот, кто её поставил.

Я могу снять бронь вручную через SQL, если гость потерял токен. Для этого:

```sql
-- снять бронь
update public.reservations set reserved=false, reserved_at=null, token_hash=null where slug='<slug>';
-- посмотреть занятое
select slug, reserved_at from public.reservations where reserved order by reserved_at;
-- сбросить всё после праздника
update public.reservations set reserved=false, reserved_at=null, token_hash=null;
```
