# R22.Lab — лендинг интенсива по реверсивному инжинирингу

Одностраничный сайт на Next.js 14 (App Router) с анимированной 3D‑сценой на базе `@react-three/fiber`.

## Стек

- Next.js 14 + React 18
- Tailwind CSS для стилизации
- Framer Motion для анимаций
- Three.js / `@react-three/fiber` для интерактивной сцены

## Команды

```bash
npm install
npm run dev     # запуск в режиме разработки
npm run build   # production-сборка
npm run lint    # ESLint (Next.js core-web-vitals)
```

## Функциональность

- Герой-блок с 3D‑кубом, реагирующим на IntersectionObserver (паузит отрисовку вне вьюпорта).
- Диагностическая панель runtime-проверок (WebGL, IntersectionObserver, RAF и т.д.).
- Информация об аудитории, программе, наставниках.
- Форма записи с валидацией и моментальным откликом.
- FAQ с раскрывающимися блоками.
