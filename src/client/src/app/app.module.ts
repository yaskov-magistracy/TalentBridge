/**
 * AppModule - Корневой модуль приложения Angular
 * 
 * Этот модуль является точкой входа для всего приложения.
 * Он объявляет корневой компонент и настраивает маршрутизацию.
 * 
 * Структура модуля:
 * - declarations: объявляет корневой компонент AppComponent
 * - imports: импортирует необходимые модули (BrowserModule, RouterModule, FormsModule)
 * - providers: глобальные сервисы (в данном случае пустой массив)
 * - bootstrap: указывает корневой компонент для загрузки
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ===== ИМПОРТ КОРНЕВОГО КОМПОНЕНТА =====
import { AppComponent } from './app.component';

// ===== ИМПОРТ КОМПОНЕНТОВ СТРАНИЦ =====
import { LandingComponent } from './pages/landing.component';
import { JuniorAuthComponent } from './pages/junior-auth.component';
import { EmployerAuthComponent } from './pages/employer-auth.component';
import { CandidateDashboardComponent } from './pages/candidate-dashboard.component';
import { TaskDetailComponent } from './pages/task-detail.component';
import { SubmissionResultsComponent } from './pages/submission-results.component';
import { EmployerDashboardComponent } from './pages/employer-dashboard.component';
import { CreateTaskComponent } from './pages/create-task.component';
import { EditTaskComponent } from './pages/edit-task.component';
import { CandidateProfileComponent } from './pages/candidate-profile.component';
import { CandidatesRankingComponent } from './pages/candidates-ranking.component';

// ===== КОНФИГУРАЦИЯ МАРШРУТОВ =====
/**
 * Определение маршрутов (Routes) для приложения
 * 
 * Каждый маршрут содержит:
 * - path: путь URL
 * - component: компонент, который будет отображен
 * 
 * Порядок маршрутов важен - более специфичные маршруты должны идти раньше
 */
const routes: Routes = [
  // Главная страница (Landing)
  { path: '', component: LandingComponent },
  
  // Аутентификация
  { path: 'junior-auth', component: JuniorAuthComponent },
  { path: 'employer-auth', component: EmployerAuthComponent },
  
  // Кандидат
  { path: 'candidate-dashboard', component: CandidateDashboardComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'submission/:id', component: SubmissionResultsComponent },
  
  // Работодатель
  { path: 'employer-dashboard', component: EmployerDashboardComponent },
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'edit-task/:id', component: EditTaskComponent },
  { path: 'candidate/:id', component: CandidateProfileComponent },
  { path: 'candidates-ranking', component: CandidatesRankingComponent },
  
  // Редирект на главную для неизвестных путей
  { path: '**', redirectTo: '' }
];

@NgModule({
  // Объявление НЕ-standalone компонентов
  declarations: [
    AppComponent
  ],
  
  // Импорт необходимых модулей и standalone компонентов
  imports: [
    // Модуль браузера (обязательный для веб-приложений)
    BrowserModule,
    
    // Модуль маршрутизации с настроенными путями
    RouterModule.forRoot(routes),
    
    // Модуль для работы с формами (two-way binding)
    FormsModule,
    
    // ===== ИМПОРТ STANDALONE КОМПОНЕНТОВ =====
    // В Angular standalone компоненты импортируются в imports
    LandingComponent,
    JuniorAuthComponent,
    EmployerAuthComponent,
    CandidateDashboardComponent,
    TaskDetailComponent,
    SubmissionResultsComponent,
    EmployerDashboardComponent,
    CreateTaskComponent,
    EditTaskComponent,
    CandidateProfileComponent,
    CandidatesRankingComponent,
  ],
  
  // Глобальные провайдеры сервисов
  providers: [],
  
  // Корневой компонент для загрузки
  bootstrap: [AppComponent]
})
export class AppModule { }
