import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { SolutionsService, AssignmentsService } from '../core';
import { SolutionFullInfo, SolutionState, SolutionSearchRequest, AssignmentFullInfo } from '../core/models/api.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-assignment-solutions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, TechChipComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <a
            [routerLink]="'/employer-dashboard'"
            class="text-sm uppercase tracking-wider text-gray-600 hover:text-emerald-600"
          >
            ← Назад к дашборду
          </a>
          <h1 class="text-3xl font-bold mt-4 uppercase text-emerald-600">РЕШЕНИЯ ЗАДАНИЯ</h1>
          <p *ngIf="assignment" class="text-xl font-bold text-gray-800 mt-3">
            {{ assignment.name }}
          </p>
          <p *ngIf="assignment" class="text-sm text-gray-600 mt-1">
            <span class="font-bold uppercase">ДЕДЛАЙН:</span>
            {{ assignment.deadLine | date: 'dd.MM.yyyy' }}
          </p>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-12 text-gray-500">Загрузка решений...</div>

        <!-- Content -->
        <div *ngIf="!loading">
          <!-- Tabs -->
          <div class="border-b-2 border-emerald-200 mb-6">
            <div class="flex gap-2 overflow-x-auto">
              <button
                (click)="onTabChange('notStarted')"
                [class]="
                  activeTab === 'notStarted'
                    ? 'border-2 border-emerald-600 bg-emerald-600 text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-emerald-400'
                "
                class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors"
              >
                Не начаты {{ getTabCount('notStarted') }}
              </button>
              <button
                (click)="onTabChange('inProgress')"
                [class]="
                  activeTab === 'inProgress'
                    ? 'border-2 border-emerald-600 bg-emerald-600 text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-emerald-400'
                "
                class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors"
              >
                В работе {{ getTabCount('inProgress') }}
              </button>
              <button
                (click)="onTabChange('expertReview')"
                [class]="
                  activeTab === 'expertReview'
                    ? 'border-2 border-emerald-600 bg-emerald-600 text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-emerald-400'
                "
                class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors"
              >
                Ожидают проверки эксперта {{ getTabCount('expertReview') }}
              </button>
              <button
                (click)="onTabChange('completed')"
                [class]="
                  activeTab === 'completed'
                    ? 'border-2 border-emerald-600 bg-emerald-600 text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-emerald-400'
                "
                class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors"
              >
                Завершённые {{ getTabCount('completed') }}
              </button>
            </div>
          </div>

          <!-- Solutions List -->
          <div class="space-y-4">
            <div
              *ngFor="let solution of getSolutionsForTab()"
              [class]="
                solution.assignment.isGrouped
                  ? 'border-2 border-amber-400 bg-white p-6 shadow-md'
                  : 'border-2 border-indigo-400 bg-white p-6 shadow-md'
              "
            >
              <div
                class="flex justify-between items-start gap-4"
                [class.cursor-pointer]="activeTab === 'expertReview'"
                (click)="activeTab === 'expertReview' && openSolutionDetailModal(solution)"
              >
                <div class="flex-1">
                  <!-- Solution Header -->
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="font-bold text-lg uppercase">
                      {{ solution.team?.name || 'Индивидуальное решение' }}
                    </h3>
                    <span
                      class="px-2 py-1 text-xs font-bold uppercase"
                      [class]="getStateBadgeClass(solution.state)"
                    >
                      {{ getStateLabel(solution.state) }}
                    </span>
                  </div>

                  <!-- Repository Link (for autotestsAi and expertReview tabs) -->
                  <a
                    *ngIf="solution.solutionUrl && (activeTab === 'autotestsAi' || activeTab === 'expertReview')"
                    [href]="solution.solutionUrl"
                    target="_blank"
                    (click)="$event.stopPropagation()"
                    class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-3"
                  >
                    🔗 Репозиторий решения
                  </a>

                  <!-- Team Members -->
                  <div
                    *ngIf="solution.assignment.isGrouped && solution.team"
                    class="mb-3 p-3 bg-amber-50 border-2 border-amber-200"
                  >
                    <p class="text-xs font-bold uppercase mb-2 text-amber-700">
                      Команда: {{ solution.team.name }}
                    </p>
                    <p *ngIf="solution.team.description" class="text-xs text-gray-600 mb-2">
                      {{ solution.team.description }}
                    </p>
                    <div
                      class="flex flex-wrap gap-3 flex-col"
                      *ngIf="solution.candidates && solution.candidates.length > 0"
                    >
                      <div
                        *ngFor="let member of solution.candidates"
                        [routerLink]="['/candidate', member.id]"
                        (click)="$event.stopPropagation()"
                        class="flex items-center gap-2 cursor-pointer p-1 transition-all hover:bg-white hover:shadow-md"
                      >
                        <div
                          class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        >
                          {{ (member.surname || '').charAt(0) }}{{ (member.name || '').charAt(0) }}
                        </div>
                        <div class="flex items-center gap-1">
                          <span class="text-sm font-semibold"
                            >{{ member.surname }} {{ member.name }}</span
                          >
                          <span
                            *ngIf="member.id === solution.candidateOwner.id"
                            class="text-amber-500"
                            title="Лидер команды"
                            >👑</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Individual Owner -->
                  <div
                    *ngIf="!solution.assignment.isGrouped"
                    class="mb-3 p-3 bg-indigo-50 border-2 border-indigo-200"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      >
                        {{ (solution.candidateOwner.surname || '').charAt(0)
                        }}{{ (solution.candidateOwner.name || '').charAt(0) }}
                      </div>
                      <span class="text-sm font-semibold"
                        >{{ solution.candidateOwner.surname }}
                        {{ solution.candidateOwner.name }}</span
                      >
                    </div>
                  </div>

                  <!-- Technologies -->
                  <div class="flex flex-wrap gap-2 mt-3">
                    <app-tech-chip
                      *ngFor="let tech of solution.assignment.technologies"
                      [name]="tech.name"
                    ></app-tech-chip>
                  </div>

                  <!-- Review Status Badge (for completed tab) -->
                  <div *ngIf="activeTab === 'completed'" class="mt-3">
                    <span
                      *ngIf="solution.state === 'Done'"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase border border-emerald-300"
                    >
                      <span>✓</span> РЕВЬЮ ПРОЙДЕНО
                    </span>
                    <span
                      *ngIf="solution.state === 'Failed'"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase border border-red-300"
                    >
                      <span>✗</span> РЕВЬЮ НЕ ПРОЙДЕНО
                    </span>
                  </div>

                  <!-- Expert Review Comment (for completed tab) -->
                  <div
                    *ngIf="activeTab === 'completed' && getLastExpertReviewComment(solution)"
                    class="mt-3 p-3 border-2 bg-white"
                    [class]="solution.state === 'Done' ? 'border-emerald-300' : 'border-red-300'"
                  >
                    <p
                      class="text-xs font-bold uppercase mb-2"
                      [class]="solution.state === 'Done' ? 'text-emerald-600' : 'text-red-600'"
                    >
                      КОММЕНТАРИЙ ЭКСПЕРТА:
                    </p>
                    <p class="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                      {{ getLastExpertReviewComment(solution) }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 items-end">
                  <div class="text-sm">
                    <span class="font-bold uppercase">Начато:</span>
                    {{ solution.startedAt | date: 'dd.MM.yyyy' }}
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="getSolutionsForTab().length === 0" class="text-center py-12 text-gray-500">
              Решений в этой категории нет
            </div>
          </div>
        </div>
      </div>

      <!-- Review Modal -->
      <div
        *ngIf="showReviewModal && selectedSolution"
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
        (click)="closeReviewModal()"
      >
        <div
          class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-indigo-600 uppercase">ПРОВЕРКА РЕШЕНИЯ</h2>
            <button (click)="closeReviewModal()" class="text-3xl hover:text-red-600 cursor-pointer">
              ×
            </button>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 space-y-6">
            <!-- Solution Info -->
            <div class="border-2 border-gray-300 p-4 bg-gray-50">
              <h3 class="font-bold text-lg mb-2 uppercase">
                {{ selectedSolution.team?.name || 'Индивидуальное решение' }}
              </h3>
              <p class="text-sm">
                <span class="font-bold">КОМПАНИЯ:</span>
                {{ selectedSolution.assignment.employer.name }}
              </p>
              <p class="text-sm">
                <span class="font-bold">НАЧАТО:</span>
                {{ selectedSolution.startedAt | date: 'dd.MM.yyyy' }}
              </p>
            </div>

            <!-- Review Progress -->
            <div class="border-2 border-amber-300 p-4 bg-amber-50">
              <h4 class="font-bold mb-4 uppercase text-amber-700">СТАДИИ ПРОВЕРКИ</h4>
              <div class="flex items-center justify-between mb-4">
                <!-- Autotests -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'Autotests')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'Autotests') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'Autotests')"
                  >
                    {{ selectedSolution.state === 'Autotests' ? '✓ ' : '' }}АВТОТЕСТЫ
                  </div>
                </div>
                <!-- Line -->
                <div
                  class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'Autotests')"
                ></div>
                <!-- AI Review -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'AiReview')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'AiReview') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'AiReview')"
                  >
                    {{ selectedSolution.state === 'AiReview' ? '✓ ' : '' }}AI-АНАЛИЗ
                  </div>
                </div>
                <!-- Line -->
                <div
                  class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'AiReview')"
                ></div>
                <!-- Expert Review -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'ExpertReview')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'ExpertReview') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'ExpertReview')"
                  >
                    {{ selectedSolution.state === 'ExpertReview' ? '✓ ' : '' }}ЭКСПЕРТ
                  </div>
                </div>
              </div>
              <!-- Status Message -->
              <div class="border-l-4 border-amber-500 bg-amber-50 p-3">
                <p class="text-xs font-bold uppercase text-amber-700 mb-1">СТАТУС:</p>
                <p class="text-sm text-amber-900">{{ getStatusMessage(selectedSolution.state) }}</p>
              </div>
            </div>

            <!-- Repository Link -->
            <div
              *ngIf="selectedSolution.solutionUrl"
              class="border-2 border-indigo-300 p-4 bg-indigo-50"
            >
              <h4 class="font-bold mb-2 uppercase text-indigo-700">РЕПОЗИТОРИЙ РЕШЕНИЯ</h4>
              <a
                [href]="selectedSolution.solutionUrl"
                target="_blank"
                class="inline-flex items-center gap-1 text-indigo-600 hover:underline"
              >
                🔗 {{ selectedSolution.solutionUrl }}
              </a>
            </div>

            <!-- Team Members -->
            <div
              *ngIf="selectedSolution.assignment.isGrouped && selectedSolution.team"
              class="border-2 border-amber-300 p-4 bg-amber-50"
            >
              <h4 class="font-bold mb-3 uppercase text-amber-700">КОМАНДА</h4>
              <p *ngIf="selectedSolution.team.description" class="text-sm text-gray-600 mb-3">
                {{ selectedSolution.team.description }}
              </p>
              <div class="flex flex-wrap gap-3">
                <div
                  *ngFor="let member of selectedSolution.candidates"
                  [routerLink]="['/candidate', member.id]"
                  (click)="$event.stopPropagation()"
                  class="flex items-center gap-2 cursor-pointer p-1 transition-all hover:bg-white hover:shadow-md"
                >
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  >
                    {{ (member.surname || '').charAt(0) }}{{ (member.name || '').charAt(0) }}
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="font-semibold">{{ member.surname }} {{ member.name }}</span>
                    <span
                      *ngIf="member.id === selectedSolution.candidateOwner.id"
                      class="text-amber-500"
                      title="Лидер команды"
                      >👑</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Owner -->
            <div
              *ngIf="!selectedSolution.assignment.isGrouped"
              class="border-2 border-indigo-300 p-4 bg-indigo-50"
            >
              <h4 class="font-bold mb-3 uppercase text-indigo-700">АВТОР РЕШЕНИЯ</h4>
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                >
                    {{ (selectedSolution.candidateOwner.surname || '').charAt(0)
                  }}{{ (selectedSolution.candidateOwner.name || '').charAt(0) }}
                </div>
                <span class="font-semibold"
                  >{{ selectedSolution.candidateOwner.surname }}
                  {{ selectedSolution.candidateOwner.name }}</span
                >
              </div>
            </div>

            <!-- Review Form -->
            <div class="border-2 border-indigo-600 p-4">
              <h4 class="font-bold mb-3 uppercase text-indigo-700">ВАША ОЦЕНКА</h4>
              <div class="space-y-4">
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase">КОММЕНТАРИЙ</label>
                  <textarea
                    [(ngModel)]="reviewComment"
                    class="w-full border-2 border-black p-3 min-h-[120px]"
                    placeholder="Введите ваш комментарий по решению"
                  ></textarea>
                </div>
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase">РЕШЕНИЕ</label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        [(ngModel)]="reviewApproved"
                        [value]="true"
                        name="reviewDecision"
                        class="w-5 h-5"
                      />
                      <span class="font-semibold text-emerald-600">✅ ОДОБРИТЬ</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        [(ngModel)]="reviewApproved"
                        [value]="false"
                        name="reviewDecision"
                        class="w-5 h-5"
                      />
                      <span class="font-semibold text-red-600">❌ ОТКЛОНИТЬ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-4 mt-6 pt-6 border-t-2">
            <button
              (click)="submitReview()"
              [disabled]="reviewApproved === undefined || !reviewComment.trim()"
              class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
            >
              ОТПРАВИТЬ ОЦЕНКУ
            </button>
            <button
              (click)="closeReviewModal()"
              class="flex-1 border-2 border-gray-400 px-8 py-3 hover:bg-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              ОТМЕНА
            </button>
          </div>
        </div>
      </div>

      <!-- Solution Detail Modal (for expertReview tab) -->
      <div
        *ngIf="showSolutionDetailModal && selectedSolution"
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
        (click)="closeSolutionDetailModal()"
      >
        <div
          class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-indigo-600 uppercase">ДЕТАЛИ РЕШЕНИЯ</h2>
            <button (click)="closeSolutionDetailModal()" class="text-3xl hover:text-red-600 cursor-pointer">
              ×
            </button>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 space-y-6">
            <!-- Solution Info -->
            <div class="border-2 border-gray-300 p-4 bg-gray-50">
              <h3 class="font-bold text-lg mb-2 uppercase">
                {{ selectedSolution.team?.name || 'Индивидуальное решение' }}
              </h3>
              <p class="text-sm">
                <span class="font-bold">СТАТУС:</span>
                {{ getStateLabel(selectedSolution.state) }}
              </p>
              <p class="text-sm">
                <span class="font-bold">НАЧАТО:</span>
                {{ selectedSolution.startedAt | date: 'dd.MM.yyyy' }}
              </p>
            </div>

            <!-- Repository Link -->
            <div *ngIf="selectedSolution.solutionUrl" class="border-2 border-indigo-300 p-4 bg-indigo-50">
              <h4 class="font-bold mb-2 uppercase text-indigo-700">РЕПОЗИТОРИЙ РЕШЕНИЯ</h4>
              <a
                [href]="selectedSolution.solutionUrl"
                target="_blank"
                class="inline-flex items-center gap-1 text-indigo-600 hover:underline"
              >
                🔗 {{ selectedSolution.solutionUrl }}
              </a>
            </div>

            <!-- Team Members -->
            <div *ngIf="selectedSolution.assignment.isGrouped && selectedSolution.team" class="border-2 border-amber-300 p-4 bg-amber-50">
              <h4 class="font-bold mb-3 uppercase text-amber-700">КОМАНДА</h4>
              <p *ngIf="selectedSolution.team.description" class="text-sm text-gray-600 mb-3">{{ selectedSolution.team.description }}</p>
              <div class="flex flex-wrap gap-3">
                <div
                  *ngFor="let member of selectedSolution.candidates"
                  [routerLink]="['/candidate', member.id]"
                  (click)="$event.stopPropagation()"
                  class="flex items-center gap-2 cursor-pointer p-1 transition-all hover:bg-white hover:shadow-md"
                >
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ (member.surname || '').charAt(0) }}{{ (member.name || '').charAt(0) }}
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="font-semibold">{{ member.surname }} {{ member.name }}</span>
                    <span *ngIf="member.id === selectedSolution.candidateOwner.id" class="text-amber-500" title="Лидер команды">👑</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Owner -->
            <div *ngIf="!selectedSolution.assignment.isGrouped" class="border-2 border-indigo-300 p-4 bg-indigo-50">
              <h4 class="font-bold mb-3 uppercase text-indigo-700">АВТОР РЕШЕНИЯ</h4>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ (selectedSolution.candidateOwner.surname || '').charAt(0) }}{{ (selectedSolution.candidateOwner.name || '').charAt(0) }}
                </div>
                <span class="font-semibold">{{ selectedSolution.candidateOwner.surname }} {{ selectedSolution.candidateOwner.name }}</span>
              </div>
            </div>

            <!-- Review Progress -->
            <div class="border-2 border-amber-300 p-4 bg-amber-50">
              <h4 class="font-bold mb-4 uppercase text-amber-700">СТАДИИ ПРОВЕРКИ</h4>
              <div class="flex items-center justify-between mb-4">
                <!-- Autotests -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'Autotests')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'Autotests') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'Autotests')"
                  >
                    {{ selectedSolution.state === 'Autotests' ? '✓ ' : '' }}АВТОТЕСТЫ
                  </div>
                </div>
                <!-- Line -->
                <div
                  class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'Autotests')"
                ></div>
                <!-- AI Review -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'AiReview')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'AiReview') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'AiReview')"
                  >
                    {{ selectedSolution.state === 'AiReview' ? '✓ ' : '' }}AI-АНАЛИЗ
                  </div>
                </div>
                <!-- Line -->
                <div
                  class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'AiReview')"
                ></div>
                <!-- Expert Review -->
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'ExpertReview')"
                  >
                    {{ getStageNumber(selectedSolution.state, 'ExpertReview') }}
                  </div>
                  <div
                    class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'ExpertReview')"
                  >
                    {{ selectedSolution.state === 'ExpertReview' ? '✓ ' : '' }}ЭКСПЕРТ
                  </div>
                </div>
              </div>
              <!-- Status Message -->
              <div class="border-l-4 border-amber-500 bg-amber-50 p-3">
                <p class="text-xs font-bold uppercase text-amber-700 mb-1">СТАТУС:</p>
                <p class="text-sm text-amber-900">{{ getStatusMessage(selectedSolution.state) }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-4 mt-6 pt-6 border-t-2">
            <button
              (click)="closeSolutionDetailModal()"
              class="flex-1 border-2 border-gray-400 px-8 py-3 hover:bg-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              ЗАКРЫТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AssignmentSolutionsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly solutionsService = inject(SolutionsService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationService);

  assignmentId = '';
  assignment: AssignmentFullInfo | null = null;
  solutions: SolutionFullInfo[] = [];
  loading = true;
  activeTab: 'notStarted' | 'inProgress' | 'autotestsAi' | 'expertReview' | 'completed' = 'notStarted';
  selectedSolution: SolutionFullInfo | null = null;
  showReviewModal = false;
  showSolutionDetailModal = false;
  reviewComment = '';
  reviewApproved: boolean | undefined = undefined;

  ngOnInit() {
    this.assignmentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAssignment();
    this.loadSolutions();
  }

  private loadAssignment(): void {
    this.assignmentsService.getAssignment(this.assignmentId).subscribe({
      next: (assignment) => {
        this.assignment = assignment;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load assignment:', error);
        this.cdr.markForCheck();
      },
    });
  }

  private loadSolutions(): void {
    const searchRequest: SolutionSearchRequest = {
      assignmentId: this.assignmentId,
      take: 1000,
      skip: 0,
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        this.solutions = response.items || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load solutions:', error);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onTabChange(tab: 'notStarted' | 'inProgress' | 'autotestsAi' | 'expertReview' | 'completed'): void {
    this.activeTab = tab;
  }

  getTabCount(tab: string): number {
    return this.getSolutionsForTab(tab).length;
  }

  getSolutionsForTab(overrideTab?: string): SolutionFullInfo[] {
    const tab = overrideTab || this.activeTab;
    return this.solutions.filter((solution) => {
      const state = solution.state;

      switch (tab) {
        case 'notStarted':
          return state === 'NotStarted';
        case 'inProgress':
          return state === 'InProgress' || state === 'RequiresImprovements';
        case 'expertReview':
          return state === 'ExpertReview';
        case 'completed':
          return state === 'Failed' || state === 'Done';
        default:
          return true;
      }
    });
  }

  private isCompleted(state: SolutionState): boolean {
    // Можно добавить дополнительную логику для завершённых состояний
    return false;
  }

  getLastExpertReviewComment(solution: SolutionFullInfo): string {
    const reviews = solution.expertReviews ?? [];
    return reviews
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.comment ?? '';
  }

  getStateLabel(state: SolutionState): string {
    const labels: Record<SolutionState, string> = {
      NotStarted: 'Не начато',
      InProgress: 'В работе',
      Autotests: 'Автотесты',
      AiReview: 'AI проверка',
      ExpertReview: 'Проверка экспертом',
      RequiresImprovements: 'Требуется доработка',
      Done: 'Ревью пройдено',
      Failed: 'Ревью не пройдено',
    };
    return labels[state] || state;
  }

  getStateBadgeClass(state: SolutionState): string {
    const baseClasses = 'px-3 py-1 text-xs font-bold uppercase rounded';
    switch (state) {
      case 'NotStarted':
        return `${baseClasses} bg-gray-200 text-gray-700`;
      case 'InProgress':
        return `${baseClasses} bg-blue-200 text-blue-700`;
      case 'AiReview':
      case 'ExpertReview':
        return `${baseClasses} bg-amber-200 text-amber-700`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-700`;
    }
  }

  getStageBadgeClass(
    currentState: SolutionState,
    stage: 'Autotests' | 'AiReview' | 'ExpertReview',
  ): string {
    const stateOrder: SolutionState[] = ['Autotests', 'AiReview', 'ExpertReview'];
    const currentIndex = stateOrder.indexOf(currentState);
    const stageIndex = stateOrder.indexOf(stage);

    if (currentIndex > stageIndex) {
      // Этап пройден
      return 'border-emerald-500 bg-emerald-50 text-emerald-700';
    } else if (currentIndex === stageIndex) {
      // Текущий этап
      return 'border-amber-500 bg-amber-50 text-amber-700';
    } else {
      // Ожидает
      return 'border-gray-300 bg-gray-100 text-gray-500';
    }
  }

  getReviewStageClass(
    currentState: SolutionState,
    stage: 'Autotests' | 'AiReview' | 'ExpertReview',
  ): string {
    const stateOrder: SolutionState[] = ['Autotests', 'AiReview', 'ExpertReview'];
    const currentIndex = stateOrder.indexOf(currentState);
    const stageIndex = stateOrder.indexOf(stage);

    if (currentIndex > stageIndex) {
      // Этап пройден
      return 'border-emerald-500 bg-emerald-500 text-white';
    } else if (currentIndex === stageIndex) {
      // Текущий этап
      return 'border-amber-500 bg-amber-50 text-amber-700';
    } else {
      // Ожидает
      return 'border-gray-300 bg-white text-gray-400';
    }
  }

  getLineClass(currentState: SolutionState, stage: 'Autotests' | 'AiReview'): string {
    const stateOrder: SolutionState[] = ['Autotests', 'AiReview', 'ExpertReview'];
    const currentIndex = stateOrder.indexOf(currentState);
    const stageIndex = stateOrder.indexOf(stage);

    if (currentIndex > stageIndex) {
      // Этап пройден
      return 'bg-emerald-500';
    } else {
      // Ожидает
      return 'bg-gray-300';
    }
  }

  getStageNumber(
    currentState: SolutionState,
    stage: 'Autotests' | 'AiReview' | 'ExpertReview',
  ): string {
    const stateOrder: SolutionState[] = ['Autotests', 'AiReview', 'ExpertReview'];
    const currentIndex = stateOrder.indexOf(currentState);
    const stageIndex = stateOrder.indexOf(stage);

    if (currentIndex > stageIndex) {
      return '✓';
    } else {
      return stage === 'Autotests' ? '1' : stage === 'AiReview' ? '2' : '3';
    }
  }

  getStatusMessage(state: SolutionState): string {
    switch (state) {
      case 'Autotests':
        return 'Решение проходит автоматические тесты. Ожидайте завершения проверки.';
      case 'AiReview':
        return 'Автотесты пройдены. Решение анализируется искусственным интеллектом.';
      case 'ExpertReview':
        return 'Решение на проверке у эксперта. Ожидайте обратную связь.';
      default:
        return 'Неизвестный статус проверки.';
    }
  }

  openReviewModal(solution: SolutionFullInfo): void {
    this.selectedSolution = solution;
    this.showReviewModal = true;
    this.reviewComment = '';
    this.reviewApproved = undefined;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedSolution = null;
    this.reviewComment = '';
    this.reviewApproved = undefined;
  }

  submitReview(): void {
    if (!this.selectedSolution || this.reviewApproved === undefined || !this.reviewComment.trim())
      return;

    // Здесь будет вызов сервиса для отправки оценки
    // Пока просто закрываем модалку и показываем уведомление
    this.notificationService.success(
      `Решение ${this.reviewApproved ? 'одобрено' : 'отклонено'}! Комментарий: ${this.reviewComment}`,
    );
    this.closeReviewModal();
    this.loadSolutions(); // Перезагружаем список решений
  }

  openSolutionDetailModal(solution: SolutionFullInfo): void {
    this.selectedSolution = solution;
    this.showSolutionDetailModal = true;
  }

  closeSolutionDetailModal(): void {
    this.showSolutionDetailModal = false;
    this.selectedSolution = null;
  }
}
