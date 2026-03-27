import { Routes } from '@angular/router';
import { CandidateDashboardPage } from './pages/candidate-dashboard.page';
import { CandidateProfilePage } from './pages/candidate-profile.page';
import { CandidatesRankingPage } from './pages/candidates-ranking.page';
import { CreateTaskPage } from './pages/create-task.page';
import { EditTaskPage } from './pages/edit-task.page';
import { EmployerAuthPage } from './pages/employer-auth.page';
import { EmployerDashboardPage } from './pages/employer-dashboard.page';
import { JuniorAuthPage } from './pages/junior-auth.page';
import { LandingPage } from './pages/landing.page';
import { SubmissionResultsPage } from './pages/submission-results.page';
import { TaskDetailPage } from './pages/task-detail.page';

export const routes: Routes = [
	{ path: '', component: LandingPage },
	{ path: 'junior-auth', component: JuniorAuthPage },
	{ path: 'employer-auth', component: EmployerAuthPage },
	{ path: 'candidate-dashboard', component: CandidateDashboardPage },
	{ path: 'task/:id', component: TaskDetailPage },
	{ path: 'submission/:id', component: SubmissionResultsPage },
	{ path: 'employer-dashboard', component: EmployerDashboardPage },
	{ path: 'create-task', component: CreateTaskPage },
	{ path: 'edit-task/:id', component: EditTaskPage },
	{ path: 'candidate/:id', component: CandidateProfilePage },
	{ path: 'candidates-ranking', component: CandidatesRankingPage },
	{ path: '**', redirectTo: '' }
];
