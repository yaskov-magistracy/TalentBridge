import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { ReviewProgressComponent } from '../shared/components/review-progress.component';
import { CandidateRanking } from '../core/models/domain.models';
import { getLevelColor } from '../shared/utils/level-colors';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ReviewProgressComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-5xl mx-auto px-8 py-8 relative" *ngIf="candidate; else notFound">
        <a
          [routerLink]="'/candidates-ranking'"
          class="absolute top-0 right-8 text-4xl hover:opacity-70 transition-opacity border-2 border-emerald-600 w-12 h-12 flex items-center justify-center hover:bg-emerald-600 hover:text-white"
          title="Закрыть">
          ×
        </a>

        <!-- Main Profile Card -->
        <div class="border-2 border-emerald-600 bg-white p-8 shadow-xl mt-4">
          <!-- Header Section -->
          <div class="mb-8 pb-8 border-b-2 border-emerald-200">
            <div class="flex justify-between items-start mb-6 gap-6">
              <div>
                <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent uppercase">{{ candidate.name }}</h1>
                <div class="flex items-center gap-4 text-gray-600 mb-3 text-sm flex-wrap">
                  <span>{{ candidate.email }}</span>
                  <span>{{ candidate.city }}</span>
                </div>
                <div class="text-sm bg-gray-100 border border-gray-300 px-3 py-1 inline-block">
                  Последняя активность: {{ candidate.lastActive }}
                </div>
              </div>
              <button class="border-2 border-emerald-600 bg-emerald-600 text-white px-8 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider">
                Связаться
              </button>
            </div>
            <p class="text-gray-600 leading-relaxed">{{ candidate.about }}</p>
          </div>

          <!-- Stats Section -->
          <div class="grid grid-cols-3 gap-6 mb-8 pb-8 border-b-2 border-emerald-200">
            <div class="text-center">
              <p class="text-xs text-gray-500 uppercase font-bold mb-2">Оценка</p>
              <p class="text-4xl font-bold text-amber-600">{{ candidate.rating.toFixed(1) }}</p>
              <p class="text-xs text-gray-500 mt-1">из 5</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 uppercase font-bold mb-2">Завершено</p>
              <p class="text-4xl font-bold text-emerald-600">{{ candidate.completedTasksCount }}</p>
              <p class="text-xs text-gray-500 mt-1">заданий</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 uppercase font-bold mb-2">Процент успеха</p>
              <p class="text-4xl font-bold text-indigo-600">{{ candidate.successRate }}%</p>
              <p class="text-xs text-gray-500 mt-1">(успешных решений)</p>
            </div>
          </div>

          <!-- Skills &Competencies Section -->
          <div class="mb-8 pb-8 border-b-2 border-emerald-200">
            <h2 class="font-bold text-xl mb-4 uppercase text-emerald-600">НАВЫКИ И КОМПЕТЕНЦИИ</h2>
            <div class="flex flex-wrap gap-3">
              <div *ngFor="let skill of candidate.skills" 
                class="px-4 py-2 border-2 font-semibold text-sm uppercase" 
                [ngClass]="getLevelColor(skill.level)">
                {{ skill.name }} • {{ skill.level }}
              </div>
            </div>
          </div>

          <!-- Completed Tasks Section -->
          <div class="mb-8 pb-8 border-b-2 border-emerald-200">
            <h2 class="font-bold text-xl mb-3 uppercase text-emerald-600">Выполненные задания ({{ candidate.completedTasksCount }})</h2>
            <div class="border-2 border-emerald-400 bg-white">
              <div class="space-y-0">
                <a
                  *ngFor="let submission of candidate.submissions"
                  [routerLink]="['/submission', submission.id]"
                  class="p-4 border-b-2 border-emerald-200 last:border-b-0 flex items-center gap-4 hover:bg-emerald-50 transition-colors block">
                  <div class="w-10 h-10 border-2 border-emerald-600 bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 text-xl">
                    ✓
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 block mb-1">{{ submission.taskTitle }}</span>
                    <span class="text-xs text-gray-500">Нажмите, чтобы посмотреть обратную связь эксперта</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Submission History Section -->
          <div>
            <h2 class="font-bold text-xl mb-4 uppercase text-emerald-600">История решений</h2>
            <div class="space-y-4">
              <div *ngFor="let submission of candidate.submissions" class="border-2 border-indigo-400 bg-white p-6">
                <h3 class="font-bold text-lg mb-4">{{ submission.taskTitle }}</h3>
                <app-review-progress
                  [autoTests]="submission.status.autoTests"
                  [aiAnalysis]="submission.status.aiAnalysis"
                  [expertReview]="submission.status.expertReview"
                ></app-review-progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="max-w-5xl mx-auto px-8 py-8">
          <div class="bg-white border-2 border-red-600 p-12 text-center">
            <h2 class="text-2xl font-bold mb-4 uppercase">КАНДИДАТ НЕ НАЙДЕН</h2>
            <a [routerLink]="'/employer-dashboard'" class="text-indigo-600 hover:underline">Вернуться на панель</a>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class CandidateProfilePage implements OnInit {
  candidate: CandidateRanking | undefined;

  constructor(
    private repository: TalentBridgeRepository,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const candidateId = this.route.snapshot.paramMap.get('id');
    this.candidate = this.repository.getCandidateById(candidateId);
  }

  getLevelColor(level: 'начинающий' | 'базовый' | 'опытный'): string {
    return getLevelColor(level);
  }
}
