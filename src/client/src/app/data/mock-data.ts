/**
 * mock-data.ts - Mock данные для прототипа платформы TalentBridge
 * 
 * Этот файл содержит интерфейсы TypeScript и тестовые данные для:
 * - Заданий (Tasks)
 * - Отправленных решений (Submissions)
 * - Кандидатов (Candidates)
 * - Рейтинга кандидатов (CandidatesRanking)
 * 
 * В реальном приложении эти данные будут приходить с сервера через API
 */

// ============================================================
// ИНТЕРФЕЙСЫ
// ============================================================

/**
 * Интерфейс задания
 * Описывает структуру тестового задания для кандидатов
 */
export interface Task {
  /** Уникальный идентификатор задания */
  id: string;
  /** Название задания */
  title: string;
  /** Название компании-работодателя */
  company: string;
  /** Дедлайн выполнения (YYYY-MM-DD) */
  deadline: string;
  /** Список требуемых технологий */
  technologies: string[];
  /** Описание проекта */
  description: string;
  /** Список требований к заданию */
  requirements: string[];
  /** Команда для запуска автотестов (опционально) */
  autoTestsConfig?: string;
}

/**
 * Интерфейс отправленного решения
 * Содержит информацию о решении кандидата и результатах проверки
 */
export interface Submission {
  /** Уникальный идентификатор отправки */
  id: string;
  /** ID связанного задания */
  taskId: string;
  /** Название задания (для удобства отображения) */
  taskTitle: string;
  /** Дата отправки решения */
  submittedDate: string;
  /** Ссылка на GitHub репозиторий */
  githubUrl: string;
  /** Статусы проверки на каждом этапе */
  status: {
    /** Статус автотестов */
    autoTests: 'pending' | 'passed' | 'failed';
    /** Статус AI-анализа */
    aiAnalysis: 'pending' | 'passed' | 'failed';
    /** Статус экспертной проверки */
    expertReview: 'pending' | 'approved' | 'rejected';
  };
  /** Результаты автотестов (опционально) */
  autoTestsResults?: {
    /** Количество пройденных тестов */
    passed: number;
    /** Общее количество тестов */
    total: number;
    /** Список отдельных тестов */
    tests: { name: string; passed: boolean }[];
  };
  /** Результаты AI-анализа (опционально) */
  aiAnalysisResults?: {
    /** Список найденных проблем */
    issues: { category: string; description: string }[];
  };
  /** Результаты экспертной проверки (опционально) */
  expertReviewResults?: {
    /** Комментарий эксперта */
    comment: string;
    /** Решение эксперта */
    approved: boolean;
  };
}

/**
 * Интерфейс кандидата
 * Описывает профиль пользователя-кандидата
 */
export interface Candidate {
  /** Уникальный идентификатор кандидата */
  id: string;
  /** Имя кандидата */
  name: string;
  /** Email кандидата */
  email: string;
  /** Список навыков */
  skills: string[];
  /** Список выполненных заданий (названия) */
  completedTasks: string[];
  /** Список отправленных решений */
  submissions: Submission[];
}

/**
 * Интерфейс кандидата в рейтинге
 * Расширенная версия профиля для страницы рейтинга
 */
export interface CandidateRanking {
  /** Уникальный идентификатор */
  id: string;
  /** Имя кандидата */
  name: string;
  /** Email кандидата */
  email: string;
  /** Город проживания */
  city: string;
  /** Описание о себе */
  about: string;
  /** Навыки с уровнем владения */
  skills: { name: string; level: string }[];
  /** Количество выполненных заданий */
  completedTasksCount: number;
  /** Процент успешно выполненных заданий */
  successRate: number;
  /** Рейтинг на платформе (0-5) */
  rating: number;
  /** Дата последней активности */
  lastActive: string;
  /** Список выполненных заданий (названия) */
  completedTasks: string[];
  /** Список отправленных решений */
  submissions: Submission[];
}

// ============================================================
// MOCK ДАННЫЕ
// ============================================================

/**
 * Список доступных заданий для кандидатов
 * Кандидаты могут просматривать и брать эти задания в работу
 */
export const availableTasks: Task[] = [
  {
    id: '1',
    title: 'REST API для системы управления задачами',
    company: 'TechCorp',
    deadline: '2026-03-15',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    description: 'Разработать REST API для управления задачами с аутентификацией пользователей, CRUD операциями и фильтрацией.',
    requirements: [
      'Реализовать JWT аутентификацию',
      'CRUD операции для задач',
      'Фильтрация по статусу и дате',
      'Покрытие тестами >80%',
      'Docker compose для запуска'
    ],
    autoTestsConfig: 'npm test'
  },
  {
    id: '2',
    title: 'Dashboard с аналитикой продаж',
    company: 'DataFlow Inc',
    deadline: '2026-03-20',
    technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind'],
    description: 'Создать интерактивный dashboard для визуализации данных продаж с графиками и фильтрами.',
    requirements: [
      'Responsive дизайн',
      'Интерактивные графики',
      'Фильтры по периоду и категориям',
      'TypeScript с строгой типизацией',
      'Оптимизация производительности'
    ],
    autoTestsConfig: 'npm run test:e2e'
  },
  {
    id: '3',
    title: 'Микросервис обработки платежей',
    company: 'FinanceHub',
    deadline: '2026-03-25',
    technologies: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'],
    description: 'Создать микросервис для обработки платежных транзакций с очередью задач.',
    requirements: [
      'Асинхронная обработка',
      'Идемпотентность запросов',
      'Rate limiting',
      'Логирование всех операций',
      'Unit и интеграционные тесты'
    ],
    autoTestsConfig: 'pytest'
  }
];

/**
 * ID заданий, которые взяты в работу кандидатом
 * Имитация состояния "в процессе выполнения"
 */
export const tasksInProgress: string[] = ['2'];

/**
 * Отправленные решения кандидата
 * Содержат полную информацию о прохождении всех этапов проверки
 */
export const candidateSubmissions: Submission[] = [
  {
    id: 's1',
    taskId: '1',
    taskTitle: 'REST API для системы управления задачами',
    submittedDate: '2026-02-20',
    githubUrl: 'https://github.com/candidate/task-api',
    status: {
      autoTests: 'passed',
      aiAnalysis: 'passed',
      expertReview: 'pending'
    },
    autoTestsResults: {
      passed: 45,
      total: 50,
      tests: [
        { name: 'Authentication tests', passed: true },
        { name: 'CRUD operations', passed: true },
        { name: 'Filtering logic', passed: true },
        { name: 'Error handling', passed: true },
        { name: 'Edge cases', passed: false }
      ]
    },
    aiAnalysisResults: {
      issues: [
        { category: 'Code Quality', description: 'Обнаружены дублирующиеся фрагменты кода в controllers/' },
        { category: 'Security', description: 'Рекомендуется добавить rate limiting для API endpoints' },
        { category: 'Performance', description: 'N+1 запросы в методе getTasks, используйте JOIN' }
      ]
    }
  },
  {
    id: 's2',
    taskId: '2',
    taskTitle: 'Dashboard с аналитикой продаж',
    submittedDate: '2026-02-22',
    githubUrl: 'https://github.com/candidate/sales-dashboard',
    status: {
      autoTests: 'passed',
      aiAnalysis: 'failed',
      expertReview: 'pending'
    },
    autoTestsResults: {
      passed: 38,
      total: 40,
      tests: [
        { name: 'Component rendering', passed: true },
        { name: 'Data filtering', passed: true },
        { name: 'Chart interactions', passed: true },
        { name: 'Responsive design', passed: false },
        { name: 'TypeScript types', passed: true }
      ]
    },
    aiAnalysisResults: {
      issues: [
        { category: 'Architecture', description: 'Компоненты слишком связаны, нарушен принцип единственной ответственности' },
        { category: 'Performance', description: 'Отсутствует memoization для тяжелых вычислений в графиках' },
        { category: 'Type Safety', description: 'Использование any в 12 местах, необходимо типизировать' },
        { category: 'Accessibility', description: 'Отсутствуют ARIA атрибуты для интерактивных элементов' }
      ]
    }
  }
];

/**
 * Задания работодателя с дополнительной информацией
 * Содержат количество отправленных решений и статус активности
 */
export const employerTasks: (Task & { submissionsCount: number; active: boolean })[] = [
  {
    ...availableTasks[0],
    submissionsCount: 23,
    active: true
  },
  {
    ...availableTasks[1],
    submissionsCount: 15,
    active: true
  },
  {
    id: '4',
    title: 'Telegram бот для HR автоматизации',
    company: 'TechCorp',
    deadline: '2026-02-28',
    technologies: ['Python', 'aiogram', 'SQLite'],
    description: 'Бот для автоматизации HR процессов',
    requirements: ['Команды для заявок', 'База данных кандидатов'],
    submissionsCount: 8,
    active: false
  }
];

/**
 * Кандидаты, отправившие решения на задания работодателя
 * Используется для отображения таблицы кандидатов в панели работодателя
 */
export const employerCandidates: {
  id: string;
  name: string;
  taskId: string;
  taskTitle: string;
  submittedDate: string;
  submissionId: string;
  currentStage: 'autoTests' | 'aiAnalysis' | 'expertReview';
  stageStatus: 'pending' | 'passed' | 'failed' | 'approved' | 'rejected';
}[] = [
  {
    id: 'c1',
    name: 'Алексей Иванов',
    taskId: '1',
    taskTitle: 'REST API для системы управления задачами',
    submittedDate: '2026-02-20',
    submissionId: 's1',
    currentStage: 'expertReview',
    stageStatus: 'pending'
  },
  {
    id: 'c2',
    name: 'Мария Петрова',
    taskId: '1',
    taskTitle: 'REST API для системы управления задачами',
    submittedDate: '2026-02-21',
    submissionId: 's3',
    currentStage: 'expertReview',
    stageStatus: 'pending'
  },
  {
    id: 'c3',
    name: 'Дмитрий Сидоров',
    taskId: '2',
    taskTitle: 'Dashboard с аналитикой продаж',
    submittedDate: '2026-02-22',
    submissionId: 's2',
    currentStage: 'autoTests',
    stageStatus: 'failed'
  },
  {
    id: 'c4',
    name: 'Анна Козлова',
    taskId: '2',
    taskTitle: 'Dashboard с аналитикой продаж',
    submittedDate: '2026-02-23',
    submissionId: 's4',
    currentStage: 'expertReview',
    stageStatus: 'approved'
  }
];

/**
 * Дополнительные отправленные решения для тестирования
 * Расширяет список candidateSubmissions
 */
export const allSubmissions: Submission[] = [
  ...candidateSubmissions,
  {
    id: 's3',
    taskId: '1',
    taskTitle: 'REST API для системы управления задачами',
    submittedDate: '2026-02-21',
    githubUrl: 'https://github.com/maria/task-api',
    status: {
      autoTests: 'passed',
      aiAnalysis: 'passed',
      expertReview: 'pending'
    },
    autoTestsResults: {
      passed: 48,
      total: 50,
      tests: [
        { name: 'Authentication tests', passed: true },
        { name: 'CRUD operations', passed: true },
        { name: 'Filtering logic', passed: true },
        { name: 'Error handling', passed: true },
        { name: 'Edge cases', passed: true }
      ]
    },
    aiAnalysisResults: {
      issues: [
        { category: 'Code Quality', description: 'Отличная структура проекта, код хорошо организован' },
        { category: 'Performance', description: 'Эффективное использование индексов БД' },
        { category: 'Best Practices', description: 'Следование принципам SOLID' }
      ]
    }
  },
  {
    id: 's4',
    taskId: '2',
    taskTitle: 'Dashboard с аналитикой продаж',
    submittedDate: '2026-02-23',
    githubUrl: 'https://github.com/anna/sales-dashboard',
    status: {
      autoTests: 'passed',
      aiAnalysis: 'passed',
      expertReview: 'approved'
    },
    autoTestsResults: {
      passed: 40,
      total: 40,
      tests: [
        { name: 'Component rendering', passed: true },
        { name: 'Data filtering', passed: true },
        { name: 'Chart interactions', passed: true },
        { name: 'Responsive design', passed: true },
        { name: 'TypeScript types', passed: true }
      ]
    },
    aiAnalysisResults: {
      issues: [
        { category: 'Code Quality', description: 'Отличная работа с компонентами, хорошее разделение логики' },
        { category: 'Performance', description: 'Грамотное использование React.memo и useMemo' }
      ]
    },
    expertReviewResults: {
      comment: 'Превосходная работа! Код чистый, архитектура продумана, UI/UX на высоком уровне. Все требования выполнены.',
      approved: true
    }
  }
];

/**
 * Публичный профиль кандидата
 * Используется для демонстрации при просмотре профиля работодателем
 */
export const candidateProfile: Candidate = {
  id: 'c1',
  name: 'Алексей Иванов',
  email: 'alexey.ivanov@email.com',
  skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'TypeScript'],
  completedTasks: [
    'REST API для системы управления задачами',
    'Telegram бот для HR автоматизации'
  ],
  submissions: candidateSubmissions
};

/**
 * Рейтинг кандидатов платформы
 * Содержит топ кандидатов с детальной информацией
 */
export const candidatesRanking: CandidateRanking[] = [
  {
    id: 'c1',
    name: 'Алексей Иванов',
    email: 'alexey.ivanov@email.com',
    city: 'Москва',
    about: 'Junior Backend разработчик с опытом работы на Node.js и Python. Успешно выполнил 3 проекта на платформе. Стремлюсь к развитию в области микросервисной архитектуры.',
    skills: [
      { name: 'Node.js', level: 'опытный' },
      { name: 'React', level: 'базовый' },
      { name: 'PostgreSQL', level: 'опытный' },
      { name: 'Docker', level: 'базовый' },
      { name: 'TypeScript', level: 'опытный' }
    ],
    completedTasksCount: 3,
    successRate: 100,
    rating: 4.8,
    lastActive: '2026-02-25',
    completedTasks: [
      'REST API для системы управления задачами',
      'Telegram бот для HR автоматизации',
      'Микросервис обработки платежей'
    ],
    submissions: [candidateSubmissions[0]]
  },
  {
    id: 'c2',
    name: 'Мария Петрова',
    email: 'maria.petrova@email.com',
    city: 'Санкт-Петербург',
    about: 'Frontend разработчик, специализируюсь на React и Vue.js. Люблю создавать красивые и удобные интерфейсы. Выполнила 2 проекта с отличными отзывами.',
    skills: [
      { name: 'React', level: 'опытный' },
      { name: 'Vue.js', level: 'опытный' },
      { name: 'TypeScript', level: 'базовый' },
      { name: 'CSS/SASS', level: 'опытный' },
      { name: 'Figma', level: 'базовый' }
    ],
    completedTasksCount: 2,
    successRate: 100,
    rating: 4.9,
    lastActive: '2026-02-26',
    completedTasks: [
      'Dashboard с аналитикой продаж',
      'Landing page для стартапа'
    ],
    submissions: []
  },
  {
    id: 'c3',
    name: 'Дмитрий Сидоров',
    email: 'dmitry.sidorov@email.com',
    city: 'Новосибирск',
    about: 'Full-stack разработчик, работаю с современным стеком технологий. Интересуюсь DevOps практиками и автоматизацией. Выполнил 2 проекта.',
    skills: [
      { name: 'Python', level: 'опытный' },
      { name: 'Django', level: 'базовый' },
      { name: 'React', level: 'базовый' },
      { name: 'PostgreSQL', level: 'опытный' },
      { name: 'Redis', level: 'начинающий' }
    ],
    completedTasksCount: 2,
    successRate: 66,
    rating: 4.2,
    lastActive: '2026-02-24',
    completedTasks: [
      'REST API для системы управления задачами',
      'Интеграция с внешним API'
    ],
    submissions: []
  },
  {
    id: 'c4',
    name: 'Анна Козлова',
    email: 'anna.kozlova@email.com',
    city: 'Казань',
    about: 'Junior Frontend разработчик. Недавно начала работать с React, активно учусь и развиваюсь. Выполнила первый проект с положительной оценкой.',
    skills: [
      { name: 'JavaScript', level: 'базовый' },
      { name: 'React', level: 'начинающий' },
      { name: 'HTML/CSS', level: 'опытный' },
      { name: 'Git', level: 'базовый' }
    ],
    completedTasksCount: 1,
    successRate: 100,
    rating: 4.5,
    lastActive: '2026-02-23',
    completedTasks: [
      'Dashboard с аналитикой продаж'
    ],
    submissions: []
  },
  {
    id: 'c5',
    name: 'Игорь Смирнов',
    email: 'igor.smirnov@email.com',
    city: 'Екатеринбург',
    about: 'Backend разработчик, специализируюсь на Python и FastAPI. Интересуюсь машинным обучением. Выполнил 4 проекта на платформе.',
    skills: [
      { name: 'Python', level: 'опытный' },
      { name: 'FastAPI', level: 'опытный' },
      { name: 'PostgreSQL', level: 'базовый' },
      { name: 'Redis', level: 'базовый' },
      { name: 'Docker', level: 'опытный' }
    ],
    completedTasksCount: 4,
    successRate: 80,
    rating: 4.6,
    lastActive: '2026-02-26',
    completedTasks: [
      'Микросервис обработки платежей',
      'REST API для системы управления задачами',
      'Telegram бот для HR автоматизации',
      'Сервис аналитики данных'
    ],
    submissions: []
  }
];

/**
 * Список доступных технологий для выбора при создании задания
 */
export const AVAILABLE_TECHS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go',
  'React', 'Vue', 'Angular', 'Node.js', 'Express',
  'Django', 'FastAPI', 'Spring Boot',
  'PostgreSQL', 'MongoDB', 'Redis', 'MySQL',
  'Docker', 'Kubernetes', 'AWS', 'Git'
];
