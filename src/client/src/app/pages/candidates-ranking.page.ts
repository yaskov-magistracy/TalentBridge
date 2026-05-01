import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CandidatesService, SolutionsService, TechnologiesService } from '../core';
import { CandidateFullInfo, CandidateSearchResponse, Technology } from '../core/models/api.models';
import { NavbarComponent } from '../shared/components/navbar.component';

interface CandidateRankingItem extends CandidateFullInfo {
  completedTasksCount: number;
  medalsCount: number;
}

@Component({
  selector: 'app-candidates-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold uppercase text-emerald-600 mb-2">Рейтинг кандидатов</h1>
            <p class="text-gray-600">Лучшие разработчики платформы TalentBridge</p>
          </div>
          <a [routerLink]="'/employer-dashboard'" class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2 bg-white">
            <span class="text-xl leading-none">×</span>
            Закрыть
          </a>
        </div>

        <div class="bg-white border-2 border-emerald-600 p-6 mb-6 shadow-md">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">Фильтр по навыку</label>
              <select
                [(ngModel)]="selectedTechnologyId"
                (ngModelChange)="loadCandidates()"
                class="w-full border-2 border-black p-3 bg-white">
                <option value="">Все навыки</option>
                <option *ngFor="let technology of technologies" [value]="technology.id">{{ technology.name }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">Сортировка</label>
              <select class="w-full border-2 border-black p-3 bg-white" [ngModel]="'rating'" disabled>
                <option value="rating">По рейтингу</option>
              </select>
            </div>
          </div>
        </div>

        <div *ngIf="isLoading" class="border-2 border-emerald-300 bg-white p-8 text-center font-bold uppercase text-emerald-700">
          Загрузка рейтинга...
        </div>

        <div *ngIf="!isLoading && errorMessage" class="border-2 border-red-400 bg-red-50 p-6 text-red-700 font-semibold">
          {{ errorMessage }}
        </div>

        <div *ngIf="!isLoading && !errorMessage" class="space-y-4">
          <a
            *ngFor="let candidate of candidates; let index = index"
            [routerLink]="['/candidate', candidate.id]"
            class="block bg-white border-2 border-emerald-400 p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            <div class="flex gap-6 flex-wrap">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                #{{ index + 1 }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-3 flex-wrap gap-4">
                  <div>
                    <h3 class="text-2xl font-bold mb-1 uppercase">{{ getCandidateName(candidate) }}</h3>
                    <div *ngIf="candidate.city" class="text-sm text-gray-600 flex items-center gap-1">
                      <span aria-hidden="true">⌖</span>
                      {{ candidate.city }}
                    </div>
                  </div>

                  <div class="flex gap-6 text-center flex-wrap">
                    <div>
                      <div class="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                        <span aria-hidden="true">★</span>
                        {{ formatRating(candidate.rating) }}
                      </div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Рейтинг</p>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        {{ candidate.completedTasksCount }}
                      </div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Решено</p>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                        </svg>
                        {{ candidate.medalsCount }}
                      </div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Медалей</p>
                    </div>
                  </div>
                </div>

                <p *ngIf="candidate.about" class="text-gray-700 mb-4 leading-relaxed text-sm">{{ candidate.about }}</p>

                <div *ngIf="candidate.technologies?.length" class="mb-2">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Навыки</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      *ngFor="let technology of candidate.technologies"
                      class="px-3 py-1 border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-sm">
                      {{ technology.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        <div *ngIf="!isLoading && !errorMessage && candidates.length === 0" class="border-2 border-gray-400 bg-gray-50 p-8 text-center">
          <p class="text-gray-600 font-bold uppercase">Кандидаты не найдены</p>
        </div>
      </div>
    </div>
  `
})
export class CandidatesRankingPage implements OnInit {
  private readonly candidatesService = inject(CandidatesService);
  private readonly solutionsService = inject(SolutionsService);
  private readonly technologiesService = inject(TechnologiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  candidates: CandidateRankingItem[] = [];
  technologies: Technology[] = [];
  selectedTechnologyId = '';
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTechnologies();
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.candidatesService.searchCandidates({
      take: 100,
      skip: 0,
      technologiesIds: this.selectedTechnologyId ? [this.selectedTechnologyId] : null,
      ordering: {
        field: 'Rating',
        direction: 'Descending'
      }
    }).subscribe({
      next: (response) => {
        const candidates = this.normalizeCandidatesResponse(response);

        if (candidates.length === 0) {
          this.candidates = [];
          this.isLoading = false;
          this.cdr.markForCheck();
          return;
        }

        forkJoin(candidates.map(candidate => this.enrichCandidate(candidate))).subscribe({
          next: (items) => {
            this.candidates = items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.candidates = candidates.map(candidate => ({
              ...candidate,
              completedTasksCount: 0,
              medalsCount: candidate.medalsCount ?? 0
            }));
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить рейтинг кандидатов.';
        this.candidates = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getCandidateName(candidate: CandidateFullInfo): string {
    const nameParts = [candidate.surname, candidate.name, candidate.patronymic]
      .filter((part): part is string => Boolean(part));

    return nameParts.length > 0 ? nameParts.join(' ') : candidate.login || 'Кандидат';
  }

  formatRating(rating: number | null | undefined): string {
    return Number(rating ?? 0).toFixed(1);
  }

  private loadTechnologies(): void {
    this.technologiesService.searchTechnologies({ take: 1000, skip: 0 }).subscribe({
      next: (response) => {
        this.technologies = response.items || [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.technologies = [];
        this.cdr.markForCheck();
      }
    });
  }

  private enrichCandidate(candidate: CandidateFullInfo) {
    return forkJoin({
      completedTasksCount: this.solutionsService.searchSolutions({
        candidateId: candidate.id,
        state: 'Done',
        take: 1,
        skip: 0
      }).pipe(
        map(response => response.totalCount ?? response.items?.length ?? 0),
        catchError(() => of(0))
      ),
      medalsCount: typeof candidate.medalsCount === 'number'
        ? of(candidate.medalsCount)
        : this.solutionsService.searchSolutions({
            candidateId: candidate.id,
            hasMedal: true,
            take: 1,
            skip: 0
          }).pipe(
            map(response => response.totalCount ?? response.items?.length ?? 0),
            catchError(() => of(0))
          )
    }).pipe(
      map(stats => ({
        ...candidate,
        completedTasksCount: stats.completedTasksCount,
        medalsCount: stats.medalsCount
      }))
    );
  }

  private normalizeCandidatesResponse(response: CandidateSearchResponse | CandidateFullInfo[]): CandidateFullInfo[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.items || [];
  }
}
