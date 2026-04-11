// ==================== Authorization ====================

export interface LoginRequest {
  login: string;
  password: string;
}

export interface SessionInfo {
  userId: string;
  role: AccountRole;
}

export type AccountRole = 'Candidate' | 'Employer' | 'Admin';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== Candidates ====================

export interface CandidateCreateRequest {
  login: string;
  password: string;
  surname: string;
  name: string;
  patronymic?: string;
  city: string;
  about: string;
  technologies?: string[];
}

export interface CandidatePatchApiRequest {
  surname?: string;
  name?: string;
  patronymic?: NullablePatch<string>;
  city?: string;
  about?: string;
  technologies?: RelationsPatch;
}

export interface CandidateFullInfo {
  id: string;
  login: string;
  surname: string;
  name: string;
  patronymic?: string;
  city: string;
  about: string;
  technologies: Technology[];
}

// ==================== Employers ====================

export interface EmployerCreateRequest {
  companyName: string;
  email: string;
  password: string;
  description?: string;
  phone?: string;
  website?: string;
}

export interface EmployerUpdateEntity {
  companyName?: string;
  email?: string;
  description?: string;
  phone?: string;
  website?: string;
}

export interface EmployerFullInfo {
  id: string;
  companyName: string;
  email: string;
  description?: string;
  phone?: string;
  website?: string;
}

// ==================== Assignments ====================

export interface AssignmentCreateApiRequest {
  name: string;
  description: string;
  templateUrl?: string;
  deadLine: string; // DateOnly as ISO string
  candidatesCapacity: number;
  technologies?: string[]; // Guid[]
}

export interface AssignmentUpdateEntity {
  name?: string;
  description?: string;
  templateUrl?: { value: string | null };
  deadLine?: string;
  candidatesCapacity?: number;
  technologies?: RelationsPatch;
}

export interface AssignmentFullInfo {
  id: string;
  name: string;
  description: string;
  templateUrl?: string;
  deadLine: string;
  candidatesCapacity: number;
  isGrouped: boolean;
  employer: {
    id: string;
    login: string;
    name: string;
  };
  technologies: Technology[];
}

export interface DateRange {
  from: string;
  to: string;
}

export interface AssignmentSearchRequest {
  take?: number;
  skip?: number;
  employerId?: string;
  text?: string;
  excludedIds?: string[];
  technologiesIds?: string[];
  isGrouped?: boolean;
  deadLineRangeIncluded?: DateRange;
}

export interface AssignmentSearchResponse {
  items: AssignmentFullInfo[];
  totalCount: number;
}

// ==================== Solutions ====================

export interface SolutionCreateApiRequest {
  assignmentId: string;
  team?: SolutionTeamCreateApiRequest;
}

export interface SolutionTeamCreateApiRequest {
  name: string;
  description: string;
}

export interface SolutionPatchApiRequest {
  solutionUrl?: string;
  team?: SolutionTeamPatchApiRequest;
}

export interface SolutionTeamPatchApiRequest {
  name?: string;
  description?: string;
}

export interface SolutionFullInfo {
  id: string;
  solutionUrl?: string;
  startedAt: string;
  state: SolutionState;
  team?: SolutionTeamInfo;
  assignment: AssignmentFullInfo;
  candidateOwner: CandidateFullInfo;
  candidates: CandidateFullInfo[];
  candidatesJoinRequested: CandidateFullInfo[];
}

export interface SolutionTeamInfo {
  name: string;
  description: string;
  members: CandidateShortInfo[];
}

export interface CandidateShortInfo {
  id: string;
  surname: string;
  name: string;
}

export type SolutionState = 'NotStarted' | 'InProgress' | 'Autotests' | 'AiReview' | 'ExpertReview' | 'Done' | 'Rejected';

// Для совместимости со старыми компонентами
export type AutoTestStatus = 'pending' | 'passed' | 'failed';
export type ExpertReviewStatus = 'pending' | 'approved' | 'rejected';

export interface SolutionSearchRequest {
  take?: number;
  skip?: number;
  assignmentId?: string;
  technologiesIds?: string[];
  excludeAssignmentsIds?: string[];
  candidateId?: string;
  excludeCandidateId?: string;
  candidateOwnerId?: string;
  excludeCandidateOwnerId?: string;
  candidateJoinRequestedId?: string;
  excludeCandidateJoinRequestedId?: string;
  isAvailableToJoin?: boolean;
  text?: string;
}

export interface SolutionSearchResponse {
  items: SolutionFullInfo[];
  totalCount: number;
}

// ==================== Technologies ====================

export interface Technology {
  id: string;
  name: string;
}

export interface TechnologyCreateEntity {
  name: string;
}

export interface TechnologyUpdateEntity {
  name?: string;
}

export interface TechnologySearchRequest {
  name?: string;
  take?: number;
  skip?: number;
}

export interface TechnologySearchResponse {
  items: Technology[];
  total: number;
}

// ==================== Common ====================

export interface NullablePatch<T> {
  value: T | null;
  isSet: boolean;
}

export interface RelationsPatch {
  toAdd?: string[]; // Guid[]
  toRemove?: string[]; // Guid[]
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
