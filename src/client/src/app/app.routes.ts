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
import { authGuard, requireAuthGuard } from './core/guards';

export const routes: Routes = [
	{ path: '', component: LandingPage, canActivate: [authGuard] },
	{ path: 'junior-auth', component: JuniorAuthPage, canActivate: [authGuard] },
	{ path: 'employer-auth', component: EmployerAuthPage, canActivate: [authGuard] },
	{ path: 'candidate-dashboard', component: CandidateDashboardPage, canActivate: [requireAuthGuard] },
	{ path: 'task/:id', component: TaskDetailPage },
	{ path: 'submission/:id', component: SubmissionResultsPage },
	{ path: 'employer-dashboard', component: EmployerDashboardPage, canActivate: [requireAuthGuard] },
	{ path: 'create-task', component: CreateTaskPage, canActivate: [requireAuthGuard] },
	{ path: 'edit-task/:id', component: EditTaskPage, canActivate: [requireAuthGuard] },
	{ path: 'candidate/:id', component: CandidateProfilePage },
	{ path: 'candidates-ranking', component: CandidatesRankingPage, canActivate: [requireAuthGuard] },
	{ path: '**', redirectTo: '' }
];
