import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';
import { ReviewProgressComponent } from '../shared/components/review-progress.component';
import { EmployerCandidate, EmployerProfile, Submission } from '../core/models/domain.models';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, StatusBadgeComponent, ReviewProgressComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Header with Actions -->
        <div class="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 class="text-3xl font-bold uppercase text-emerald-600">ПАНЕЛЬ РАБОТОДАТЕЛЯ</h1>
          <div class="flex gap-4 flex-wrap">
            <a [routerLink]="'/candidates-ranking'" class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider bg-white">
              РЕЙТИНГ КАНДИДАТОВ
            </a>
            <a [routerLink]="'/create-task'" class="border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider">
              + СОЗДАТЬ ЗАДАНИЕ
            </a>
          </div>
        </div>

        <!-- Company Profile -->
        <div *ngIf="profile" class="border-2 border-emerald-600 bg-white p-6 shadow-lg mb-8">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-500 flex items-center justify-center text-white text-2xl">
                🏢
              </div>
              <div>
                <h2 class="text-2xl font-bold text-emerald-600 uppercase">Профиль компании</h2>
                <p class="text-sm text-gray-600">Информация о вашей организации</p>
              </div>
            </div>
            <button
              (click)="openProfileEdit()"
              class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors font-semibold uppercase text-sm flex items-center gap-2">
              ✎ Редактировать
            </button>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Название компании</p>
              <p class="font-semibold text-lg">{{ profile.companyName }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Опубликовано заданий</p>
                <p class="font-semibold text-lg text-emerald-600">{{ profile.publishedTasksCount }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Выполнено работ</p>
                <p class="font-semibold text-lg text-indigo-600">{{ profile.completedSubmissionsCount }}</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">О компании</p>
            <p class="text-gray-700 leading-relaxed">{{ profile.description }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p class="text-gray-700">{{ profile.email }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Телефон</p>
              <p class="text-gray-700">{{ profile.phone }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Сайт</p>
              <a *ngIf="profile.website" [href]="profile.website" target="_blank" class="text-indigo-600 hover:underline">{{ profile.website }}</a>
            </div>
          </div>

          <div *ngIf="showProfileEdit" class="mt-6 border-t-2 border-emerald-200 pt-6">
            <div class="space-y-4">
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Название компании</label>
                <input
                  type="text"
                  [(ngModel)]="editProfile.companyName"
                  class="w-full border-2 border-black p-3" />
              </div>

              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">О компании</label>
                <textarea
                  [(ngModel)]="editProfile.description"
                  class="w-full border-2 border-black p-3 min-h-[120px]"></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    [(ngModel)]="editProfile.email"
                    class="w-full border-2 border-black p-3" />
                </div>
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Телефон</label>
                  <input
                    type="text"
                    [(ngModel)]="editProfile.phone"
                    class="w-full border-2 border-black p-3" />
                </div>
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Сайт</label>
                  <input
                    type="url"
                    [(ngModel)]="editProfile.website"
                    class="w-full border-2 border-black p-3"
                    placeholder="https://example.com" />
                </div>
              </div>
            </div>

            <div class="flex gap-2 mt-6">
              <button
                (click)="saveProfile()"
                class="flex-1 border-2 border-emerald-600 bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider">
                Сохранить
              </button>
              <button
                (click)="cancelProfileEdit()"
                class="flex-1 border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider">
                Отмена
              </button>
            </div>
          </div>
        </div>

        <!-- Published Tasks -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">ОПУБЛИКОВАННЫЕ ЗАДАНИЯ</h2>
          <div class="space-y-4">
            <div *ngFor="let task of tasks" class="border-2 border-emerald-400 bg-white p-6 shadow-md">
              <div class="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h3 class="font-bold text-lg mb-2 uppercase">{{ task.title }}</h3>
                  <div class="flex gap-6 text-sm">
                    <p><span class="font-bold uppercase">РЕШЕНИЙ:</span> {{ task.submissionsCount }}</p>
                    <p><span class="font-bold uppercase">ДЕДЛАЙН:</span> {{ task.deadline }}</p>
                    <p><span class="font-bold uppercase">СОСТОЯНИЕ:</span> <span [ngClass]="task.active ? 'text-emerald-600 font-bold' : 'text-gray-500'">{{ task.active ? 'АКТИВНОЕ' : 'АРХИВИРОВАННОЕ' }}</span></p>
                  </div>
                </div>
                <a [routerLink]="['/edit-task', task.id]" class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase font-semibold flex-shrink-0">
                  РЕДАКТИРОВАтЬ
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Candidates and Solutions Table -->
        <div>
          <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">КАНДИДАТЫ И РЕШЕНИЯ</h2>
          <div class="border-2 border-emerald-600 bg-white shadow-md overflow-hidden">
            <!-- Table Header -->
            <div class="grid grid-cols-6 gap-4 p-4 bg-emerald-50 border-b-2 border-emerald-600 font-bold text-sm uppercase">
              <div>Кандидат</div>
              <div>Задание</div>
              <div>Дата</div>
              <div>Этап</div>
              <div>Статус</div>
              <div>Действия</div>
            </div>

            <!-- Table Rows -->
            <div *ngFor="let candidate of candidates" class="grid grid-cols-6 gap-4 p-4 border-b-2 border-emerald-200 last:border-b-0 items-center text-sm">
              <a [routerLink]="['/candidate', candidate.id]" class="font-bold hover:text-emerald-600 cursor-pointer">{{ candidate.name }}</a>
              <div class="text-xs">{{ candidate.taskTitle }}</div>
              <div class="text-xs text-gray-500">{{ candidate.submittedDate }}</div>
              <div class="text-xs uppercase text-gray-700">
                <span *ngIf="candidate.currentStage === 'autoTests'">Автотесты</span>
                <span *ngIf="candidate.currentStage === 'aiAnalysis'">АО-Анализ</span>
                <span *ngIf="candidate.currentStage === 'expertReview'">Эксперт</span>
              </div>
              <div><app-status-badge [status]="candidate.stageStatus"></app-status-badge></div>
              <div class="flex gap-2">
                <button 
                  *ngIf="candidate.stageStatus === 'pending' && candidate.currentStage === 'expertReview'"
                  (click)="openExpertReviewModal(candidate.submissionId)"
                  class="border-2 border-indigo-600 bg-indigo-600 text-white px-3 py-1 hover:bg-indigo-700 transition-colors text-xs uppercase font-semibold">
                  ПРОВЕРИТь
                </button>
                <a [routerLink]="['/candidate', candidate.id]" class="border-2 border-emerald-600 px-3 py-1 hover:bg-emerald-600 hover:text-white transition-colors text-xs uppercase font-semibold">
                  ПРОФИЛЬ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expert Review Modal -->
      <div *ngIf="showExpertReviewModal && selectedSubmission" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div class="bg-white border-2 border-indigo-600 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="border-b-2 border-indigo-600 p-6 flex justify-between items-center bg-indigo-50">
            <h2 class="font-bold text-xl uppercase text-indigo-600">ПРОВЕрКА РЕШЕНИЯ</h2>
            <button (click)="closeExpertReviewModal()" class="text-4xl hover:opacity-70">×</button>
          </div>
          
          <!-- Content -->
          <div class="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <h3 class="font-bold mb-2 uppercase">{{ selectedSubmission.taskTitle }}</h3>
              <p class="text-sm text-gray-600">{{ selectedSubmission.submittedDate }}</p>
            </div>

            <!-- Review Progress -->
            <app-review-progress
              [autoTests]="selectedSubmission.status.autoTests"
              [aiAnalysis]="selectedSubmission.status.aiAnalysis"
              [expertReview]="selectedSubmission.status.expertReview"
            ></app-review-progress>

            <!-- GitHub Link -->
            <div class="border-2 border-black p-4">
              <p class="text-xs font-bold uppercase mb-2">Репозиторий</p>
              <a [href]="selectedSubmission.githubUrl" target="_blank" class="text-indigo-600 hover:underline break-all text-sm">
                {{ selectedSubmission.githubUrl }}
              </a>
            </div>

            <!-- Auto Tests -->
            <div *ngIf="selectedSubmission.autoTestsResults as auto" class="border-2 border-black p-4">
              <h4 class="font-bold mb-3 uppercase">Выполнение тестов</h4>
              <div class="mb-3">
                <div class="flex justify-between text-xs mb-2">
                  <span>{{ auto.passed }} / {{ auto.total }}</span>
                  <span>{{ ((auto.passed / auto.total) * 100).toFixed(0) }}%</span>
                </div>
                <div class="w-full h-4 border border-black flex">
                  <div [style.width.%]="(auto.passed / auto.total) * 100" [ngClass]="auto.passed === auto.total ? 'bg-emerald-500' : 'bg-amber-500'"></div>
                </div>
              </div>
            </div>

            <!-- AI Analysis -->
            <div *ngIf="selectedSubmission.aiAnalysisResults as ai" class="border-2 border-black p-4">
              <h4 class="font-bold mb-3 uppercase">AI-Анализ</h4>
              <div class="space-y-2">
                <div *ngFor="let issue of ai.issues" class="border border-gray-300 p-2 text-xs">
                  <p class="font-bold">{{ issue.category }}</p>
                  <p class="text-gray-600">{{ issue.description }}</p>
                </div>
              </div>
            </div>

            <!-- Expert Review Form -->
            <div class="border-2 border-indigo-600 bg-indigo-50 p-4">
              <h4 class="font-bold mb-3 uppercase text-indigo-700">Ваша оценка</h4>
              <div class="mb-4">
                <label class="block font-bold mb-2 text-sm uppercase">КОММЕНтАРИЙ</label>
                <textarea 
                  [(ngModel)]="expertComment"
                  class="w-full border-2 border-black p-3 min-h-[100px]"
                  placeholder="Введите ваш комментарий"></textarea>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="border-t-2 border-indigo-600 p-6 bg-gray-50 flex gap-2">
            <button 
              (click)="closeExpertReviewModal()"
              class="flex-1 border-2 border-gray-400 px-6 py-3 hover:bg-gray-200 transition-colors font-bold uppercase tracking-wider">
              ОТМЕНА
            </button>
            <button 
              (click)="rejectSubmission()"
              class="flex-1 border-2 border-red-600 bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors font-bold uppercase tracking-wider">
              ОТКЛОНИТЬ
            </button>
            <button 
              (click)="approveSubmission()"
              class="flex-1 border-2 border-emerald-600 bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider">
              ОДОБРИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardPage implements OnInit {
  profile: EmployerProfile | null = null;
  editProfile: EmployerProfile = {
    id: '',
    companyName: '',
    description: '',
    publishedTasksCount: 0,
    completedSubmissionsCount: 0,
    email: '',
    phone: '',
    website: ''
  };
  showProfileEdit = false;
  tasks: any[] = [];
  candidates: EmployerCandidate[] = [];
  
  showExpertReviewModal = false;
  selectedSubmission: Submission | null = null;
  expertComment = '';

  constructor(private repository: TalentBridgeRepository) {}

  ngOnInit() {
    this.profile = this.repository.getEmployerProfile();
    if (this.profile) {
      this.editProfile = { ...this.profile, website: this.profile.website || '' };
    }
    this.tasks = this.repository.getEmployerTasks();
    this.candidates = this.repository.getEmployerCandidates();
  }

  openProfileEdit() {
    if (this.profile) {
      this.editProfile = { ...this.profile, website: this.profile.website || '' };
    }
    this.showProfileEdit = true;
  }

  saveProfile() {
    this.profile = { ...this.editProfile, website: this.editProfile.website || undefined };
    this.showProfileEdit = false;
  }

  cancelProfileEdit() {
    this.showProfileEdit = false;
    if (this.profile) {
      this.editProfile = { ...this.profile, website: this.profile.website || '' };
    }
  }

  openExpertReviewModal(submissionId: string) {
    const submission = this.repository.getSubmissionById(submissionId);
    this.selectedSubmission = submission || null;
    this.expertComment = this.selectedSubmission?.expertReviewResults?.comment || '';
    this.showExpertReviewModal = true;
  }

  closeExpertReviewModal() {
    this.showExpertReviewModal = false;
    this.selectedSubmission = null;
    this.expertComment = '';
  }

  approveSubmission() {
    if (this.selectedSubmission) {
      alert('Решение одобрено!');
      this.closeExpertReviewModal();
    }
  }

  rejectSubmission() {
    if (this.selectedSubmission) {
      alert('Решение отклонено!');
      this.closeExpertReviewModal();
    }
  }
}
