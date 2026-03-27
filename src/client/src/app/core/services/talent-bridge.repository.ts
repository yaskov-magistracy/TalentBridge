import { Injectable } from '@angular/core';
import {
  CandidateRanking,
  EmployerCandidate,
  EmployerProfile,
  Submission,
  Task,
  Team
} from '../models/domain.models';
import {
  allSubmissions,
  availableTasks,
  candidateSubmissions,
  candidatesRanking,
  employerCandidates,
  employerProfile,
  employerTasks,
  tasksInProgress,
  teams
} from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class TalentBridgeRepository {
  getAvailableTasks(): Task[] {
    return availableTasks;
  }

  getTaskById(id: string | null): Task | undefined {
    return availableTasks.find((task) => task.id === id);
  }

  getTasksInProgress(): string[] {
    return tasksInProgress;
  }

  getCandidateSubmissions(): Submission[] {
    return candidateSubmissions;
  }

  getSubmissionById(id: string | null): Submission | undefined {
    return allSubmissions.find((submission) => submission.id === id) ||
      candidateSubmissions.find((submission) => submission.id === id);
  }

  getEmployerTasks() {
    return employerTasks;
  }

  getEmployerCandidates(): EmployerCandidate[] {
    return employerCandidates;
  }

  getAllSubmissions(): Submission[] {
    return allSubmissions;
  }

  getCandidatesRanking(): CandidateRanking[] {
    return candidatesRanking;
  }

  getCandidateById(id: string | null): CandidateRanking | undefined {
    return candidatesRanking.find((candidate) => candidate.id === id);
  }

  getTeamsByTaskId(taskId: string | null): Team[] {
    return teams.filter((team) => team.taskId === taskId);
  }

  getEmployerProfile(): EmployerProfile {
    return employerProfile;
  }
}
