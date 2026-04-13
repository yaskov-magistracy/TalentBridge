import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AuthService, SolutionsService } from '../core';
import { SolutionFullInfo, SolutionSearchRequest, SolutionState } from '../core/models/api.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-expert-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    TechChipComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <app-navbar [role]="'expert'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Header -->
        <div class="border-2 border-amber-600 bg-white p-6 shadow-lg mb-8">
          <div class="flex items-center gap-3">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl">
              🎓
            </div>
            <div>
              <h2 class="text-2xl font-bold text-amber-600 uppercase">Панель эксперта</h2>
              <p class="text-sm text-gray-600">Проверка и ревью решений кандидатов</p>
            </div>
          </div>
        </div>

        <div class="flex gap-8">
          <!-- Left Sidebar - Filters -->
          <div class="w-64 flex-shrink-0">
            <div class="border-2 border-amber-600 bg-white p-6 shadow-md">
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider text-amber-600">Тип проекта</h3>

              <!-- Loading Indicator -->
              <div *ngIf="loading" class="text-center py-4 text-gray-500 text-xs">
                Загрузка...
              </div>

              <!-- Project Type Filter -->
              <div *ngIf="!loading" class="space-y-2">
                <label class="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    [checked]="projectTypeFilter === 'all'"
                    (change)="projectTypeFilter = 'all'; applyFilters()"
                    class="w-4 h-4"/>
                  <span>Все</span>
                </label>
                <label class="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    [checked]="projectTypeFilter === 'group'"
                    (change)="projectTypeFilter = 'group'; applyFilters()"
                    class="w-4 h-4"/>
                  <span>Групповые</span>
                </label>
                <label class="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    [checked]="projectTypeFilter === 'individual'"
                    (change)="projectTypeFilter = 'individual'; applyFilters()"
                    class="w-4 h-4"/>
                  <span>Индивидуальные</span>
                </label>
              </div>

              <!-- Archive Status Filter -->
              <div *ngIf="activeTab === 'archive' && !loading" class="mt-6 pt-4 border-t-2 border-amber-200">
                <h4 class="font-bold mb-3 text-xs uppercase tracking-wider text-amber-600">Статус ревью</h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="reviewStatus"
                      [checked]="reviewStatusFilter === 'all'"
                      (change)="reviewStatusFilter = 'all'; applyFilters()"
                      class="w-4 h-4"/>
                    <span>Все</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="reviewStatus"
                      [checked]="reviewStatusFilter === 'done'"
                      (change)="reviewStatusFilter = 'done'; applyFilters()"
                      class="w-4 h-4"/>
                    <span>Ревью пройдено</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="reviewStatus"
                      [checked]="reviewStatusFilter === 'rejected'"
                      (change)="reviewStatusFilter = 'rejected'; applyFilters()"
                      class="w-4 h-4"/>
                    <span>Ревью провалено</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1">
            <!-- Tabs -->
            <div class="border-b-2 border-amber-200 mb-6">
              <div class="flex gap-2">
                <button
                  (click)="onTabChange('pending')"
                  [class]="activeTab === 'pending' ? 'border-2 border-amber-600 bg-amber-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-amber-400'"
                  class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                  Ожидают проверки {{ getTabCount('pending') }}
                </button>
                <button
                  (click)="onTabChange('archive')"
                  [class]="activeTab === 'archive' ? 'border-2 border-amber-600 bg-amber-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-amber-400'"
                  class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                  Архив {{ getTabCount('archive') }}
                </button>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="mb-6">
              <input
                type="text"
                [(ngModel)]="searchText"
                (ngModelChange)="onSearchChange()"
                class="w-full border-2 border-black p-3"
                placeholder="Поиск решений..."/>
            </div>

            <!-- Loading State -->
            <div *ngIf="loading" class="text-center py-16 text-gray-500">
              <div class="text-4xl mb-4">⏳</div>
              <p class="text-lg">Загрузка решений...</p>
            </div>

            <!-- Pending Solutions -->
            <div *ngIf="!loading && activeTab === 'pending'" class="space-y-4">
              <div *ngFor="let solution of filteredPendingSolutions"
                   class="border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all cursor-pointer"
                   (click)="openSolutionModal(solution)">
                <div class="mb-3">
                  <h3 class="font-bold text-lg mb-1">{{ solution.assignment.name }}</h3>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <app-tech-chip *ngFor="let tech of solution.assignment.technologies" [name]="tech.name"></app-tech-chip>
                  </div>
                  <p class="text-sm mb-2">
                    <span class="font-bold">КОМПАНИЯ:</span> {{ solution.assignment.employer.name }}
                  </p>
                  <p class="text-sm mb-2">
                    <span class="font-bold">ВЛАДЕЛЕЦ:</span> {{ solution.candidateOwner.surname }} {{ solution.candidateOwner.name }}
                  </p>
                  <p class="text-sm mb-2">
                    <span class="font-bold">ДЕДЛАЙН:</span> {{ solution.assignment.deadLine | date:'dd.MM.yyyy' }}
                  </p>
                  <p class="text-sm mb-2" *ngIf="solution.team">
                    <span class="font-bold">КОМАНДА:</span> {{ solution.team.name }} ({{ solution.candidates.length }} чел.)
                  </p>
                  <p class="text-sm mb-2" *ngIf="solution.assignment.isGrouped">
                    <span class="font-bold">ПРОЕКТ:</span> ГРУППОВОЙ
                  </p>
                  <p class="text-sm mb-2" *ngIf="!solution.assignment.isGrouped">
                    <span class="font-bold">ПРОЕКТ:</span> ИНДИВИДУАЛЬНЫЙ
                  </p>
                </div>
              </div>
              <div *ngIf="filteredPendingSolutions.length === 0" class="text-center py-16 text-gray-500">
                <div class="text-4xl mb-4">✓</div>
                <p class="text-lg">Нет решений, ожидающих проверки</p>
              </div>
            </div>

            <!-- Archive Solutions -->
            <div *ngIf="!loading && activeTab === 'archive'" class="space-y-4">
              <div *ngFor="let solution of filteredArchiveSolutions"
                   [class]="solution.state === 'Done' ? 'border-2 border-emerald-400 bg-white p-6 hover:shadow-lg transition-all cursor-pointer' : 'border-2 border-red-400 bg-white p-6 hover:shadow-lg transition-all cursor-pointer'"
                   (click)="openSolutionModal(solution)">
                <div class="mb-3">
                  <h3 class="font-bold text-lg mb-1">{{ solution.assignment.name }}</h3>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <app-tech-chip *ngFor="let tech of solution.assignment.technologies" [name]="tech.name"></app-tech-chip>
                  </div>
                  <p class="text-sm mb-2">
                    <span class="font-bold">КОМПАНИЯ:</span> {{ solution.assignment.employer.name }}
                  </p>
                  <p class="text-sm mb-2">
                    <span class="font-bold">ВЛАДЕЛЕЦ:</span> {{ solution.candidateOwner.surname }} {{ solution.candidateOwner.name }}
                  </p>
                  <p class="text-sm mb-2">
                    <span class="font-bold">ДЕДЛАЙН:</span> {{ solution.assignment.deadLine | date:'dd.MM.yyyy' }}
                  </p>
                  <p class="text-sm mb-2" *ngIf="solution.team">
                    <span class="font-bold">КОМАНДА:</span> {{ solution.team.name }} ({{ solution.candidates.length }} чел.)
                  </p>
                  <p class="text-sm mb-2" *ngIf="solution.assignment.isGrouped">
                    <span class="font-bold">ПРОЕКТ:</span> ГРУППОВОЙ
                  </p>
                  <p class="text-sm mb-2" *ngIf="!solution.assignment.isGrouped">
                    <span class="font-bold">ПРОЕКТ:</span> ИНДИВИДУАЛЬНЫЙ
                  </p>
                  <div class="mt-3">
                    <span *ngIf="solution.state === 'Done'" class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase border border-emerald-300">
                      ✓ ПРИНЯТО
                    </span>
                    <span *ngIf="solution.state === 'Rejected'" class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase border border-red-300">
                      ✗ ОТКЛОНЕНО
                    </span>
                  </div>
                </div>
              </div>
              <div *ngIf="filteredArchiveSolutions.length === 0" class="text-center py-16 text-gray-500">
                <div class="text-4xl mb-4">📁</div>
                <p class="text-lg">Архив пуст</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Solution Detail Modal -->
        <div *ngIf="showSolutionModal && selectedSolution" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeSolutionModal()">
          <div class="bg-white border-2 border-amber-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold text-amber-600 uppercase">{{ selectedSolution.assignment.name }}</h2>
              <button (click)="closeSolutionModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <!-- Technologies -->
            <div class="flex flex-wrap gap-2 mb-4">
              <app-tech-chip *ngFor="let tech of selectedSolution.assignment.technologies" [name]="tech.name"></app-tech-chip>
            </div>

            <!-- Info Bar -->
            <div class="flex flex-wrap gap-4 mb-4 text-sm">
              <div>
                <span class="font-bold">КОМПАНИЯ:</span> {{ selectedSolution.assignment.employer.name }}
              </div>
              <div>
                <span class="font-bold">ДЕДЛАЙН:</span> {{ selectedSolution.assignment.deadLine | date:'dd.MM.yyyy' }}
              </div>
            </div>

            <!-- Repository Link -->
            <div *ngIf="selectedSolution.assignment.templateUrl" class="mb-4">
              <a
                [href]="selectedSolution.assignment.templateUrl"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:underline">
                🔗 РЕПОЗИТОРИЙ: {{ selectedSolution.assignment.templateUrl }}
              </a>
            </div>

            <!-- Solution Link -->
            <div *ngIf="selectedSolution.solutionUrl" class="mb-4">
              <a
                [href]="selectedSolution.solutionUrl"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline">
                🔗 РЕШЕНИЕ: {{ selectedSolution.solutionUrl }}
              </a>
            </div>

            <!-- Days Remaining -->
            <div class="border-2 border-amber-300 bg-amber-50 p-4 mb-6 text-center">
              <span class="font-bold text-lg" [class]="getDaysRemaining(selectedSolution.assignment.deadLine) < 0 ? 'text-red-600' : 'text-amber-600'">
                ОСТАЛОСЬ ДНЕЕЙ: {{ getDaysRemaining(selectedSolution.assignment.deadLine) }}
              </span>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="font-bold text-lg mb-2 uppercase">ОПИСАНИЕ ПРОЕКТА</h3>
              <p class="text-gray-700 whitespace-pre-line">{{ selectedSolution.assignment.description }}</p>
            </div>

            <!-- Team Info for Group Projects -->
            <div *ngIf="selectedSolution.assignment.isGrouped" class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
              <h3 class="font-bold text-lg mb-3 uppercase text-amber-800">
                📋 КОМАНДА ({{ selectedSolution.candidates?.length || 0 }} / {{ selectedSolution.assignment.candidatesCapacity }} чел.)
              </h3>

              <!-- Team Name -->
              <div *ngIf="selectedSolution.team" class="mb-4">
                <p class="text-sm font-bold uppercase">НАЗВАНИЕ КОМАНДЫ:</p>
                <p class="text-lg">{{ selectedSolution.team.name }}</p>
                <p *ngIf="selectedSolution.team.description" class="text-sm text-gray-600 mt-1">{{ selectedSolution.team.description }}</p>
              </div>

              <!-- Team Members -->
              <div class="mb-4">
                <p class="text-sm font-bold uppercase mb-3">УЧАСТНИКИ КОМАНДЫ:</p>
                <div class="space-y-3">
                  <div *ngFor="let member of selectedSolution.candidates" class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {{ member.surname.charAt(0) }}{{ member.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold">{{ member.surname }} {{ member.name }}{{ member.patronymic ? ' ' + member.patronymic : '' }}</p>
                      <p class="text-xs text-gray-500">{{ member.id === selectedSolution.candidateOwner.id ? 'Владелец' : 'Участник' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Project Info -->
            <div *ngIf="!selectedSolution.assignment.isGrouped" class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
              <h3 class="font-bold text-lg uppercase text-amber-800">
                👤 ИНДИВИДУАЛЬНЫЙ ПРОЕКТ
              </h3>
              <div class="flex items-center gap-3 mt-3">
                <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ selectedSolution.candidateOwner.surname.charAt(0) }}{{ selectedSolution.candidateOwner.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold">{{ selectedSolution.candidateOwner.surname }} {{ selectedSolution.candidateOwner.name }}</p>
                  <p class="text-xs text-gray-500">{{ selectedSolution.candidateOwner.city || 'Город не указан' }}</p>
                </div>
              </div>
            </div>

            <!-- Review Form (only for pending solutions) -->
            <div *ngIf="activeTab === 'pending'" class="mb-6 border-2 border-amber-400 bg-amber-50 p-6">
              <h3 class="font-bold text-lg mb-4 uppercase text-amber-700">РЕЗУЛЬТАТЫ ПРОВЕРКИ</h3>

              <div class="space-y-4">
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">КОММЕНТАРИЙ ЭКСПЕРТА</label>
                  <textarea
                    [(ngModel)]="expertComment"
                    class="w-full border-2 border-black p-3 text-sm min-h-[150px]"
                    placeholder="Напишите ваш комментарии к решению..."></textarea>
                </div>

                <div class="flex gap-3">
                  <button
                    (click)="submitReview('Done')"
                    [disabled]="submittingReview || !expertComment.trim()"
                    class="flex-1 border-2 border-emerald-600 bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ submittingReview ? 'ОТПРАВКА...' : '✓ ПРИНЯТЬ' }}
                  </button>
                  <button
                    (click)="submitReview('Rejected')"
                    [disabled]="submittingReview || !expertComment.trim()"
                    class="flex-1 border-2 border-red-600 bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ submittingReview ? 'ОТПРАВКА...' : '✗ ОТКЛОНИТЬ' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Archive Info -->
            <div *ngIf="activeTab === 'archive'" class="mt-6 border-2 p-4" [class]="selectedSolution.state === 'Done' ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'">
              <h3 class="font-bold text-lg mb-4 uppercase" [class]="selectedSolution.state === 'Done' ? 'text-emerald-700' : 'text-red-700'">СТАТУС РЕШЕНИЯ</h3>
              <div *ngIf="selectedSolution.state === 'Done'" class="flex items-center gap-3 text-emerald-700">
                <span class="text-2xl">✓</span>
                <span class="font-bold text-lg">РЕШЕНИЕ ПРИНЯТО</span>
              </div>
              <div *ngIf="selectedSolution.state === 'Rejected'" class="flex items-center gap-3 text-red-700">
                <span class="text-2xl">✗</span>
                <span class="font-bold text-lg">РЕШЕНИЕ ОТКЛОНЕНО</span>
              </div>

              <!-- Expert Info -->
              <div *ngIf="selectedSolution.expert" class="mt-4 pt-4 border-t-2" [class]="selectedSolution.state === 'Done' ? 'border-emerald-200' : 'border-red-200'">
                <p class="text-xs font-bold uppercase tracking-wider mb-2" [class]="selectedSolution.state === 'Done' ? 'text-emerald-600' : 'text-red-600'">ЭКСПЕРТ:</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ selectedSolution.expert.surname.charAt(0) }}{{ selectedSolution.expert.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ selectedSolution.expert.surname }} {{ selectedSolution.expert.name }}{{ selectedSolution.expert.patronymic ? ' ' + selectedSolution.expert.patronymic : '' }}</p>
                  </div>
                </div>
              </div>

              <!-- Expert Review Comment -->
              <div *ngIf="selectedSolution.expertReview" class="mt-4 pt-4 border-t-2" [class]="selectedSolution.state === 'Done' ? 'border-emerald-200' : 'border-red-200'">
                <p class="text-xs font-bold uppercase tracking-wider mb-2" [class]="selectedSolution.state === 'Done' ? 'text-emerald-600' : 'text-red-600'">КОММЕНТАРИЙ ЭКСПЕРТА:</p>
                <div class="border-2 bg-white p-4" [class]="selectedSolution.state === 'Done' ? 'border-emerald-300' : 'border-red-300'">
                  <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ selectedSolution.expertReview }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 mt-auto pt-6 border-t-2">
              <button
                (click)="closeSolutionModal()"
                class="flex-1 border-2 border-gray-400 px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-400 hover:text-white transition-colors">
                ЗАКРЫТЬ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpertDashboardPage implements OnInit {
  activeTab: 'pending' | 'archive' = 'pending';
  loading = false;
  submittingReview = false;

  // Search and filters
  searchText = '';
  projectTypeFilter: 'all' | 'group' | 'individual' = 'all';
  reviewStatusFilter: 'all' | 'done' | 'rejected' = 'all';

  pendingSolutions: SolutionFullInfo[] = [];
  archiveSolutions: SolutionFullInfo[] = [];

  // Filtered solutions
  get filteredPendingSolutions(): SolutionFullInfo[] {
    return this.pendingSolutions.filter(s => this.matchesFilters(s));
  }

  get filteredArchiveSolutions(): SolutionFullInfo[] {
    return this.archiveSolutions.filter(s => this.matchesFilters(s));
  }

  showSolutionModal = false;
  selectedSolution: SolutionFullInfo | null = null;
  expertComment = '';

  constructor(
    private authService: AuthService,
    private solutionsService: SolutionsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSolutions();
  }

  matchesFilters(solution: SolutionFullInfo): boolean {
    // Project type filter
    if (this.projectTypeFilter === 'group' && !solution.assignment.isGrouped) {
      return false;
    }
    if (this.projectTypeFilter === 'individual' && solution.assignment.isGrouped) {
      return false;
    }

    // Review status filter (only for archive)
    if (this.activeTab === 'archive') {
      if (this.reviewStatusFilter === 'done' && solution.state !== 'Done') {
        return false;
      }
      if (this.reviewStatusFilter === 'rejected' && solution.state !== 'Rejected') {
        return false;
      }
    }

    return true;
  }

  onSearchChange(): void {
    this.loadSolutions();
  }

  async loadSolutions(): Promise<void> {
    this.loading = true;

    try {
      // Load pending solutions (ExpertReview)
      const pendingRequest: SolutionSearchRequest = {
        take: 100,
        skip: 0,
        text: this.searchText || undefined
      };

      const pendingResponse = await this.solutionsService.searchSolutions(pendingRequest).toPromise();
      this.pendingSolutions = (pendingResponse?.items || []).filter(
        s => s.state === 'ExpertReview'
      );

      // Load archive solutions (Done and Rejected)
      const archiveRequest: SolutionSearchRequest = {
        take: 100,
        skip: 0,
        text: this.searchText || undefined
      };

      const archiveResponse = await this.solutionsService.searchSolutions(archiveRequest).toPromise();
      this.archiveSolutions = (archiveResponse?.items || []).filter(
        s => s.state === 'Done' || s.state === 'Rejected'
      );
    } catch (error) {
      console.error('Error loading solutions:', error);
      this.notificationService.error('Ошибка загрузки решений');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  applyFilters(): void {
    this.cdr.markForCheck();
  }

  getTabCount(tab: 'pending' | 'archive'): number {
    if (tab === 'pending') {
      return this.pendingSolutions.length;
    }
    return this.archiveSolutions.length;
  }

  onTabChange(tab: 'pending' | 'archive'): void {
    this.activeTab = tab;
    this.loadSolutions();
  }

  openSolutionModal(solution: SolutionFullInfo): void {
    this.selectedSolution = solution;
    this.showSolutionModal = true;
    this.expertComment = '';
    this.cdr.markForCheck();
  }

  closeSolutionModal(): void {
    this.showSolutionModal = false;
    this.selectedSolution = null;
    this.expertComment = '';
    this.cdr.markForCheck();
  }

  getDaysRemaining(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async submitReview(state: 'Done' | 'Rejected'): Promise<void> {
    if (!this.selectedSolution) {
      return;
    }

    this.submittingReview = true;

    try {
      await this.solutionsService.submitReview(this.selectedSolution.id, {
        review: this.expertComment,
        resultState: state
      }).toPromise();

      if (state === 'Done') {
        this.notificationService.success('Решение принято');
      } else {
        this.notificationService.success('Решение отклонено');
      }

      // Сначала закрываем модалку
      this.closeSolutionModal();
      // Затем перезагружаем данные
      await this.loadSolutions();
    } catch (error) {
      console.error('Error submitting review:', error);
      this.notificationService.error('Ошибка отправки ревью');
    } finally {
      this.submittingReview = false;
      this.cdr.markForCheck();
    }
  }
}
