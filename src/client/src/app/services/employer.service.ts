/**
 * EmployerService - Сервис для работы с работодателями
 * 
 * Управляет данными работодателей и их задачами.
 * Работает с FastAPI endpoints для CRUD операций.
 * 
 * Endpoints:
 * - GET /employers - список работодателей
 * - GET /employers/:id - профиль работодателя
 * - GET /employers/me - профиль текущего работодателя
 * - PUT /employers/me - обновление профиля
 * - GET /employers/me/stats - статистика
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Task } from './task.service';
import { Submission } from './submission.service';

/**
 * Интерфейс работодателя
 */
export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  description?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Профиль работодателя с дополнительной информацией
 */
export interface EmployerProfile extends Employer {
  tasks_count: number;
  active_tasks_count: number;
  total_submissions: number;
  pending_reviews: number;
}

/**
 * Запрос на обновление профиля работодателя
 */
export interface UpdateEmployerRequest {
  company_name?: string;
  description?: string;
  website?: string;
}

/**
 * Статистика работодателя
 */
export interface EmployerStats {
  /** Общее количество заданий */
  total_tasks: number;
  /** Активных заданий */
  active_tasks: number;
  /** Завершенных заданий */
  completed_tasks: number;
  /** Общее количество отправленных решений */
  total_submissions: number;
  /** Ожидают экспертной проверки */
  pending_reviews: number;
  /** Одобрено решений */
  approved_submissions: number;
  /** Отклонено решений */
  rejected_submissions: number;
  /** Количество найденных кандидатов */
  hired_candidates: number;
}

/**
 * Дашборд работодателя (агрегированные данные)
 */
export interface EmployerDashboard {
  employer: EmployerProfile;
  stats: EmployerStats;
  recent_tasks: Task[];
  recent_submissions: Submission[];
  top_candidates: {
    id: string;
    name: string;
    rating: number;
    submissions_count: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployerService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ============================================================
  // ПРОФИЛЬ
  // ============================================================

  /**
   * Получение профиля работодателя
   * @param employerId - ID работодателя
   * @returns Observable с профилем
   */
  getEmployerProfile(employerId: string): Observable<Employer> {
    return this.get<Employer>(`employers/${employerId}`);
  }

  /**
   * Получение своего профиля
   * @returns Observable с профилем
   */
  getMyProfile(): Observable<EmployerProfile> {
    return this.get<EmployerProfile>('employers/me');
  }

  /**
   * Обновление своего профиля
   * @param data - данные для обновления
   * @returns Observable с обновленным профилем
   */
  updateMyProfile(data: UpdateEmployerRequest): Observable<EmployerProfile> {
    return this.put<EmployerProfile>('employers/me', data);
  }

  // ============================================================
  // ДАШБОРД И СТАТИСТИКА
  // ============================================================

  /**
   * Получение данных дашборда
   * @returns Observable с данными дашборда
   */
  getDashboard(): Observable<EmployerDashboard> {
    return this.get<EmployerDashboard>('employers/me/dashboard');
  }

  /**
   * Получение статистики
   * @returns Observable со статистикой
   */
  getStats(): Observable<EmployerStats> {
    return this.get<EmployerStats>('employers/me/stats');
  }

  // ============================================================
  // ЗАДАНИЯ И РЕШЕНИЯ
  // ============================================================

  /**
   * Получение заданий работодателя
   * @param active - фильтр по активности
   * @returns Observable со списком заданий
   */
  getMyTasks(active?: boolean): Observable<Task[]> {
    const params = active !== undefined ? { active } : {};
    return this.get<Task[]>('employers/me/tasks', params);
  }

  /**
   * Получение решений по заданиям работодателя
   * @param status - фильтр по статусу
   * @returns Observable со списком решений
   */
  getSubmissions(status?: string): Observable<Submission[]> {
    const params = status ? { status } : {};
    return this.get<Submission[]>('employers/me/submissions', params);
  }

  /**
   * Получение решений, ожидающих проверки
   * @returns Observable со списком
   */
  getPendingReviews(): Observable<Submission[]> {
    return this.get<Submission[]>('employers/me/pending-reviews');
  }

  // ============================================================
  // КАНДИДАТЫ
  // ============================================================

  /**
   * Получение кандидатов, работавших с заданиями работодателя
   * @returns Observable со списком кандидатов
   */
  getMyCandidates(): Observable<{
    id: string;
    name: string;
    email: string;
    submissions_count: number;
    approved_count: number;
    rating: number;
  }[]> {
    return this.get('employers/me/candidates');
  }

  /**
   * Связаться с кандидатом (отправить email)
   * @param candidateId - ID кандидата
   * @param message - сообщение
   * @returns Observable с результатом
   */
  contactCandidate(candidateId: string, message: { subject: string; body: string }): Observable<{ sent: boolean }> {
    return this.post<{ sent: boolean }>(`employers/me/contact-candidate/${candidateId}`, message);
  }
}
