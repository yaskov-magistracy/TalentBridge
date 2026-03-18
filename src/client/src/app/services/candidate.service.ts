/**
 * CandidateService - Сервис для работы с кандидатами
 * 
 * Управляет профилями кандидатов и их рейтингом.
 * Работает с FastAPI endpoints для получения информации о кандидатах.
 * 
 * Endpoints:
 * - GET /candidates - список кандидатов
 * - GET /candidates/:id - профиль кандидата
 * - GET /candidates/ranking - рейтинг кандидатов
 * - GET /candidates/:id/skills - навыки кандидата
 * - PUT /candidates/me/skills - обновление навыков
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { Submission } from './submission.service';

/**
 * Уровень навыка
 */
export type SkillLevel = 'beginner' | 'basic' | 'experienced';

/**
 * Интерфейс навыка
 */
export interface Skill {
  name: string;
  level: SkillLevel;
}

/**
 * Интерфейс кандидата в рейтинге
 */
export interface Candidate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  city: string;
  about: string;
  skills: Skill[];
  completed_tasks_count: number;
  success_rate: number;
  rating: number;
  last_active: string;
  created_at: string;
}

/**
 * Детальный профиль кандидата
 */
export interface CandidateProfile extends Candidate {
  submissions: Submission[];
  completed_tasks: string[];
}

/**
 * Параметры фильтрации кандидатов
 */
export interface CandidateFilterParams {
  /** Фильтр по навыкам */
  skills?: string[];
  /** Фильтр по городу */
  city?: string;
  /** Минимальный рейтинг */
  min_rating?: number;
  /** Минимальное количество выполненных заданий */
  min_tasks?: number;
  /** Поиск по имени */
  search?: string;
  /** Сортировка */
  sort_by?: 'rating' | 'tasks' | 'success_rate' | 'last_active';
  /** Порядок сортировки */
  sort_order?: 'asc' | 'desc';
  /** Номер страницы */
  page?: number;
  /** Размер страницы */
  size?: number;
}

/**
 * Запрос на обновление навыков
 */
export interface UpdateSkillsRequest {
  skills: Skill[];
}

/**
 * Запрос на обновление профиля
 */
export interface UpdateProfileRequest {
  full_name?: string;
  city?: string;
  about?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ============================================================
  // ПОЛУЧЕНИЕ СПИСКА И ПРОФИЛЕЙ
  // ============================================================

  /**
   * Получение списка кандидатов с фильтрацией
   * @param params - параметры фильтрации
   * @returns Observable с пагинированным списком
   */
  getCandidates(params?: CandidateFilterParams): Observable<PaginatedResponse<Candidate>> {
    return this.get<PaginatedResponse<Candidate>>('candidates', params);
  }

  /**
   * Получение профиля кандидата
   * @param candidateId - ID кандидата
   * @returns Observable с профилем
   */
  getCandidateProfile(candidateId: string): Observable<CandidateProfile> {
    return this.get<CandidateProfile>(`candidates/${candidateId}`);
  }

  /**
   * Получение рейтинга кандидатов
   * @param limit - количество записей (top-N)
   * @returns Observable со списком
   */
  getCandidatesRanking(limit: number = 100): Observable<Candidate[]> {
    return this.get<Candidate[]>('candidates/ranking', { limit, sort_by: 'rating' });
  }

  // ============================================================
  // НАВЫКИ
  // ============================================================

  /**
   * Получение навыков кандидата
   * @param candidateId - ID кандидата
   * @returns Observable со списком навыков
   */
  getCandidateSkills(candidateId: string): Observable<Skill[]> {
    return this.get<Skill[]>(`candidates/${candidateId}/skills`);
  }

  /**
   * Получение всех доступных навыков (для фильтров)
   * @returns Observable со списком
   */
  getAllSkills(): Observable<string[]> {
    return this.get<string[]>('skills');
  }

  // ============================================================
  // МЕТОДЫ ТЕКУЩЕГО КАНДИДАТА
  // ============================================================

  /**
   * Получение своего профиля
   * @returns Observable с профилем
   */
  getMyProfile(): Observable<CandidateProfile> {
    return this.get<CandidateProfile>('candidates/me');
  }

  /**
   * Обновление своего профиля
   * @param data - данные для обновления
   * @returns Observable с обновленным профилем
   */
  updateMyProfile(data: UpdateProfileRequest): Observable<CandidateProfile> {
    return this.put<CandidateProfile>('candidates/me', data);
  }

  /**
   * Получение своих навыков
   * @returns Observable со списком
   */
  getMySkills(): Observable<Skill[]> {
    return this.get<Skill[]>('candidates/me/skills');
  }

  /**
   * Обновление своих навыков
   * @param skills - новый список навыков
   * @returns Observable с результатом
   */
  updateMySkills(skills: Skill[]): Observable<Skill[]> {
    return this.put<Skill[]>('candidates/me/skills', { skills });
  }

  /**
   * Добавление навыка
   * @param skill - навык для добавления
   * @returns Observable с обновленным списком
   */
  addSkill(skill: Skill): Observable<Skill[]> {
    return this.post<Skill[]>('candidates/me/skills', skill);
  }

  /**
   * Удаление навыка
   * @param skillName - название навыка
   * @returns Observable с обновленным списком
   */
  removeSkill(skillName: string): Observable<Skill[]> {
    return this.delete<Skill[]>(`candidates/me/skills/${skillName}`);
  }

  // ============================================================
  // СТАТИСТИКА
  // ============================================================

  /**
   * Получение статистики кандидата
   * @param candidateId - ID кандидата
   * @returns Observable со статистикой
   */
  getCandidateStats(candidateId: string): Observable<{
    total_submissions: number;
    approved_count: number;
    rejected_count: number;
    pending_count: number;
    average_rating: number;
  }> {
    return this.get(`candidates/${candidateId}/stats`);
  }

  /**
   * Получение своей статистики
   * @returns Observable со статистикой
   */
  getMyStats(): Observable<{
    total_submissions: number;
    approved_count: number;
    rejected_count: number;
    pending_count: number;
    average_rating: number;
  }> {
    return this.get('candidates/me/stats');
  }
}
