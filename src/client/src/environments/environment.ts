/**
 * Environment Configuration - Development
 * 
 * Конфигурация окружения для разработки.
 * В режиме разработки API доступен по localhost.
 * 
 * Для контейнеризации:
 * - В Docker контейнере фронтенда используется переменная окружения
 *   или маппинг к имени сервиса бэкенда
 */

export const environment = {
  /** Флаг режима продакшена */
  production: false,
  
  /** 
   * Базовый URL API
   * 
   * Варианты использования:
   * 1. Локальная разработка: 'http://localhost:8000'
   * 2. Docker Compose: 'http://backend:8000' (имя сервиса)
   * 3. Kubernetes: 'http://talentbridge-api:8000'
   * 4. Через переменную окружения: process.env['API_URL'] || 'http://localhost:8000'
   */
  apiUrl: 'http://localhost:8000',
  
  /** Версия API */
  apiVersion: '/api/v1',
  
  /** Таймаут запросов в миллисекундах */
  requestTimeout: 30000,
  
  /** Настройки аутентификации */
  auth: {
    /** Ключ для хранения токена в localStorage */
    tokenKey: 'talentbridge_token',
    /** Ключ для хранения роли пользователя */
    roleKey: 'talentbridge_role',
    /** Ключ для хранения ID пользователя */
    userIdKey: 'talentbridge_user_id'
  }
};
