# TalentBridge Platform Prototype (Angular)

Angular-версия прототипа платформы для оценки навыков разработчиков через реальные проектные задания.

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm start
```

Откройте http://localhost:4200 в браузере.

## Описание

Платформа TalentBridge соединяет начинающих разработчиков (джунов) с работодателями:

- **Кандидаты** находят реальные задания от компаний, выполняют их и получают обратную связь
- **Работодатели** создают задания, проверяют решения и находят талантливых кандидатов

## Структура проекта

```
src/app/
├── components/          # Общие компоненты
│   ├── navbar.component.ts
│   ├── footer.component.ts
│   ├── tech-chip.component.ts
│   ├── status-badge.component.ts
│   └── review-progress.component.ts
├── pages/              # Страницы приложения
│   ├── landing.component.ts
│   ├── junior-auth.component.ts
│   ├── employer-auth.component.ts
│   ├── candidate-dashboard.component.ts
│   ├── task-detail.component.ts
│   ├── submission-results.component.ts
│   ├── employer-dashboard.component.ts
│   ├── create-task.component.ts
│   ├── edit-task.component.ts
│   ├── candidate-profile.component.ts
│   └── candidates-ranking.component.ts
├── data/
│   └── mock-data.ts    # Mock данные
├── app.module.ts       # Корневой модуль
└── app.component.ts    # Корневой компонент
```

## Маршруты

- `/` - Главная страница
- `/junior-auth` - Вход для кандидатов
- `/employer-auth` - Вход для работодателей
- `/candidate-dashboard` - Дашборд кандидата
- `/task/:id` - Детали задания
- `/submission/:id` - Результаты проверки
- `/employer-dashboard` - Дашборд работодателя
- `/create-task` - Создание задания
- `/edit-task/:id` - Редактирование задания
- `/candidate/:id` - Профиль кандидата
- `/candidates-ranking` - Рейтинг кандидатов

## Технологии

- Angular 17
- TypeScript
- Tailwind CSS
- RxJS

## Подробная документация

См. [description.md](./description.md) для детальной документации проекта.

## Скрипты

- `npm start` - Запуск dev-сервера
- `npm run build` - Сборка проекта
- `npm test` - Запуск тестов
