import type { AutoTestStatus, ExpertReviewStatus } from './api.models';

export type { AutoTestStatus, ExpertReviewStatus };

export type BadgeStatus = 'pending' | 'passed' | 'failed' | 'approved' | 'rejected';
export type TaskType = 'individual' | 'team';
export type SkillLevel = 'начинающий' | 'базовый' | 'опытный';

export interface EmployerProfile {
  id: string;
  companyName: string;
  description: string;
  publishedTasksCount: number;
  completedSubmissionsCount: number;
  email: string;
  phone: string;
  website?: string;
}

export interface Task {
  id: string;
  title: string;
  company: string;
  deadline: string;
  technologies: string[];
  description: string;
  requirements: string[];
  starterProjectUrl?: string;
  taskType?: TaskType;
  teamSize?: number;
}

export interface Team {
  id: string;
  taskId: string;
  creatorName: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
  contactInfo?: string;
  members: string[];
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  submittedDate: string;
  githubUrl: string;
  status: {
    autoTests: AutoTestStatus;
    aiAnalysis: AutoTestStatus;
    expertReview: ExpertReviewStatus;
  };
  autoTestsResults?: {
    passed: number;
    total: number;
    tests: { name: string; passed: boolean }[];
  };
  aiAnalysisResults?: {
    issues: { category: string; description: string }[];
  };
  expertReviewResults?: {
    comment: string;
    approved: boolean;
  };
  taskType?: TaskType;
}

export interface CandidateRanking {
  id: string;
  name: string;
  email: string;
  city: string;
  about: string;
  skills: { name: string; level: SkillLevel }[];
  completedTasksCount: number;
  successRate: number;
  rating: number;
  lastActive: string;
  completedTasks: string[];
  submissions: Submission[];
}

export interface EmployerCandidate {
  id: string;
  name: string;
  taskId: string;
  taskTitle: string;
  submittedDate: string;
  submissionId: string;
  currentStage: 'autoTests' | 'aiAnalysis' | 'expertReview';
  stageStatus: BadgeStatus;
}

export interface CandidateProfileForm {
  fullName: string;
  city: string;
  about: string;
  skills: { name: string; level: SkillLevel }[];
}
