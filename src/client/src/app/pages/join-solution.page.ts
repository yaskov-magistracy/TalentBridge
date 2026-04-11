import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AuthService, SolutionsService } from '../core';
import { SolutionFullInfo, SolutionSearchRequest } from '../core/models/api.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-join-solution',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    TechChipComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <app-navbar [role]="'candidate'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold uppercase text-indigo-600">ПРИСОЕДИНИТЬСЯ К КОМАНДЕ</h1>
          <button
            (click)="goBack()"
            class="border-2 border-indigo-600 px-6 py-2 hover:bg-indigo-600 hover:text-white transition-colors font-bold uppercase text-sm">
            ← НАЗАД
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
          <input
            type="text"
            [(ngModel)]="searchText"
            (ngModelChange)="onSearch()"
            class="w-full border-2 border-black p-3"
            placeholder="Поиск заданий..."/>
        </div>

        <!-- Tabs -->
        <div class="border-b-2 border-indigo-200 mb-6">
          <div class="flex gap-2">
            <button
              (click)="activeTab = 'search'"
              [class]="activeTab === 'search' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
              class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
              Поиск {{ getTabCount('search') }}
            </button>
            <button
              (click)="activeTab = 'pending'"
              [class]="activeTab === 'pending' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
              class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
              Ожидают подтверждения {{ getTabCount('pending') }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div *ngIf="activeTab === 'search'">
          <!-- Loading Indicator -->
          <div *ngIf="loadingSearch" class="text-center py-12 text-gray-500">
            Загрузка...
          </div>

          <!-- Solutions List -->
          <div *ngIf="!loadingSearch" class="space-y-4">
            <div *ngFor="let solution of searchResults" [class]="solution.assignment.isGrouped ? 'border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all' : 'border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all'">
              <div class="flex justify-between items-start gap-4">
                <div (click)="openSolutionModal(solution)" class="cursor-pointer flex-1">
                  <div class="mb-3">
                    <h3 class="font-bold text-lg mb-1">{{ solution.assignment.name }}</h3>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <app-tech-chip *ngFor="let tech of solution.assignment.technologies" [name]="tech.name"></app-tech-chip>
                    </div>
                    <p class="text-sm mb-2">
                      <span class="font-bold">КОМПАНИЯ:</span> {{ solution.assignment.employer.name }}
                    </p>
                    <p class="text-sm mb-2">
                      <span class="font-bold">ДЕДЛАЙН:</span> {{ solution.assignment.deadLine | date:'dd.MM.yyyy' }}
                    </p>
                    <p class="text-sm mb-2" *ngIf="solution.team">
                      <span class="font-bold">КОМАНДА:</span> {{ solution.team.name }}
                    </p>
                    <p class="text-sm mb-3">
                      <span class="font-bold">УЧАСТНИКИ:</span> {{ solution.candidates?.length || 0 }} / {{ solution.assignment.candidatesCapacity }} чел.
                    </p>
                    <!-- Team Members Preview -->
                    <div *ngIf="solution.candidates && solution.candidates.length > 0" class="mb-3">
                      <p class="text-xs font-bold uppercase text-gray-500 mb-2">Участники:</p>
                      <div class="flex gap-2">
                        <div *ngFor="let member of solution.candidates" class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {{ member.surname.charAt(0) }}{{ member.name.charAt(0) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Join Button -->
                <div class="flex-shrink-0">
                  <button
                    (click)="joinSolution(solution)"
                    [disabled]="joiningSolutionId === solution.id"
                    class="border-2 border-emerald-600 bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors font-bold uppercase text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ joiningSolutionId === solution.id ? 'ПРИСОЕДИНЕНИЕ...' : 'ПРИСОЕДИНИТЬСЯ' }}
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="searchResults.length === 0 && !loadingSearch" class="text-center py-12 text-gray-500">
              Доступных решений для присоединения не найдено
            </div>
          </div>
        </div>

        <!-- Pending Requests Tab -->
        <div *ngIf="activeTab === 'pending'">
          <!-- Loading Indicator -->
          <div *ngIf="loadingPending" class="text-center py-12 text-gray-500">
            Загрузка...
          </div>

          <!-- Pending Requests List -->
          <div *ngIf="!loadingPending" class="space-y-4">
            <div *ngFor="let solution of pendingResults" [class]="solution.assignment.isGrouped ? 'border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all' : 'border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all'">
              <div (click)="openSolutionModal(solution)" class="cursor-pointer flex justify-between items-start gap-4">
                <div class="flex-1">
                  <div class="mb-3">
                    <h3 class="font-bold text-lg mb-1">{{ solution.assignment.name }}</h3>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <app-tech-chip *ngFor="let tech of solution.assignment.technologies" [name]="tech.name"></app-tech-chip>
                    </div>
                    <p class="text-sm mb-2">
                      <span class="font-bold">КОМПАНИЯ:</span> {{ solution.assignment.employer.name }}
                    </p>
                    <p class="text-sm mb-2">
                      <span class="font-bold">ДЕДЛАЙН:</span> {{ solution.assignment.deadLine | date:'dd.MM.yyyy' }}
                    </p>
                    <p class="text-sm mb-2" *ngIf="solution.team">
                      <span class="font-bold">КОМАНДА:</span> {{ solution.team.name }}
                    </p>
                    <p class="text-sm mb-3">
                      <span class="font-bold">УЧАСТНИКИ:</span> {{ solution.candidates?.length || 0 }} / {{ solution.assignment.candidatesCapacity }} чел.
                    </p>
                    <!-- Team Members Preview -->
                    <div *ngIf="solution.candidates && solution.candidates.length > 0" class="mb-3">
                      <p class="text-xs font-bold uppercase text-gray-500 mb-2">Участники:</p>
                      <div class="flex gap-2">
                        <div *ngFor="let member of solution.candidates" class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {{ member.surname.charAt(0) }}{{ member.name.charAt(0) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Status Badge -->
                <div class="flex-shrink-0">
                  <div class="border-2 border-amber-400 bg-amber-100 text-amber-700 px-4 py-2 font-bold uppercase text-xs whitespace-nowrap">
                    ОЖИДАНИЕ
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="pendingResults.length === 0 && !loadingPending" class="text-center py-12 text-gray-500">
              У вас нет ожидающих подтверждения запросов
            </div>
          </div>
        </div>

        <!-- Solution Detail Modal -->
        <div *ngIf="showSolutionModal && selectedSolution" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeSolutionModal()">
          <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold text-indigo-600 uppercase">{{ selectedSolution.assignment.name }}</h2>
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
                class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                🔗 РЕПОЗИТОРИЙ: {{ selectedSolution.assignment.templateUrl }}
              </a>
            </div>

            <!-- Days Remaining -->
            <div class="border-2 border-indigo-300 bg-indigo-50 p-4 mb-6 text-center">
              <span class="font-bold text-lg" [class]="getDaysRemaining(selectedSolution.assignment.deadLine) < 0 ? 'text-red-600' : 'text-indigo-600'">
                ОСТАЛОСЬ ДНЕЙ: {{ getDaysRemaining(selectedSolution.assignment.deadLine) }}
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
                📋 КОМАНДА ({{ selectedSolution.candidates.length || 0 }} / {{ selectedSolution.assignment.candidatesCapacity }} чел.)
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
                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {{ member.surname.charAt(0) }}{{ member.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold">{{ member.surname }} {{ member.name }}{{ member.patronymic ? ' ' + member.patronymic : '' }}</p>
                      <p class="text-xs text-gray-500">{{ member.login }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Project Info -->
            <div *ngIf="!selectedSolution.assignment.isGrouped" class="mb-6 border-2 border-indigo-300 bg-indigo-50 p-4">
              <h3 class="font-bold text-lg uppercase text-indigo-800">
                👤 ИНДИВИДУАЛЬНЫЙ ПРОЕКТ
              </h3>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 mt-auto pt-6 border-t-2">
              <button
                *ngIf="activeTab === 'search'"
                (click)="joinSolution(selectedSolution)"
                [disabled]="joiningSolutionId === selectedSolution.id"
                class="flex-1 border-2 border-emerald-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                [class]="joiningSolutionId === selectedSolution.id ? 'bg-gray-300 text-gray-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'">
                {{ joiningSolutionId === selectedSolution.id ? 'ПРИСОЕДИНЕНИЕ...' : 'ПРИСОЕДИНИТЬСЯ' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JoinSolutionPage implements OnInit {
  private authService = inject(AuthService);
  private solutionsService = inject(SolutionsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  activeTab: 'search' | 'pending' = 'search';
  searchText = '';
  searchResults: SolutionFullInfo[] = [];
  pendingResults: SolutionFullInfo[] = [];
  loadingSearch = false;
  loadingPending = false;
  joiningSolutionId: string | null = null;

  // Solution modal
  selectedSolution: SolutionFullInfo | null = null;
  showSolutionModal = false;

  private searchTimeout: any;

  ngOnInit(): void {
    this.loadSearchResults();
    this.loadPendingResults();
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadSearchResults();
      this.loadPendingResults();
    }, 300);
  }

  loadSearchResults(): void {
    this.loadingSearch = true;
    this.cdr.markForCheck();

    const searchRequest: SolutionSearchRequest = {
      text: this.searchText || undefined,
      take: 100,
      skip: 0
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        // Фильтруем только групповые проекты с местом
        this.searchResults = (response.items || []).filter(s =>
          s.assignment.isGrouped &&
          s.candidates.length < s.assignment.candidatesCapacity
        );
        this.loadingSearch = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load search results:', error);
        this.loadingSearch = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadPendingResults(): void {
    this.loadingPending = true;
    this.cdr.markForCheck();

    const currentUserId = this.authService.currentUser()?.userId;
    if (!currentUserId) {
      this.loadingPending = false;
      this.cdr.markForCheck();
      return;
    }

    const searchRequest: SolutionSearchRequest = {
      candidateJoinRequestedId: currentUserId,
      text: this.searchText || undefined,
      take: 100,
      skip: 0
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        this.pendingResults = response.items || [];
        this.loadingPending = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load pending results:', error);
        this.loadingPending = false;
        this.cdr.markForCheck();
      }
    });
  }

  getTabCount(tab: string): number {
    if (tab === 'search') {
      return this.searchResults.length;
    }
    return this.pendingResults.length;
  }

  joinSolution(solution: SolutionFullInfo): void {
    this.joiningSolutionId = solution.id;
    this.cdr.markForCheck();

    this.solutionsService.requestJoinSolution(solution.id).subscribe({
      next: () => {
        this.notificationService.success(`Запрос на присоединение к команде "${solution.assignment.name}" отправлен`);
        this.closeSolutionModal();
        // Перезапрашиваем оба списка
        this.loadSearchResults();
        this.loadPendingResults();
      },
      error: (error) => {
        console.error('Failed to request join:', error);
        const errorMessage = error?.error?.message || error?.message || 'Не удалось отправить запрос. Попробуйте позже.';
        this.notificationService.error(`Ошибка: ${errorMessage}`);
        this.joiningSolutionId = null;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/candidate-dashboard']);
  }

  openSolutionModal(solution: SolutionFullInfo): void {
    this.selectedSolution = solution;
    this.showSolutionModal = true;
  }

  closeSolutionModal(): void {
    this.showSolutionModal = false;
    this.selectedSolution = null;
  }

  getDaysRemaining(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
