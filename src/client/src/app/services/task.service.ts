/**
 * TaskService - Сервис для работы с заданиями
 * 
 * Управляет заданиями (tasks) для кандидатов.
 * Работает с FastAPI endpoints для CRUD операций.
 * 
 * Endpoints:
 * - GET /tasks - список заданий
 * - GET /tasks/:id - получение задания
 * - POST /tasks - создание задания (employer)
 * - PUT /tasks/:id - обновление задания (employer)
 * - DELETE /tasks/:id - удаление задания (employer)
 * - POST /tasks/:id/take - взять задание в работу (candidate)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';

/**
 * Интерфейс задания
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  company: string;
  company_id: string;
  deadline: string;
  technologies: string[];
  requirements: string[];
  auto_tests_config?: string;
  active: boolean;
  submissions_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Интерфейс создания задания
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
  deadline: string;
  technologies: string[];
  requirements: string[];
  auto_tests_config?: string;
}

/**
 * Интерфейс обновления задания
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  deadline?: string;
  technologies?: string[];
  requirements?: string[];
  auto_tests_config?: string;
  active?: boolean;
}

/**
 * Параметры фильтрации заданий
 */
export interface TaskFilterParams {
  /** Фильтр по технологиям */
  technologies?: string[];
  /** Фильтр по активности */
  active?: boolean;
  /** Поиск по названию */
  search?: string;
  /** Номер страницы */
  page?: number;
  /** Размер страницы */
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ============================================================
  // CRUD ОПЕРАЦИИ
  // ============================================================

  /**
   * Получение списка заданий с фильтрацией
   * @param params - параметры фильтрации
   * @returns Observable с пагинированным списком
   */
  getTasks(params?: TaskFilterParams): Observable<PaginatedResponse<Task>> {
    return this.get<PaginatedResponse<Task>>('tasks', params);
  }

  /**
   * Получение задания по ID
   * @param taskId - ID задания
   * @returns Observable с заданием
   */
  getTaskById(taskId: string): Observable<Task> {
    return this.get<Task>(`tasks/${taskId}`);
  }

  /**
   * Создание нового задания (только для работодателей)
   * @param data - данные задания
   * @returns Observable с созданным заданием
   */
  createTask(data: CreateTaskRequest): Observable<Task> {
    return this.post<Task>('tasks', data);
  }

  /**
   * Обновление задания (только для работодателей)
   * @param taskId - ID задания
   * @param data - данные для обновления
   * @returns Observable с обновленным заданием
   */
  updateTask(taskId: string, data: UpdateTaskRequest): Observable<Task> {
    return this.put<Task>(`tasks/${taskId}`, data);
  }

  /**
   * Удаление задания (только для работодателей)
   * @param taskId - ID задания
   * @returns Observable с результатом
   */
  deleteTask(taskId: string): Observable<void> {
    return this.delete<void>(`tasks/${taskId}`);
  }

  /**
   * Активация/деактивация задания
   * @param taskId - ID задания
   * @param active - новый статус
   * @returns Observable с обновленным заданием
   */
  setTaskActive(taskId: string, active: boolean): Observable<Task> {
    return this.patch<Task>(`tasks/${taskId}`, { active });
  }

  // ============================================================
  // ДЕЙСТВИЯ КАНДИДАТА
  // ============================================================

  /**
   * Взять задание в работу
   * @param taskId - ID задания
   * @returns Observable с результатом
   */
  takeTask(taskId: string): Observable<{ message: string; task_id: string }> {
    return this.post<{ message: string; task_id: string }>(`tasks/${taskId}/take`);
  }

  /**
   * Получение списка заданий кандидата (в работе)
   * @returns Observable со списком заданий
   */
  getMyTasks(): Observable<Task[]> {
    return this.get<Task[]>('candidates/me/tasks');
  }

  /**
   * Получение доступных заданий для кандидата
   * (исключая уже взятые в работу)
   * @returns Observable со списком заданий
   */
  getAvailableTasks(): Observable<Task[]> {
    return this.get<Task[]>('tasks/available');
  }

  // ============================================================
  // ДЕЙСТВИЯ РАБОТОДАТЕЛЯ
  // ============================================================

  /**
   * Получение заданий работодателя
   * @returns Observable со списком заданий
   */
  getEmployerTasks(): Observable<Task[]> {
    return this.get<Task[]>('employers/me/tasks');
  }

  /**
   * Загрузка файлов проекта
   * @param taskId - ID задания
   * @param files - файлы для загрузки
   * @returns Observable с результатом
   */
  uploadProjectFiles(taskId: string, files: FileList): Observable<{ uploaded: string[] }> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    // Для multipart/form-data не используем JSON Content-Type
    return this.http.post<{ uploaded: string[] }>(
      this.buildUrl(`tasks/${taskId}/files`),
      formData,
      { headers: { 'Authorization': `Bearer ${this.getAuthToken() || ''}` } }
    );
  }
}
