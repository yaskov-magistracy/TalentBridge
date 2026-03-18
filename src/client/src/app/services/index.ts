/**
 * Services Index
 * 
 * Централизованный экспорт всех API сервисов.
 * Упрощает импорт сервисов в компонентах.
 * 
 * Пример использования:
 * ```typescript
 * import { AuthService, TaskService } from '../services';
 * ```
 */

// Базовый сервис
export { ApiService, ApiResponse, PaginatedResponse } from './api.service';

// Сервисы аутентификации и пользователей
export { 
  AuthService, 
  LoginRequest, 
  RegisterCandidateRequest, 
  AuthResponse, 
  User
} from './auth.service';

// Сервис заданий
export { 
  TaskService, 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilterParams 
} from './task.service';

// Сервис решений
export { 
  SubmissionService, 
  Submission, 
  SubmissionStatus,
  AutoTestResult,
  AutoTestsResults,
  AIIssue,
  AIAnalysisResults,
  ExpertReviewResults,
  CreateSubmissionRequest,
  ExpertReviewRequest,
  SubmissionFilterParams,
  ReviewStatus
} from './submission.service';

// Сервис кандидатов
export type {
  CandidateService, 
  Candidate, 
  CandidateProfile, 
  Skill, 
  SkillLevel,
  CandidateFilterParams,
  UpdateSkillsRequest,
  UpdateProfileRequest
} from './candidate.service';

// Сервис работодателей
export { 
  EmployerService, 
  Employer, 
  EmployerProfile,
  UpdateEmployerRequest,
  EmployerStats,
  EmployerDashboard
} from './employer.service';
