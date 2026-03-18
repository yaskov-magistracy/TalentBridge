/**
 * SubmissionService - Сервис для работы с отправленными решениями
 * 
 * Управляет решениями кандидатов (submissions).
 * Работает с FastAPI endpoints для отправки, проверки и получения результатов.
 * 
 * Endpoints:
 * - GET /submissions - список решений
 * - GET /submissions/:id - получение решения
 * - POST /submissions - отправка решения
 * - GET /submissions/:id/results - результаты проверки
 * - POST /submissions/:id/review - экспертная проверка (employer)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';

/**
 * Статусы проверки
 */
export type ReviewStatus = 'pending' | 'passed' | 'failed' | 'approved' | 'rejected';

/**
 * Интерфейс статуса проверки
 */
export interface SubmissionStatus {
  auto_tests: 'pending' | 'passed' | 'failed';
  ai_analysis: 'pending' | 'passed' | 'failed';
  expert_review: 'pending' | 'approved' | 'rejected';
}

/**
 * Интерфейс результата автотеста
 */
export interface AutoTestResult {
  name: string;
  passed: boolean;
  duration?: number;
  error_message?: string;
}

/**
 * Интерфейс результатов автотестов
 */
export interface AutoTestsResults {
  passed: number;
  total: number;
  tests: AutoTestResult[];
  log_url?: string;
}

/**
 * Интерфейс замечания AI-анализа
 */
export interface AIIssue {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  line_number?: number;
  file_path?: string;
}

/**
 * Интерфейс результатов AI-анализа
 */
export interface AIAnalysisResults {
  issues: AIIssue[];
  score: number;
  summary: string;
}

/**
 * Интерфейс результата экспертной проверки
 */
export interface ExpertReviewResults {
  comment: string;
  approved: boolean;
  reviewed_by: string;
  reviewed_at: string;
}

/**
 * Интерфейс отправленного решения
 */
export interface Submission {
  id: string;
  task_id: string;
  task_title: string;
  candidate_id: string;
  candidate_name: string;
  submitted_date: string;
  github_url: string;
  status: SubmissionStatus;
  auto_tests_results?: AutoTestsResults;
  ai_analysis_results?: AIAnalysisResults;
  expert_review_results?: ExpertReviewResults;
  current_stage: 'auto_tests' | 'ai_analysis' | 'expert_review';
  stage_status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Интерфейс создания решения
 */
export interface CreateSubmissionRequest {
  task_id: string;
  github_url: string;
}

/**
 * Интерфейс экспертной проверки
 */
export interface ExpertReviewRequest {
  approved: boolean;
  comment: string;
}

/**
 * Параметры фильтрации решений
 */
export interface SubmissionFilterParams {
  task_id?: string;
  candidate_id?: string;
  status?: ReviewStatus;
  current_stage?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ============================================================
  // CRUD ОПЕРАЦИИ
  // ============================================================

  /**
   * Получение списка решений с фильтрацией
   * @param params - параметры фильтрации
   * @returns Observable с пагинированным списком
   */
  getSubmissions(params?: SubmissionFilterParams): Observable<PaginatedResponse<Submission>> {
    return this.get<PaginatedResponse<Submission>>('submissions', params);
  }

  /**
   * Получение решения по ID
   * @param submissionId - ID решения
   * @returns Observable с решением
   */
  getSubmissionById(submissionId: string): Observable<Submission> {
    return this.get<Submission>(`submissions/${submissionId}`);
  }

  /**
   * Отправка решения на проверку
   * @param data - данные решения
   * @returns Observable с созданным решением
   */
  createSubmission(data: CreateSubmissionRequest): Observable<Submission> {
    return this.post<Submission>('submissions', data);
  }

  // ============================================================
  // РЕЗУЛЬТАТЫ ПРОВЕРКИ
  // ============================================================

  /**
   * Получение полных результатов проверки
   * @param submissionId - ID решения
   * @returns Observable с детальными результатами
   */
  getSubmissionResults(submissionId: string): Observable<Submission> {
    return this.get<Submission>(`submissions/${submissionId}/results`);
  }

  /**
   * Получение результатов автотестов
   * @param submissionId - ID решения
   * @returns Observable с результатами
   */
  getAutoTestResults(submissionId: string): Observable<AutoTestsResults> {
    return this.get<AutoTestsResults>(`submissions/${submissionId}/auto-tests`);
  }

  /**
   * Получение результатов AI-анализа
   * @param submissionId - ID решения
   * @returns Observable с результатами
   */
  getAIAnalysisResults(submissionId: string): Observable<AIAnalysisResults> {
    return this.get<AIAnalysisResults>(`submissions/${submissionId}/ai-analysis`);
  }

  // ============================================================
  // ЭКСПЕРТНАЯ ПРОВЕРКА (для работодателей)
  // ============================================================

  /**
   * Отправка экспертной проверки
   * @param submissionId - ID решения
   * @param review - данные проверки
   * @returns Observable с результатом
   */
  submitExpertReview(submissionId: string, review: ExpertReviewRequest): Observable<Submission> {
    return this.post<Submission>(`submissions/${submissionId}/review`, review);
  }

  /**
   * Получение списка решений для экспертной проверки
   * @returns Observable со списком
   */
  getPendingExpertReviews(): Observable<Submission[]> {
    return this.get<Submission[]>('submissions/pending-expert-review');
  }

  // ============================================================
  // МЕТОДЫ КАНДИДАТА
  // ============================================================

  /**
   * Получение своих решений
   * @returns Observable со списком
   */
  getMySubmissions(): Observable<Submission[]> {
    return this.get<Submission[]>('candidates/me/submissions');
  }

  /**
   * Получение своего решения по ID задания
   * @param taskId - ID задания
   * @returns Observable с решением
   */
  getMySubmissionForTask(taskId: string): Observable<Submission | null> {
    return this.get<Submission | null>(`candidates/me/submissions/task/${taskId}`);
  }

  // ============================================================
  // МЕТОДЫ РАБОТОДАТЕЛЯ
  // ============================================================

  /**
   * Получение решений по заданию
   * @param taskId - ID задания
   * @returns Observable со списком
   */
  getSubmissionsForTask(taskId: string): Observable<Submission[]> {
    return this.get<Submission[]>(`employers/me/tasks/${taskId}/submissions`);
  }

  /**
   * Получение кандидатов, отправивших решения на задания работодателя
   * @returns Observable со списком
   */
  getCandidatesWithSubmissions(): Observable<Submission[]> {
    return this.get<Submission[]>('employers/me/submissions');
  }
}
