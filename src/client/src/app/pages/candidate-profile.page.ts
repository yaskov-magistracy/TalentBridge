import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CandidatesService, SolutionsService } from '../core';
import { CandidateFullInfo, ExpertReviewInSolution, SolutionFullInfo } from '../core/models/api.models';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, TechChipComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-6xl mx-auto px-8 py-8">
        <div *ngIf="isLoading" class="border-2 border-emerald-300 bg-white p-8 text-center font-bold uppercase text-emerald-700">
          Загрузка профиля...
        </div>

        <div *ngIf="!isLoading && errorMessage" class="bg-white border-2 border-red-600 p-12 text-center">
          <h2 class="text-2xl font-bold mb-4 uppercase">Кандидат не найден</h2>
          <p class="text-red-700 mb-4">{{ errorMessage }}</p>
          <a [routerLink]="'/candidates-ranking'" class="text-indigo-600 hover:underline font-semibold">Вернуться к рейтингу</a>
        </div>

        <div *ngIf="!isLoading && candidate" class="border-2 border-emerald-600 bg-white p-8 shadow-xl">
          <div class="mb-8 pb-8 border-b-2 border-emerald-200">
            <div class="flex justify-between items-start mb-6 gap-6 flex-wrap">
              <div>
                <h1 class="text-4xl font-bold mb-3 text-slate-900">{{ getCandidateName(candidate) }}</h1>
                <div class="flex items-center gap-4 text-gray-600 mb-3 text-sm flex-wrap">
                  <span *ngIf="candidate.login" class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M4 4h16v16H4z" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                    {{ candidate.login }}
                  </span>
                  <span *ngIf="candidate.city" class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                    {{ candidate.city }}
                  </span>
                </div>
              </div>

              <div class="flex gap-3 flex-wrap justify-end">
                <a
                  [routerLink]="'/candidates-ranking'"
                  class="border-2 border-gray-300 bg-white text-gray-700 px-5 py-3 hover:border-emerald-600 hover:text-emerald-700 transition-colors font-bold uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  Закрыть
                </a>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="border-2 border-amber-300 bg-amber-50 p-6 text-center">
                <div class="text-3xl font-bold text-amber-600 flex items-center justify-center gap-2">
                  <span aria-hidden="true">★</span>
                  {{ formatRating(candidate.rating) }}
                </div>
                <p class="text-sm text-gray-600 mt-2">Рейтинг платформы</p>
              </div>

              <div class="border-2 border-cyan-400 bg-cyan-50 p-6 text-center">
                <div class="text-3xl font-bold text-cyan-600 flex items-center justify-center gap-2">
                  {{ formatSuccessRate(candidate.successRate) }}%
                </div>
                <p class="text-sm text-cyan-700 mt-2 font-bold uppercase">Успешность</p>
              </div>

              <div class="border-2 border-emerald-400 bg-emerald-50 p-6 text-center">
                <div class="text-3xl font-bold text-emerald-600 flex items-center justify-center gap-2">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  {{ completedSolutions.length }}
                </div>
                <p class="text-sm text-emerald-700 mt-2 font-bold uppercase">Выполнено заданий</p>
              </div>

              <div class="border-2 border-indigo-400 bg-indigo-50 p-6 text-center">
                <div class="text-3xl font-bold text-indigo-600 flex items-center justify-center gap-2">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                  {{ candidate.medalsCount || 0 }}
                </div>
                <p class="text-sm text-indigo-700 mt-2 font-bold uppercase">Медалей</p>
              </div>
            </div>
          </div>

          <section *ngIf="candidate.about" class="mb-8">
            <h2 class="font-bold text-xl mb-4 uppercase text-emerald-600">О кандидате</h2>
            <div class="border-2 border-gray-300 bg-slate-50 p-6">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ candidate.about }}</p>
            </div>
          </section>

          <section *ngIf="candidate.technologies?.length" class="mb-8">
            <h2 class="font-bold text-xl mb-4 uppercase text-emerald-600">Навыки и компетенции</h2>
            <div class="border-2 border-emerald-400 bg-emerald-50 p-6">
              <div class="flex flex-wrap gap-3">
                <app-tech-chip *ngFor="let technology of candidate.technologies" [name]="technology.name"></app-tech-chip>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-end justify-between gap-4 mb-4 border-b-4 border-emerald-500 pb-3">
              <h2 class="font-bold text-xl uppercase text-emerald-600">Выполненные задания ({{ completedSolutions.length }})</h2>
            </div>

            <div class="space-y-4">
              <div
                *ngFor="let solution of completedSolutions"
                (click)="openSolutionModal(solution)"
                [class]="getSolutionCardClass(solution)">
                <div class="flex justify-between items-start gap-4 flex-wrap">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-lg mb-2">{{ solution.assignment.name }}</h3>

                    <div *ngIf="solution.assignment.technologies.length" class="flex flex-wrap gap-2 mb-3">
                      <app-tech-chip *ngFor="let tech of solution.assignment.technologies" [name]="tech.name"></app-tech-chip>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                      <p>
                        <span class="font-bold uppercase">Компания:</span>
                        {{ solution.assignment.employer.name }}
                      </p>
                      <p>
                        <span class="font-bold uppercase">Дедлайн:</span>
                        {{ solution.assignment.deadLine | date:'dd.MM.yyyy' }}
                      </p>
                      <p *ngIf="solution.team">
                        <span class="font-bold uppercase">Команда:</span>
                        {{ solution.team.name }}
                      </p>
                      <p>
                        <span class="font-bold uppercase">Проект:</span>
                        {{ solution.assignment.isGrouped ? 'Групповой' : 'Индивидуальный' }}
                      </p>
                      <p *ngIf="solution.assignment.isGrouped">
                        <span class="font-bold uppercase">Участники:</span>
                        {{ solution.candidates.length }} / {{ solution.assignment.candidatesCapacity }} чел.
                      </p>
                    </div>

                    <p *ngIf="solution.assignment.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
                      {{ solution.assignment.description }}
                    </p>

                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase border border-emerald-300">
                        <span aria-hidden="true">✓</span>
                        Ревью пройдено
                      </span>
                      <span *ngIf="solution.medalGrantedAt" class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase border border-amber-300">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                        </svg>
                        Медаль
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="completedSolutions.length === 0" class="border-2 border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                Выполненных заданий пока нет
              </div>
            </div>
          </section>
        </div>

        <!-- Solution Detail Modal -->
        <div *ngIf="showSolutionModal && selectedSolution" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeSolutionModal()">
          <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold text-indigo-600 uppercase">{{ selectedSolution.assignment.name }}</h2>
              <button (click)="closeSolutionModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <div *ngIf="selectedSolution.assignment.technologies.length" class="flex flex-wrap gap-2 mb-4">
              <app-tech-chip *ngFor="let tech of selectedSolution.assignment.technologies" [name]="tech.name"></app-tech-chip>
            </div>

            <div class="flex flex-wrap gap-4 mb-4 text-sm">
              <div>
                <span class="font-bold">КОМПАНИЯ:</span> {{ selectedSolution.assignment.employer.name }}
              </div>
              <div>
                <span class="font-bold">ДЕДЛАЙН:</span> {{ selectedSolution.assignment.deadLine | date:'dd.MM.yyyy' }}
              </div>
            </div>

            <div *ngIf="selectedSolution.assignment.templateUrl" class="mb-4">
              <a
                [href]="selectedSolution.assignment.templateUrl"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                🔗 РЕПОЗИТОРИЙ: {{ selectedSolution.assignment.templateUrl }}
              </a>
            </div>

            <div class="border-2 border-indigo-300 bg-indigo-50 p-4 mb-6 text-center">
              <span class="font-bold text-lg" [class]="getDaysRemaining(selectedSolution.assignment.deadLine) < 0 ? 'text-red-600' : 'text-indigo-600'">
                ОСТАЛОСЬ ДНЕЙ: {{ getDaysRemaining(selectedSolution.assignment.deadLine) }}
              </span>
            </div>

            <div class="mb-6">
              <h3 class="font-bold text-lg mb-3 uppercase">ОПИСАНИЕ ПРОЕКТА</h3>
              <div class="border-2 border-gray-300 p-4 bg-gray-50">
                <p class="text-gray-700 whitespace-pre-line">{{ selectedSolution.assignment.description }}</p>
              </div>
            </div>

            <div *ngIf="selectedSolution.assignment.isGrouped" class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
              <h3 class="font-bold text-lg mb-3 uppercase text-amber-800">
                📋 КОМАНДА ({{ selectedSolution.candidates.length || 0 }} / {{ selectedSolution.assignment.candidatesCapacity }} чел.)
              </h3>

              <div *ngIf="selectedSolution.team" class="mb-4">
                <p class="text-sm font-bold uppercase">НАЗВАНИЕ КОМАНДЫ:</p>
                <p class="text-lg">{{ selectedSolution.team.name }}</p>
                <p *ngIf="selectedSolution.team.description" class="text-sm text-gray-600 mt-1">{{ selectedSolution.team.description }}</p>
              </div>

              <div class="mb-4">
                <p class="text-sm font-bold uppercase mb-3">УЧАСТНИКИ КОМАНДЫ:</p>
                <div class="space-y-3">
                  <div *ngFor="let member of selectedSolution.candidates" class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {{ (member.surname || '').charAt(0) }}{{ (member.name || '').charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold">{{ member.surname }} {{ member.name }}{{ member.patronymic ? ' ' + member.patronymic : '' }}</p>
                      <p class="text-xs text-gray-500">{{ member.login }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!selectedSolution.assignment.isGrouped" class="mb-6 border-2 border-indigo-300 bg-indigo-50 p-4">
              <h3 class="font-bold text-lg uppercase text-indigo-800">
                👤 ИНДИВИДУАЛЬНЫЙ ПРОЕКТ
              </h3>
            </div>

            <div class="mt-2 border-2 p-4" [class]="selectedSolution.state === 'Done' ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'">
              <h4 class="font-bold mb-4 uppercase" [class]="selectedSolution.state === 'Done' ? 'text-emerald-700' : 'text-red-700'">
                РЕЗУЛЬТАТ ПРОВЕРКИ
              </h4>
              <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl" *ngIf="selectedSolution.state === 'Done'">✓</span>
                <span class="text-3xl" *ngIf="selectedSolution.state === 'Failed'">✗</span>
                <span class="font-bold text-lg" [class]="selectedSolution.state === 'Done' ? 'text-emerald-700' : 'text-red-700'">
                  {{ selectedSolution.state === 'Done' ? 'РЕШЕНИЕ ПРИНЯТО' : 'РЕШЕНИЕ ОТКЛОНЕНО' }}
                </span>
                <span *ngIf="selectedSolution.medalGrantedAt" class="text-3xl" aria-label="Медаль">🏅</span>
              </div>
            </div>

            <div *ngIf="shouldShowExpertReviewHistory(selectedSolution)" class="mt-6 border-2 p-4" [class]="getReviewHistoryContainerClass(selectedSolution)">
              <p class="text-xs font-bold uppercase tracking-wider mb-3" [class]="getReviewHistoryTitleClass(selectedSolution)">
                История ревью эксперта:
              </p>
              <div *ngIf="getSortedExpertReviews(selectedSolution).length > 0; else noCandidateExpertReviews" class="space-y-3">
                <div
                  *ngFor="let review of getSortedExpertReviews(selectedSolution)"
                  class="border-2 bg-white p-4"
                  [class]="getReviewHistoryItemClass(selectedSolution)">
                  <div class="flex flex-wrap justify-between gap-3 mb-2 text-xs text-gray-600">
                    <span class="font-bold uppercase">
                      {{ review.expert.surname }} {{ review.expert.name }}{{ review.expert.patronymic ? ' ' + review.expert.patronymic : '' }}
                    </span>
                    <span>{{ review.createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
                  </div>
                  <div class="flex flex-wrap gap-4 mb-3 text-xs font-bold uppercase">
                    <span>Оценка: {{ review.score }}/10</span>
                    <span>Попытка: {{ review.attemptNumber }}</span>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-line">{{ review.comment }}</p>
                </div>
              </div>
              <ng-template #noCandidateExpertReviews>
                <div class="border-2 bg-white p-4" [class]="getReviewHistoryItemClass(selectedSolution)">
                  <p class="text-gray-500 text-sm">История ревью отсутствует</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CandidateProfilePage implements OnInit {
  private readonly candidatesService = inject(CandidatesService);
  private readonly solutionsService = inject(SolutionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  candidate: CandidateFullInfo | null = null;
  completedSolutions: SolutionFullInfo[] = [];
  selectedSolution: SolutionFullInfo | null = null;
  showSolutionModal = false;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const candidateId = this.route.snapshot.paramMap.get('id');

    if (!candidateId) {
      this.errorMessage = 'Не удалось определить кандидата.';
      return;
    }

    this.loadCandidate(candidateId);
    this.loadCompletedSolutions(candidateId);
  }

  getCandidateName(candidate: CandidateFullInfo): string {
    const nameParts = [candidate.surname, candidate.name, candidate.patronymic]
      .filter((part): part is string => Boolean(part));

    return nameParts.length > 0 ? nameParts.join(' ') : candidate.login || 'Кандидат';
  }

  formatRating(rating: number | null | undefined): string {
    return Number(rating ?? 0).toFixed(1);
  }

  formatSuccessRate(successRate: number | null | undefined): string {
    return Number(successRate ?? 0).toFixed(1);
  }

  getSolutionCardClass(solution: SolutionFullInfo): string {
    return solution.assignment.isGrouped
      ? 'border-2 border-amber-400 bg-white p-6 cursor-pointer hover:shadow-lg transition-all'
      : 'border-2 border-indigo-400 bg-white p-6 cursor-pointer hover:shadow-lg transition-all';
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
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSortedExpertReviews(solution: SolutionFullInfo): ExpertReviewInSolution[] {
    return [...(solution.expertReviews ?? [])]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  shouldShowExpertReviewHistory(solution: SolutionFullInfo): boolean {
    return solution.state === 'RequiresImprovements' || solution.state === 'Done' || solution.state === 'Failed';
  }

  getReviewHistoryContainerClass(solution: SolutionFullInfo): string {
    if (solution.state === 'Done') {
      return 'border-emerald-300 bg-emerald-50';
    }
    return 'border-red-300 bg-red-50';
  }

  getReviewHistoryTitleClass(solution: SolutionFullInfo): string {
    if (solution.state === 'Done') {
      return 'text-emerald-600';
    }
    return 'text-red-600';
  }

  getReviewHistoryItemClass(solution: SolutionFullInfo): string {
    if (solution.state === 'Done') {
      return 'border-emerald-300';
    }
    return 'border-red-300';
  }

  private loadCandidate(candidateId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.candidatesService.getCandidate(candidateId).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.candidate = null;
        this.errorMessage = 'Не удалось загрузить данные кандидата.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private loadCompletedSolutions(candidateId: string): void {
    this.solutionsService.searchSolutions({
      candidateId,
      state: 'Done',
      take: 100,
      skip: 0
    }).subscribe({
      next: (response) => {
        this.completedSolutions = response.items || [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.completedSolutions = [];
        this.cdr.markForCheck();
      }
    });
  }
}
