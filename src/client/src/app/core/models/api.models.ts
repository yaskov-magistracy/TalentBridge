// ==================== Authorization ====================

export interface LoginRequest {
  login: string;
  password: string;
}

export interface SessionInfo {
  userId: string;
  role: AccountRole;
}

export type AccountRole = 'Candidate' | 'Employer' | 'Expert';

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
  login?: string | null;
  surname?: string | null;
  name?: string | null;
  patronymic?: string | null;
  city?: string | null;
  about?: string | null;
  rating: number;
  successRate?: number | null;
  averageScore?: number | null;
  solutionsCompleted?: string[] | null;
  technologies?: Technology[] | null;
  medalsCount?: number;
}

export interface Candidate {
  id: string;
  login?: string | null;
  surname?: string | null;
  name?: string | null;
  patronymic?: string | null;
  city?: string | null;
  about?: string | null;
  rating: number;
}

export type SearchOrderingDirection = 'Ascending' | 'Descending';
export type CandidateSearchOrderingField = 'Rating' | 'SolutionsCompleted' | 'SuccessRate';

export interface CandidateSearchOrdering {
  direction?: SearchOrderingDirection;
  field?: CandidateSearchOrderingField;
}

export interface CandidateSearchRequest {
  take?: number;
  skip?: number;
  technologiesIds?: string[] | null;
  ordering?: CandidateSearchOrdering;
}

export interface CandidateSearchResponse {
  items?: CandidateFullInfo[];
  totalCount?: number;
  total?: number;
}

// ==================== Employers ====================

export interface EmployerCreateRequest {
  login: string;
  password: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  siteUrl?: string;
}

export interface EmployerUpdateEntity {
  name?: string;
  email?: NullablePatch<string>;
  phoneNumber?: NullablePatch<string>;
  siteUrl?: NullablePatch<string>;
}

export interface EmployerFullInfo {
  id: string;
  login: string;
  name: string;
  email?: string | null;
  number?: string | null;
  siteUrl?: string | null;
  assignmentsCount: number;
  completedSolutions: number;
}

// ==================== Assignments ====================

export interface AssignmentCreateApiRequest {
  name: string;
  description: string;
  templateUrl?: string;
  deadLine: string; // DateOnly as ISO string
  candidatesCapacity: number;
  difficulty: AssignmentDifficulty;
  attemptsCoefficients: number[];
  isPrivate?: boolean;
  technologies?: string[]; // Guid[]
}

export type AssignmentDifficulty = 'Normal' | 'Advanced' | 'Hard';

export interface AssignmentUpdateEntity {
  name?: string;
  description?: string;
  templateUrl?: { value: string | null };
  deadLine?: string;
  candidatesCapacity?: number;
  difficulty?: AssignmentDifficulty;
  attemptsCoefficients?: number[];
  isPrivate?: boolean;
  technologies?: RelationsPatch;
}

export interface AssignmentFullInfo {
  id: string;
  name: string;
  description: string;
  templateUrl?: string;
  deadLine: string;
  candidatesCapacity: number;
  difficulty: AssignmentDifficulty;
  attemptsCoefficients: number[];
  isPrivate: boolean;
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
  includePrivate?: boolean;
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
  name?: string | null;
  description?: string | null;
}

export interface SolutionPatchRequest {
  solutionUrl?: string | null;
  team?: SolutionTeamPatchRequest;
}

export type SolutionPatchApiRequest = SolutionPatchRequest;

export interface SolutionTeamPatchRequest {
  name?: string | null;
  description?: string | null;
}

export interface SolutionFullInfo {
  id: string;
  solutionUrl?: string | null;
  startedAt?: string | null;
  state: SolutionState;
  history?: SolutionStateHistoryEvent[] | null;
  team?: SolutionTeamInfo | null;
  medalGrantedAt?: string | null;
  assignment: AssignmentFullInfo;
  candidateOwner: Candidate;
  candidates: CandidateFullInfo[];
  candidatesJoinRequested?: Candidate[] | null;
  expertReviews?: ExpertReviewInSolution[] | null;
}

export interface SolutionTeamInfo {
  name: string;
  description: string;
}

export interface SolutionStateHistoryEvent {
  state: SolutionState;
  date: string;
}

export interface ExpertReviewInSolution {
  id: string;
  expert: {
    id: string;
    surname?: string | null;
    name?: string | null;
    patronymic?: string | null;
  };
  comment?: string | null;
  score: number;
  attemptNumber: number;
  createdAt: string;
  lastEditedAt: string;
}

export interface SolutionSubmitReviewRequest {
  comment: string;
  score: number;
  resultState: SolutionSubmitReviewResultState;
  grantMedal: boolean;
}

export type SolutionSubmitReviewResultState = 'Done' | 'Failed';

export type SolutionState = 'NotStarted' | 'InProgress' | 'Autotests' | 'AiReview' | 'ExpertReview' | 'RequiresImprovements' | 'Done' | 'Failed';

export interface AssignmentQuotaResponse {
  medalsToGrantLeft: number;
  medalsToGrantLimit: number;
}

// Для совместимости со старыми компонентами
export type AutoTestStatus = 'pending' | 'passed' | 'failed';
export type ExpertReviewStatus = 'pending' | 'approved' | 'rejected';

export interface SolutionSearchRequest {
  take?: number;
  skip?: number;
  assignmentId?: string | null;
  technologiesIds?: string[] | null;
  excludeAssignmentsIds?: string[] | null;
  candidateId?: string | null;
  excludeCandidateId?: string | null;
  candidateOwnerId?: string | null;
  excludeCandidateOwnerId?: string | null;
  candidateJoinRequestedId?: string | null;
  excludeCandidateJoinRequestedId?: string | null;
  isAvailableToJoin?: boolean | null;
  state?: SolutionState;
  hasMedal?: boolean | null;
  text?: string | null;
}

export interface SolutionSearchResponse {
  items?: SolutionFullInfo[] | null;
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

// ==================== AiChats ====================

export type AiChatMessageAuthor = 'Ai' | 'User';

export interface AiChatMessage {
  id: string;
  text?: string | null;
  author: AiChatMessageAuthor;
  createdAt: string;
}

export interface AiChat {
  id: string;
  userId: string;
  messages?: AiChatMessage[] | null;
}

export interface AiChatSendMessageRequest {
  text: string;
}

export interface AiChatSendMessageResponse {
  userRequest: AiChatMessage;
  aiResponse: AiChatMessage;
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
