import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AuthService, CandidatesService, TechnologiesService, AssignmentsService, SolutionsService } from '../core';
import { CandidateFullInfo, Technology, CandidatePatchApiRequest, RelationsPatch, NullablePatch, AssignmentFullInfo, AssignmentSearchRequest, SolutionFullInfo, SolutionSearchRequest, SolutionState, AssignmentDifficulty, ExpertReviewInSolution } from '../core/models/api.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    TechChipComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <app-navbar [role]="'candidate'"></app-navbar>

      <ng-template #assignmentMeta let-assignment>
        <div class="flex flex-wrap gap-2 mb-4 text-xs">
          <span class="inline-flex items-center px-2.5 py-1 border border-indigo-300 bg-indigo-50 text-indigo-700 font-bold uppercase">
            Макс. попыток: {{ getAssignmentMaxAttempts(assignment) }}
          </span>
          <span class="inline-flex items-center px-2.5 py-1 border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold uppercase">
            Сложность: {{ getDifficultyLabel(assignment.difficulty) }}
          </span>
          <span class="inline-flex items-center px-2.5 py-1 border border-slate-300 bg-slate-50 text-slate-700 font-bold uppercase">
            Коэффициенты: {{ formatAttemptCoefficients(assignment) }}
          </span>
        </div>
      </ng-template>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Profile Section -->
        <div class="border-2 border-indigo-600 bg-white p-6 shadow-lg mb-8">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white text-3xl">
                👤
              </div>
              <div>
                <h2 class="text-2xl font-bold text-indigo-600 uppercase">Мой профиль</h2>
                <p class="text-sm text-gray-600">Информация о кандидате</p>
              </div>
            </div>
            <button
              (click)="openProfileEdit()"
              class="text-sm border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors uppercase font-semibold flex items-center gap-2">
              ✏️ РЕДАКТИРОВАТЬ
            </button>
          </div>

          <div *ngIf="!candidate" class="text-center py-8 text-gray-500">
            Загрузка профиля...
          </div>

          <div *ngIf="candidate && !showProfileEdit" class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ФИО</p>
              <p class="font-semibold text-lg">{{ candidate.surname }} {{ candidate.name }}{{ candidate.patronymic ? ' ' + candidate.patronymic : '' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Город</p>
              <p class="font-semibold text-lg">{{ candidate.city || 'Не указан' }}</p>
            </div>
          </div>

          <div *ngIf="candidate && !showProfileEdit" class="mt-4">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">О себе</p>
            <p class="text-gray-700 leading-relaxed">{{ candidate.about || 'Не указано' }}</p>
          </div>

          <div *ngIf="candidate && !showProfileEdit" class="mt-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Навыки</p>
            <div class="flex flex-wrap gap-2">
              <div *ngFor="let tech of candidate.technologies" class="px-3 py-1.5 border-2 border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold text-sm">
                {{ tech.name }}
              </div>
              <div *ngIf="!candidate.technologies || candidate.technologies.length === 0" class="text-gray-500">
                Навыки не указаны
              </div>
            </div>
          </div>

          <!-- Profile Edit Modal -->
          <div *ngIf="showProfileEdit" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeProfileEdit()">
            <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold uppercase text-indigo-600">РЕДАКТИРОВАНИЕ ПРОФИЛЯ</h3>
                <button (click)="showProfileEdit = false" class="text-2xl hover:text-red-600">×</button>
              </div>

              <form [formGroup]="profileForm" class="flex-1 overflow-y-auto pr-2">
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ФАМИЛИЯ</label>
                      <input
                        type="text"
                        formControlName="surname"
                        class="w-full border-2 border-black p-3"
                        placeholder="Иванов"/>
                    </div>
                    <div>
                      <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ИМЯ</label>
                      <input
                        type="text"
                        formControlName="name"
                        class="w-full border-2 border-black p-3"
                        placeholder="Иван"/>
                    </div>
                  </div>

                  <div>
                    <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОТЧЕСТВО</label>
                    <input
                      type="text"
                      formControlName="patronymic"
                      class="w-full border-2 border-black p-3"
                      placeholder="Иванович"/>
                  </div>

                  <div>
                    <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ГОРОД ПРОЖИВАНИЯ</label>
                    <input
                      type="text"
                      formControlName="city"
                      class="w-full border-2 border-black p-3"
                      placeholder="Москва"/>
                  </div>

                  <div>
                    <label class="block font-bold mb-2 text-sm uppercase tracking-wider">О СЕБЕ</label>
                    <textarea
                      formControlName="about"
                      class="w-full border-2 border-black p-3 min-h-[120px]"
                      placeholder="Расскажите о себе"></textarea>
                  </div>

                  <!-- Technologies Management -->
                  <div>
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-sm uppercase tracking-wider">НАВЫКИ</h3>
                      <button
                        type="button"
                        (click)="openTechModalForProfile()"
                        class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors text-sm uppercase font-semibold flex items-center gap-2">
                        <span class="text-lg">+</span> ДОБАВИТЬ НАВЫК
                      </button>
                    </div>

                    <div class="space-y-2">
                      <div *ngFor="let tech of profileTechs" class="flex items-center gap-2 border-2 p-2">
                        <span class="flex-1 text-sm">{{ tech.name }}</span>
                        <button type="button" (click)="removeTechFromProfile(tech.id)" class="text-xl hover:opacity-70">🗑️</button>
                      </div>
                      <div *ngIf="profileTechs.length === 0" class="text-gray-500 text-sm">
                        Навыки не выбраны
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div class="flex gap-2 mt-6 pt-4 border-t-2">
                <button
                  (click)="saveProfile()"
                  [disabled]="savingProfile || profileForm.invalid"
                  class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50">
                  {{ savingProfile ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ' }}
                </button>
                <button
                  type="button"
                  (click)="showProfileEdit = false"
                  class="border-2 border-gray-400 px-8 py-3 hover:bg-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
                  ОТМЕНА
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Modal -->
        <div *ngIf="showTechModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeTechModal()">
          <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <h3 class="text-xl font-bold mb-4 uppercase text-indigo-600">Выберите навыки</h3>

            <!-- Search Input -->
            <div class="mb-4">
              <input
                type="text"
                [(ngModel)]="techSearchQuery"
                (ngModelChange)="onTechSearch()"
                class="w-full border-2 border-black p-3 text-sm"
                placeholder="Поиск навыков..."
                autofocus
              />
            </div>

            <!-- Loading Indicator -->
            <div *ngIf="loadingTechs" class="text-center py-4 text-gray-500">
              Загрузка...
            </div>

            <!-- Technologies Grid -->
            <div *ngIf="!loadingTechs" class="grid grid-cols-3 gap-2 overflow-y-auto flex-1 max-h-96">
              <label *ngFor="let tech of filteredTechs" class="flex items-center gap-2 text-xs cursor-pointer border-2 p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  [checked]="techModalMode === 'profile' ? profileTechs.some(t => t.id === tech.id) : selectedTechs.some(t => t.id === tech.id)"
                  (change)="techModalMode === 'profile' ? toggleTechForProfile(tech) : toggleTech(tech)"
                  class="w-4 h-4 border-2 border-black"
                />
                <span>{{ tech.name }}</span>
              </label>
              <div *ngIf="filteredTechs.length === 0 && hasSearched" class="col-span-3 text-center py-8 text-gray-500">
                Навыки не найдены
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="mt-6 flex gap-2">
              <button
                type="button"
                (click)="techModalMode === 'profile' ? saveTechsToProfile() : closeTechModal()"
                class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold">
                ГОТОВО
              </button>
            </div>
          </div>
        </div>

        <!-- Assignment Detail Modal -->
        <div *ngIf="showAssignmentModal && selectedAssignment" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeAssignmentModal()">
          <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">

              <h2 class="text-2xl font-bold text-indigo-600 uppercase">{{ selectedAssignment.name }}</h2>
              <button (click)="closeAssignmentModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <!-- Technologies -->
            @if (selectedAssignment.technologies.length) {
              <div class="flex flex-wrap gap-2 mb-4">
                <app-tech-chip *ngFor="let tech of selectedAssignment.technologies" [name]="tech.name"></app-tech-chip>
              </div>
            }


            <!-- Info Bar -->
            <div class="flex flex-wrap gap-4 mb-4 text-sm">
              <div>
                <span class="font-bold">КОМПАНИЯ:</span> {{ selectedAssignment.employer.name }}
              </div>
              <div>
                <span class="font-bold">ДЕДЛАЙН:</span> {{ selectedAssignment.deadLine | date:'dd.MM.yyyy' }}
              </div>
            </div>

            <ng-container *ngTemplateOutlet="assignmentMeta; context: { $implicit: selectedAssignment }"></ng-container>

            <!-- Days Remaining -->
            <div class="border-2 border-indigo-300 bg-indigo-50 p-4 mb-6 text-center">
              <span class="font-bold text-lg" [class]="getDaysRemaining(selectedAssignment.deadLine) < 0 ? 'text-red-600' : 'text-indigo-600'">
                ОСТАЛОСЬ ДНЕЙ: {{ getDaysRemaining(selectedAssignment.deadLine) }}
              </span>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="font-bold text-lg mb-3 uppercase">ОПИСАНИЕ ПРОЕКТА</h3>
              <div class="border-2 border-gray-300 p-4 bg-gray-50">
                <p class="text-gray-700 whitespace-pre-line">{{ selectedAssignment.description }}</p>
              </div>
            </div>

            <!-- Team Form for Group Projects -->
            <div *ngIf="selectedAssignment.isGrouped" class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
              <h3 class="font-bold text-lg mb-3 uppercase text-amber-800">
                📋 ГРУППОВОЙ ПРОЕКТ (до {{ selectedAssignment.candidatesCapacity }} чел.)
              </h3>

              <!-- Existing Teams List -->
              <div *ngIf="assignmentTeams.length > 0" class="mb-4">
                <p class="text-sm font-bold uppercase text-amber-700 mb-2">Команды, выполняющие это задание:</p>
                <div class="space-y-2">
                  <div *ngFor="let team of displayTeams" class="flex justify-between items-center bg-white border border-amber-300 p-2">
                    <span class="text-sm font-semibold">{{ team.name }}</span>
                    <button
                      (click)="joinTeamSolution(team.solutionId)"
                      class="border border-emerald-600 bg-emerald-600 text-white px-3 py-1 hover:bg-emerald-700 transition-colors text-xs font-bold uppercase whitespace-nowrap">
                      Присоединиться
                    </button>
                  </div>
                  <button
                    *ngIf="assignmentTeams.length > 3"
                    (click)="navigateToJoinSolution()"
                    class="text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline">
                    Показать все ({{ assignmentTeams.length }})
                  </button>
                </div>
              </div>

              <!-- Create New Team Form -->
              <div class="space-y-3">
                <p class="text-sm font-bold uppercase text-amber-700">Или создайте свою команду:</p>
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase">НАЗВАНИЕ КОМАНДЫ</label>
                  <input
                    type="text"
                    [(ngModel)]="teamName"
                    class="w-full border-2 border-black p-3 text-sm"
                    [class.border-red-500]="teamNameError"
                    [placeholder]="'От ' + TEAM_NAME_MIN_LENGTH + ' до ' + TEAM_NAME_MAX_LENGTH + ' символов'"/>
                  <p *ngIf="teamNameError" class="text-red-600 text-xs mt-1">{{ teamNameError }}</p>
                </div>
                <div>
                  <label class="block font-bold mb-2 text-sm uppercase">ОПИСАНИЕ КОМАНДЫ (НЕ ОБЯЗАТЕЛЬНО)</label>
                  <textarea
                    [(ngModel)]="teamDescription"
                    class="w-full border-2 border-black p-3 text-sm min-h-[100px]"
                    [class.border-red-500]="teamDescriptionError"
                    [placeholder]="'От ' + TEAM_DESC_MIN_LENGTH + ' до ' + TEAM_DESC_MAX_LENGTH + ' символов'"></textarea>
                  <p *ngIf="teamDescriptionError" class="text-red-600 text-xs mt-1">{{ teamDescriptionError }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 mt-auto pt-6 border-t-2">
              <button
                (click)="takeAssignment()"
                [disabled]="!canTakeAssignment"
                class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                [class]="canTakeAssignment ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500'">
                {{ takingAssignment ? 'ОФОРМЛЕНИЕ...' : 'ВЗЯТЬ ЗАДАНИЕ' }}
              </button>
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

            <ng-container *ngTemplateOutlet="assignmentMeta; context: { $implicit: selectedSolution.assignment }"></ng-container>

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
                📋 КОМАНДА ({{ selectedSolution.candidates?.length || 0 }} / {{ selectedSolution.assignment.candidatesCapacity }} чел.)
              </h3>

              <!-- Pending Requests Section (только для владельца решения) -->
              <div *ngIf="(selectedSolution.candidatesJoinRequested?.length || 0) > 0 && selectedSolution.candidateOwner.id === currentUserId" class="mb-4 border-2 border-emerald-400 bg-emerald-50 p-3">
                <div class="flex justify-between items-center mb-2">
                  <p class="text-sm font-bold uppercase text-emerald-700">⏳ ЗАЯВКИ НА РАССМОТРЕНИИ ({{ (selectedSolution.candidatesJoinRequested?.length || 0) }})</p>
                  <button
                    *ngIf="(selectedSolution.candidatesJoinRequested?.length || 0) > 3"
                    (click)="openPendingCandidatesModal()"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline">
                    Показать всех
                  </button>
                </div>
                <div class="space-y-2">
                  <div *ngFor="let candidate of (selectedSolution.candidatesJoinRequested?.slice(0, 3) || [])" class="flex justify-between items-center bg-white border border-emerald-300 p-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {{ candidate.surname.charAt(0) }}{{ candidate.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-semibold">{{ candidate.surname }} {{ candidate.name }}</p>
                        <p class="text-xs text-gray-500">{{ candidate.city || 'Город не указан' }}</p>
                      </div>
                    </div>
                    <button
                      (click)="approveCandidate(candidate.id)"
                      [disabled]="approvingCandidateId === candidate.id || selectedSolution.candidates.length >= selectedSolution.assignment.candidatesCapacity"
                      class="border border-emerald-600 bg-emerald-600 text-white px-3 py-1 hover:bg-emerald-700 transition-colors text-xs font-bold uppercase whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ approvingCandidateId === candidate.id ? 'ОДОБРЕНИЕ...' : 'ОДОБРИТЬ' }}
                    </button>
                  </div>
                </div>
                <div *ngIf="selectedSolution.candidates.length >= selectedSolution.assignment.candidatesCapacity" class="mt-2 text-xs text-red-600 font-bold">
                  ⚠️ Нет свободных мест в команде
                </div>
              </div>

              <!-- Team Warning -->
              <div *ngIf="selectedSolution.candidates && selectedSolution.candidates.length < selectedSolution.assignment.candidatesCapacity"
                   class="mb-4 border-2 border-red-400 bg-red-50 p-3 text-red-700 text-sm font-bold">
                ⚠️ ВНИМАНИЕ: В команде только {{ selectedSolution.candidates.length }} из {{ selectedSolution.assignment.candidatesCapacity }} участников!
              </div>

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

            <!-- Solution URL (for NotStarted, InProgress and RequiresImprovements tabs) -->
            <div *ngIf="selectedSolution.state === 'NotStarted' || selectedSolution.state === 'InProgress' || selectedSolution.state === 'RequiresImprovements'" class="mb-6 border-2 border-emerald-300 bg-emerald-50 p-4">
              <h3 class="font-bold text-lg mb-3 uppercase text-emerald-800">
                🔗 ССЫЛКА НА РЕШЕНИЕ
              </h3>
              <div class="flex gap-2 items-start">
                <input
                  type="text"
                  [(ngModel)]="solutionUrl"
                  class="flex-1 border-2 border-black p-3 text-sm"
                  placeholder="https://github.com/username/repo"/>
                <button
                  (click)="saveSolutionUrl(selectedSolution)"
                  [disabled]="savingSolutionUrl || !solutionUrl.trim()"
                  class="border-2 border-emerald-600 bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ savingSolutionUrl ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ' }}
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 mt-auto pt-6 border-t-2">
              <button
                *ngIf="selectedSolution.state === 'NotStarted' && selectedSolution.candidateOwner.id === currentUserId"
                (click)="startSolution(selectedSolution)"
                [disabled]="takingAssignment"
                class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-indigo-600 text-white hover:bg-indigo-700">
                {{ takingAssignment ? 'ЗАГРУЗКА...' : 'ВЗЯТЬ В РАБОТУ' }}
              </button>
              <button
                *ngIf="(selectedSolution.state === 'InProgress' || selectedSolution.state === 'RequiresImprovements') && selectedSolution.candidateOwner.id === currentUserId"
                (click)="sendToReview(selectedSolution)"
                [disabled]="sendingToReview || !canSendToReview(selectedSolution)"
                class="flex-1 border-2 border-emerald-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                [class]="canSendToReview(selectedSolution) ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500'">
                {{ sendingToReview ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ НА ПРОВЕРКУ' }}
              </button>
              <div *ngIf="(selectedSolution.state === 'InProgress' || selectedSolution.state === 'RequiresImprovements') && !canSendToReview(selectedSolution)" class="text-xs text-red-600 font-semibold">
                ⚠️ {{ getSendToReviewDisabledReason(selectedSolution) }}
              </div>
            </div>

            <!-- Review Progress (only for review tab) -->
            <div *ngIf="activeTab === 'review' && selectedSolution.state !== 'RequiresImprovements'" class="mt-6 border-2 border-amber-300 p-4 bg-amber-50">
              <h4 class="font-bold mb-4 uppercase text-amber-700">СТАДИИ ПРОВЕРКИ</h4>
              <div class="flex items-center justify-between mb-4">
                <!-- Autotests -->
                <div class="flex flex-col items-center flex-1">
                  <div class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'Autotests')">
                    {{ getStageNumber(selectedSolution.state, 'Autotests') }}
                  </div>
                  <div class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'Autotests')">
                    {{ selectedSolution.state === 'Autotests' ? '✓ ' : '' }}АВТОТЕСТЫ
                  </div>
                </div>
                <!-- Line -->
                <div class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'Autotests')"></div>
                <!-- AI Review -->
                <div class="flex flex-col items-center flex-1">
                  <div class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'AiReview')">
                    {{ getStageNumber(selectedSolution.state, 'AiReview') }}
                  </div>
                  <div class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'AiReview')">
                    {{ selectedSolution.state === 'AiReview' ? '✓ ' : '' }}AI-АНАЛИЗ
                  </div>
                </div>
                <!-- Line -->
                <div class="flex-1 h-1 mx-2"
                  [class]="getLineClass(selectedSolution.state, 'AiReview')"></div>
                <!-- Expert Review -->
                <div class="flex flex-col items-center flex-1">
                  <div class="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg mb-2"
                    [class]="getReviewStageClass(selectedSolution.state, 'ExpertReview')">
                    {{ getStageNumber(selectedSolution.state, 'ExpertReview') }}
                  </div>
                  <div class="px-3 py-1 text-xs font-bold uppercase border-2 text-center"
                    [class]="getStageBadgeClass(selectedSolution.state, 'ExpertReview')">
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

            <div *ngIf="activeTab === 'review' && selectedSolution.state === 'RequiresImprovements'" class="mt-6 border-2 border-red-300 p-4 bg-red-50">
              <h4 class="font-bold mb-3 uppercase text-red-700">НУЖНЫ ДОПОЛНЕНИЯ</h4>
              <div class="border-l-4 border-red-500 bg-white p-3">
                <p class="text-sm text-red-900">{{ getStatusMessage(selectedSolution.state) }}</p>
              </div>
            </div>

            <!-- Archive Review Result (only for archive tab) -->
            <div *ngIf="activeTab === 'archive'" class="mt-6 border-2 p-4" [class]="selectedSolution.state === 'Done' ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'">
              <h4 class="font-bold mb-4 uppercase" [class]="selectedSolution.state === 'Done' ? 'text-emerald-700' : 'text-red-700'">
                РЕЗУЛЬТАТ ПРОВЕРКИ
              </h4>

              <!-- Status -->
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
                  <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ review.comment }}</p>
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

        <!-- Show All Technologies Modal -->
        <div *ngIf="showAllTechsModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeShowAllModal()">
          <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold uppercase text-indigo-600">ВСЕ ТЕХНОЛОГИИ</h3>
              <button (click)="closeShowAllModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <!-- Search Input -->
            <div class="mb-4">
              <input
                type="text"
                [(ngModel)]="showAllTechsSearch"
                (ngModelChange)="onShowAllTechsSearch()"
                class="w-full border-2 border-black p-3 text-sm"
                placeholder="Поиск технологий..."
                autofocus/>
            </div>

            <!-- Technologies Grid -->
            <div class="grid grid-cols-3 gap-2 overflow-y-auto max-h-96">
              <label *ngFor="let tech of filteredShowAllTechs" class="flex items-center gap-2 text-xs cursor-pointer border-2 p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  [checked]="selectedTechs.some(t => t.id === tech.id)"
                  (change)="toggleTech(tech)"
                  class="w-4 h-4"/>
                <span>{{ tech.name }}</span>
              </label>
              <div *ngIf="filteredShowAllTechs.length === 0" class="col-span-3 text-center py-8 text-gray-500">
                Технологии не найдены
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex gap-2">
              <button
                type="button"
                (click)="closeShowAllModal()"
                class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold">
                ГОТОВО
              </button>
            </div>
          </div>
        </div>

        <!-- Pending Candidates Modal -->
        <div *ngIf="showPendingCandidatesModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closePendingCandidatesModal()">
          <div class="bg-white border-2 border-emerald-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold uppercase text-emerald-600">ЗАЯВКИ НА РАССМОТРЕНИИ</h3>
              <button (click)="closePendingCandidatesModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <!-- Candidates List -->
            <div class="space-y-2 overflow-y-auto max-h-96">
              <div *ngFor="let candidate of pendingCandidates" class="flex justify-between items-center bg-gray-50 border border-emerald-300 p-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ candidate.surname.charAt(0) }}{{ candidate.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ candidate.surname }} {{ candidate.name }}{{ candidate.patronymic ? ' ' + candidate.patronymic : '' }}</p>
                    <p class="text-xs text-gray-500">{{ candidate.city || 'Город не указан' }}</p>
                    <p class="text-xs text-gray-400">{{ candidate.login }}</p>
                  </div>
                </div>
                <button
                  (click)="approveCandidate(candidate.id)"
                  [disabled]="approvingCandidateId === candidate.id || (selectedSolution && selectedSolution.candidates.length >= selectedSolution.assignment.candidatesCapacity)"
                  class="border-2 border-emerald-600 bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors text-xs font-bold uppercase whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ approvingCandidateId === candidate.id ? 'ОДОБРЕНИЕ...' : 'ОДОБРИТЬ' }}
                </button>
              </div>
              <div *ngIf="pendingCandidates.length === 0" class="text-center py-8 text-gray-500">
                Нет заявок на рассмотрение
              </div>
              <div *ngIf="selectedSolution && selectedSolution.candidates.length >= selectedSolution.assignment.candidatesCapacity" class="text-center text-xs text-red-600 font-bold mt-2">
                ⚠️ Нет свободных мест в команде
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex gap-2">
              <button
                type="button"
                (click)="closePendingCandidatesModal()"
                class="flex-1 border-2 border-emerald-600 bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors uppercase font-semibold">
                ЗАКРЫТЬ
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-8">
          <!-- Left Sidebar - Technology Filter -->
          <div class="w-64 flex-shrink-0">
            <div class="border-2 border-indigo-600 bg-white p-6 shadow-md">
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-600">Технологии</h3>

              <!-- Loading Indicator -->
              <div *ngIf="loadingFilterTechs" class="text-center py-4 text-gray-500 text-xs">
                Загрузка...
              </div>

              <!-- Technologies List -->
              <div *ngIf="!loadingFilterTechs" class="space-y-2">
                <label *ngFor="let tech of displayFilterTechs" class="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="selectedTechs.some(t => t.id === tech.id)"
                    (change)="toggleTech(tech)"
                    class="w-4 h-4 border-2 border-black"/>
                  <span>{{ tech.name }}</span>
                </label>

                <!-- Show All Button -->
                <button
                  *ngIf="allFilterTechs.length > 20"
                  (click)="openShowAllModal()"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline mt-1">
                  Показать все ({{ allFilterTechs.length }})
                </button>
              </div>

              <!-- Project Type Filter -->
              <div class="mt-6 pt-4 border-t-2 border-indigo-200">
                <h4 class="font-bold mb-3 text-xs uppercase tracking-wider text-indigo-600">Тип проекта</h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      [checked]="projectTypeFilter === 'all'"
                      (change)="projectTypeFilter = 'all'; applyFilters()"
                      class="w-4 h-4 border-2 border-black"/>
                    <span>Все</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      [checked]="projectTypeFilter === 'group'"
                      (change)="projectTypeFilter = 'group'; applyFilters()"
                      class="w-4 h-4 border-2 border-black"/>
                    <span>Групповые</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      [checked]="projectTypeFilter === 'individual'"
                      (change)="projectTypeFilter = 'individual'; applyFilters()"
                      class="w-4 h-4 border-2 border-black"/>
                    <span>Индивидуальные</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1">
            <!-- Tabs -->
            <div class="border-b-2 border-indigo-200 mb-6">
              <div class="flex gap-2 overflow-x-auto items-center justify-between">
                <div class="flex gap-2 overflow-x-auto">
                  <button
                    (click)="onTabChange('available')"
                    [class]="activeTab === 'available' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
                    class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                    Доступные {{ getTabCount('available') }}
                  </button>
                  <button
                    (click)="onTabChange('waiting-start')"
                    [class]="activeTab === 'waiting-start' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
                    class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                    Ожидают начала {{ getTabCount('waiting-start') }}
                  </button>
                  <button
                    (click)="onTabChange('in-progress')"
                    [class]="activeTab === 'in-progress' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
                    class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                    В работе {{ getTabCount('in-progress') }}
                  </button>
                  <button
                    (click)="onTabChange('review')"
                    [class]="activeTab === 'review' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
                    class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                    Проверка {{ getTabCount('review') }}
                  </button>
                  <button
                    (click)="onTabChange('archive')"
                    [class]="activeTab === 'archive' ? 'border-2 border-indigo-600 bg-indigo-600 text-white' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-indigo-400'"
                    class="px-4 py-2 font-bold uppercase text-sm whitespace-nowrap transition-colors">
                    Архив {{ getTabCount('archive') }}
                  </button>
                </div>
                <button
                  (click)="navigateToJoinSolution()"
                  class="flex-shrink-0 border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors uppercase font-bold text-xs whitespace-nowrap">
                  🔗 ПРИСОЕДИНИТЬСЯ
                </button>
              </div>
            </div>

            <!-- Search Bar for Available Tab -->
            <div *ngIf="activeTab === 'available'" class="mb-6">
              <input
                type="text"
                [(ngModel)]="availableSearchText"
                (ngModelChange)="onAvailableSearch()"
                class="w-full border-2 border-black p-3"
                placeholder="Поиск заданий..."/>
            </div>

            <!-- Available Assignments -->
            <div *ngIf="activeTab === 'available'">
              <div class="space-y-4">
                <div *ngFor="let assignment of filteredAvailableAssignments" [class]="assignment.isGrouped ? 'border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all' : 'border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all'">
                  <div (click)="openAssignmentModal(assignment)" class="cursor-pointer">
                    <div class="mb-3">
                      <h3 class="font-bold text-lg mb-1">{{ assignment.name }}</h3>
                      <div class="flex flex-wrap gap-2 mb-2">
                        <app-tech-chip *ngFor="let tech of assignment.technologies" [name]="tech.name"></app-tech-chip>
                      </div>
                      <p class="text-sm mb-2"><span class="font-bold">КОМПАНИЯ:</span> {{ assignment.employer.name }}</p>
                      <p class="text-sm mb-2">
                        <span class="font-bold">ДЕДЛАЙН:</span> {{ assignment.deadLine | date:'dd.MM.yyyy' }}
                      </p>
                      <p class="text-sm mb-3" *ngIf="assignment.isGrouped">
                        <span class="font-bold">ПРОЕКТ:</span> ГРУППОВОЙ (до {{ assignment.candidatesCapacity }} чел.)
                      </p>
                      <p class="text-sm mb-3" *ngIf="!assignment.isGrouped">
                        <span class="font-bold">ПРОЕКТ:</span> ИНДИВИДУАЛЬНЫЙ
                      </p>
                      <ng-container *ngTemplateOutlet="assignmentMeta; context: { $implicit: assignment }"></ng-container>
                    </div>
                  </div>
                </div>
                <div *ngIf="filteredAvailableAssignments.length === 0" class="text-center py-8 text-gray-500">
                  Заданий пока нет
                </div>
              </div>
            </div>

            <!-- Solutions Tabs -->
            <div *ngIf="activeTab !== 'available'" class="space-y-4">
              <div *ngFor="let solution of getSolutionsForTab(activeTab)" [class]="getSolutionCardClass(solution)"
                   [class.ring-4]="(solution.candidatesJoinRequested?.length || 0) > 0 && solution.candidateOwner.id === currentUserId"
                   [class.ring-emerald-400]="(solution.candidatesJoinRequested?.length || 0) > 0 && solution.candidateOwner.id === currentUserId">
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
                      <p class="text-sm mb-3" *ngIf="solution.assignment.isGrouped">
                        <span class="font-bold">УЧАСТНИКИ:</span> {{ solution.candidates?.length || 0 }} / {{ solution.assignment.candidatesCapacity }} чел.
                      </p>
                      <p class="text-sm mb-3" *ngIf="!solution.assignment.isGrouped && activeTab !== 'review'">
                        <span class="font-bold">ПРОЕКТ:</span> ИНДИВИДУАЛЬНЫЙ
                      </p>
                      <p class="text-sm mb-3" *ngIf="solution.assignment.isGrouped && activeTab !== 'review'">
                        <span class="font-bold">ПРОЕКТ:</span> ГРУППОВОЙ (до {{ solution.assignment.candidatesCapacity }} чел.)
                      </p>
                      <ng-container *ngTemplateOutlet="assignmentMeta; context: { $implicit: solution.assignment }"></ng-container>
                      <div *ngIf="solution.state === 'RequiresImprovements'" class="mb-2">
                        <span class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase border border-red-300">
                          <span>!</span> Требуются дополнения
                        </span>
                      </div>
                      <!-- Pending Requests Badge -->
                      <div *ngIf="(solution.candidatesJoinRequested?.length || 0) > 0 && solution.candidateOwner.id === currentUserId" class="mb-2">
                        <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase border border-emerald-300">
                          ⏳ ЗАЯВОК НА РАССМОТРЕНИИ: {{ (solution.candidatesJoinRequested?.length || 0) }}
                        </span>
                      </div>
                      <!-- Review Status Badge (for archive tab) -->
                      <div *ngIf="activeTab === 'archive'" class="mb-2">
                        <span *ngIf="solution.state === 'Done'" class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase border border-emerald-300">
                          <span>✓</span> РЕВЬЮ ПРОЙДЕНО
                        </span>
                        <span *ngIf="solution.state === 'Failed'" class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase border border-red-300">
                          <span>✗</span> РЕВЬЮ НЕ ПРОЙДЕНО
                        </span>
                        <span *ngIf="solution.medalGrantedAt" class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase border border-amber-300">
                          <span class="text-base leading-none">🏅</span> Медаль
                        </span>
                      </div>
                    </div>
                    <!-- Review Stage Badges (moved to bottom for review tab) -->
                    <div class="flex gap-2 mb-2" *ngIf="activeTab === 'review' && solution.state !== 'RequiresImprovements'">
                      <span class="px-2 py-1 text-xs font-bold uppercase border-2"
                        [class]="getStageBadgeClass(solution.state, 'Autotests')">
                        {{ solution.state === 'Autotests' ? '✓ ' : '' }}АВТОТЕСТЫ
                      </span>
                      <span class="px-2 py-1 text-xs font-bold uppercase border-2"
                        [class]="getStageBadgeClass(solution.state, 'AiReview')">
                        {{ solution.state === 'AiReview' ? '✓ ' : '' }}AI-АНАЛИЗ
                      </span>
                      <span class="px-2 py-1 text-xs font-bold uppercase border-2"
                        [class]="getStageBadgeClass(solution.state, 'ExpertReview')">
                        {{ solution.state === 'ExpertReview' ? '✓ ' : '' }}ЭКСПЕРТ
                      </span>
                    </div>
                  </div>
                  <!-- Start Button for Waiting Start Tab -->
                  <div *ngIf="activeTab === 'waiting-start' && solution.candidateOwner.id === currentUserId" class="flex-shrink-0">
                    <button
                      (click)="startSolution(solution)"
                      [disabled]="takingAssignment"
                      class="border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors font-bold uppercase text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ takingAssignment ? 'Загрузка...' : 'Взять в работу' }}
                    </button>
                  </div>
                  <!-- Send to Review Button for In Progress Tab -->
                  <div *ngIf="activeTab === 'in-progress' && solution.candidateOwner.id === currentUserId" class="flex-shrink-0">
                    <button
                      (click)="sendToReview(solution)"
                      [disabled]="sendingToReview || !canSendToReview(solution)"
                      class="border-2 border-emerald-600 px-4 py-2 font-bold uppercase text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      [class]="canSendToReview(solution) ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500'">
                      {{ sendingToReview ? '...' : 'На проверку' }}
                    </button>
                  </div>
                </div>
              </div>
              <div *ngIf="getSolutionsForTab(activeTab).length === 0" class="text-center py-8 text-gray-500">
                Заданий в этой категории нет
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CandidateDashboardPage implements OnInit {
  showProfileEdit = false;
  showTechModal = false;
  savingProfile = false;
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private candidatesService = inject(CandidatesService);
  private technologiesService = inject(TechnologiesService);
  private assignmentsService = inject(AssignmentsService);
  private solutionsService = inject(SolutionsService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  candidate: CandidateFullInfo | null = null;
  profileForm!: FormGroup;

  // Tech modal
  techSearchQuery = '';
  allTechs: Technology[] = [];
  filteredTechs: Technology[] = [];
  selectedTechs: Technology[] = [];
  loadingTechs = false;
  hasSearched = false;
  private searchTimeout: any;

  // Фильтр технологий (sidebar)
  allFilterTechs: Technology[] = [];
  displayFilterTechs: Technology[] = [];
  loadingFilterTechs = false;
  projectTypeFilter: 'all' | 'group' | 'individual' = 'all';

  // Show All Technologies Modal
  showAllTechsModal = false;
  showAllTechsSearch = '';
  filteredShowAllTechs: Technology[] = [];

  // Для редактирования профиля (отдельно от фильтра)
  profileTechs: Technology[] = [];

  // Tabs
  activeTab: 'available' | 'waiting-start' | 'in-progress' | 'review' | 'archive' = 'available';

  // Available assignments tab
  availableAssignments: AssignmentFullInfo[] = [];
  availableSearchText = '';

  // Solutions tabs
  solutions: SolutionFullInfo[] = [];

  // Assignment modal
  selectedAssignment: AssignmentFullInfo | null = null;
  showAssignmentModal = false;
  teamName = '';
  teamDescription = '';
  takingAssignment = false;
  assignmentTeams: { solutionId: string; name: string; membersCount: number }[] = [];
  displayTeams: { solutionId: string; name: string; membersCount: number }[] = [];
  loadingAssignmentTeams = false;

  // Solution modal
  selectedSolution: SolutionFullInfo | null = null;
  showSolutionModal = false;
  sendingToReview = false;
  solutionUrl = '';
  savingSolutionUrl = false;

  // Pending candidates
  showPendingCandidatesModal = false;
  pendingCandidates: CandidateFullInfo[] = [];
  approvingCandidateId: string | null = null;

  // Validators for team form
  readonly TEAM_NAME_MIN_LENGTH = 2;
  readonly TEAM_NAME_MAX_LENGTH = 50;
  readonly TEAM_DESC_MIN_LENGTH = 5;
  readonly TEAM_DESC_MAX_LENGTH = 200;

  ngOnInit() {
    this.profileForm = this.fb.group({
      surname: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      patronymic: [''],
      city: [''],
      about: ['']
    });
    this.loadCandidate();
    this.loadFilterTechnologies();
    this.loadSolutions();
  }

  private loadCandidate(): void {
    const session = this.authService.currentUser();
    if (session && session.userId) {
      this.candidatesService.getCandidate(session.userId).subscribe({
        next: (candidate) => {
          this.candidate = candidate;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load candidate:', error);
          this.cdr.markForCheck();
        }
      });
    }
  }

  private loadAvailableAssignments(): void {
    const today = new Date();
    const fromDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const toDate = '2099-12-31'; // Very far date

    const technologiesIds = this.selectedTechs.length > 0
      ? this.selectedTechs.map(t => t.id)
      : undefined;

    const isGrouped = this.projectTypeFilter === 'all'
      ? undefined
      : this.projectTypeFilter === 'group';

    // Исключаем задания, куда уже есть решения или заявки на вступление
    const currentUserId = this.authService.currentUser()?.userId;
    const pendingSolutionIds = this.solutions
      .filter(s => s.candidatesJoinRequested?.some(c => c.id === currentUserId))
      .map(s => s.assignment.id);

    const excludedIds = [
      ...new Set([
        ...this.solutions.map(s => s.assignment.id),
        ...pendingSolutionIds
      ])
    ];

    const searchRequest: AssignmentSearchRequest = {
      text: this.availableSearchText || undefined,
      take: 100,
      skip: 0,
      excludedIds,
      technologiesIds,
      isGrouped,
      deadLineRangeIncluded: {
        from: fromDate,
        to: toDate
      }
    };
    this.assignmentsService.searchAssignments(searchRequest).subscribe({
      next: (response) => {
        this.availableAssignments = response.items || [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load assignments:', error);
        this.cdr.markForCheck();
      }
    });
  }

  private loadFilterTechnologies(): void {
    this.loadingFilterTechs = true;
    this.technologiesService.searchTechnologies({ take: 1000, skip: 0 }).subscribe({
      next: (response) => {
        this.allFilterTechs = (response.items || []).sort((a, b) => a.name.localeCompare(b.name));
        // Показываем первые 20 технологий в sidebar
        this.displayFilterTechs = this.allFilterTechs.slice(0, 20);
        this.loadingFilterTechs = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load filter technologies:', error);
        this.loadingFilterTechs = false;
        this.cdr.markForCheck();
      }
    });
  }

  openShowAllModal(): void {
    this.showAllTechsModal = true;
    this.showAllTechsSearch = '';
    this.filteredShowAllTechs = [...this.allFilterTechs];
  }

  closeShowAllModal(): void {
    this.showAllTechsModal = false;
    this.showAllTechsSearch = '';
  }

  onShowAllTechsSearch(): void {
    const query = this.showAllTechsSearch.trim().toLowerCase();
    if (query) {
      this.filteredShowAllTechs = this.allFilterTechs.filter(t =>
        t.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredShowAllTechs = [...this.allFilterTechs];
    }
  }

  private loadSolutions(): void {
    const technologiesIds = this.selectedTechs.length > 0
      ? this.selectedTechs.map(t => t.id)
      : undefined;

    const searchRequest: SolutionSearchRequest = {
      candidateId: this.authService.currentUser()?.userId,
      take: 100,
      skip: 0,
      technologiesIds
    };
    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        this.solutions = response.items || [];
        this.cdr.markForCheck();
        // Загружаем задания после загрузки решений
        this.loadAvailableAssignments();
      },
      error: (error) => {
        console.error('Failed to load solutions:', error);
        this.cdr.markForCheck();
      }
    });
  }

  onTabChange(tab: 'available' | 'waiting-start' | 'in-progress' | 'review' | 'archive'): void {
    this.activeTab = tab;
    this.loadSolutions();
  }

  onAvailableSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadAvailableAssignments();
    }, 300);
  }

  applyFilters(): void {
    this.loadAvailableAssignments();
    this.loadSolutions();
  }

  getTabCount(tab: string): number {
    if (tab === 'available') {
      return this.filteredAvailableAssignments.length;
    }

    const filtered = this.filteredSolutions;
    return filtered.filter(solution => {
      const state = solution.state;

      switch (tab) {
        case 'waiting-start':
          return state === 'NotStarted';
        case 'in-progress':
          return state === 'InProgress';
        case 'review':
          return state === 'Autotests' || state === 'AiReview' || state === 'ExpertReview' || state === 'RequiresImprovements';
        case 'archive':
          return state === 'Done' || state === 'Failed';
        default:
          return false;
      }
    }).length;
  }

  getSolutionsForTab(tab: string): SolutionFullInfo[] {
    const filtered = this.filteredSolutions;
    return filtered.filter(solution => {
      const state = solution.state;

      switch (tab) {
        case 'waiting-start':
          return state === 'NotStarted';
        case 'in-progress':
          return state === 'InProgress';
        case 'review':
          return state === 'Autotests' || state === 'AiReview' || state === 'ExpertReview' || state === 'RequiresImprovements';
        case 'archive':
          return state === 'Done' || state === 'Failed';
        default:
          return false;
      }
    });
  }

  getSolutionCardClass(solution: SolutionFullInfo): string {
    if (solution.state === 'RequiresImprovements') {
      return 'border-2 border-red-500 bg-red-50 p-6 hover:shadow-lg transition-all';
    }
    return solution.assignment.isGrouped
      ? 'border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all'
      : 'border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all';
  }

  getAssignmentMaxAttempts(assignment: AssignmentFullInfo): number {
    return assignment.attemptsCoefficients?.length || 0;
  }

  getDifficultyLabel(difficulty: AssignmentDifficulty): string {
    const labels: Record<AssignmentDifficulty, string> = {
      Normal: 'Обычная',
      Advanced: 'Продвинутая',
      Hard: 'Сложная'
    };
    return labels[difficulty] || difficulty;
  }

  formatAttemptCoefficients(assignment: AssignmentFullInfo): string {
    const coefficients = assignment.attemptsCoefficients ?? [];
    if (!coefficients.length) {
      return 'Не заданы';
    }
    return coefficients
      .map((coefficient, index) => `${coefficient}`)
      .join(', ');
  }

  openProfileEdit() {
    if (this.candidate) {
      this.profileForm.patchValue({
        surname: this.candidate.surname,
        name: this.candidate.name,
        patronymic: this.candidate.patronymic || '',
        city: this.candidate.city || '',
        about: this.candidate.about || ''
      });
      // Копируем технологии кандидата для редактирования (не влияя на фильтр)
      this.profileTechs = this.candidate.technologies?.map(t => ({ ...t })) || [];
      console.log('openProfileEdit: candidate.technologies =', this.candidate.technologies);
      console.log('openProfileEdit: profileTechs =', this.profileTechs);
    }
    this.showProfileEdit = true;
    this.loadTechnologies();
  }

  closeProfileEdit(): void {
    this.showProfileEdit = false;
    this.profileTechs = [];
  }

  getLastExpertReviewComment(solution: SolutionFullInfo): string {
    const reviews = solution.expertReviews ?? [];
    return reviews
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.comment ?? '';
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

  getStateLabel(state: SolutionState): string {
    const labels: Record<string, string> = {
      'NotStarted': 'Ожидает начала',
      'InProgress': 'В работе',
      'Reopened': 'Открыто повторно',
      'Autotests': 'Автотесты',
      'AiReview': 'AI проверка',
      'ExpertReview': 'Проверка экспертом',
      'RequiresImprovements': 'Требуются дополнения'
    };
    return labels[state] || state;
  }

  getStageBadgeClass(currentState: SolutionState, stage: 'Autotests' | 'AiReview' | 'ExpertReview'): string {
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

  getReviewStageClass(currentState: SolutionState, stage: 'Autotests' | 'AiReview' | 'ExpertReview'): string {
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

  getStageNumber(currentState: SolutionState, stage: 'Autotests' | 'AiReview' | 'ExpertReview'): string {
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
      case 'RequiresImprovements':
        return 'Эксперт вернул решение на доработку. Посмотрите комментарии ниже, внесите изменения и отправьте решение на проверку повторно.';
      default:
        return 'Неизвестный статус проверки.';
    }
  }

  openAssignmentModal(assignment: AssignmentFullInfo): void {
    this.selectedAssignment = assignment;
    this.showAssignmentModal = true;
    // Сбрасываем форму команды
    this.teamName = '';
    this.teamDescription = '';
    this.assignmentTeams = [];
    this.displayTeams = [];

    // Загружаем команды для группового проекта
    if (assignment.isGrouped) {
      this.loadAssignmentTeams(assignment.id);
    }
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.selectedAssignment = null;
  }

  openSolutionModal(solution: SolutionFullInfo): void {
    this.selectedSolution = solution;
    this.showSolutionModal = true;
    this.solutionUrl = solution.solutionUrl || '';
  }

  closeSolutionModal(): void {
    this.showSolutionModal = false;
    this.selectedSolution = null;
  }

  navigateToJoinSolution(): void {
    this.closeAssignmentModal();
    this.router.navigate(['/join-solution']);
  }

  private loadAssignmentTeams(assignmentId: string): void {
    this.loadingAssignmentTeams = true;
    this.assignmentTeams = [];
    this.displayTeams = [];

    const currentUserId = this.authService.currentUser()?.userId;

    const searchRequest: SolutionSearchRequest = {
      assignmentId: assignmentId,
      take: 100,
      skip: 0,
      isAvailableToJoin: true,
      excludeCandidateOwnerId: currentUserId,
      excludeCandidateJoinRequestedId: currentUserId
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        const solutions = response.items || [];
        // Фильтруем только групповые решения с командой
        this.assignmentTeams = solutions
          .filter(s => s.assignment.isGrouped && s.team)
          .map(s => ({
            solutionId: s.id,
            name: s.team!.name,
            membersCount: s.candidates.length
          }));

        // Показываем максимум 3 команды
        this.displayTeams = this.assignmentTeams.slice(0, 3);
        this.loadingAssignmentTeams = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load assignment teams:', error);
        this.loadingAssignmentTeams = false;
        this.cdr.markForCheck();
      }
    });
  }

  joinTeamSolution(solutionId: string): void {
    this.closeAssignmentModal();
    this.solutionsService.requestJoinSolution(solutionId).subscribe({
      next: () => {
        this.notificationService.success('Запрос на присоединение к команде отправлен');
        this.loadSolutions();
      },
      error: (error) => {
        console.error('Failed to join team solution:', error);
        const errorMessage = error?.error?.message || error?.message || 'Не удалось отправить запрос. Попробуйте позже.';
        this.notificationService.error(`Ошибка: ${errorMessage}`);
      }
    });
  }

  get currentUserId(): string | null {
    return this.authService.currentUser()?.userId || null;
  }

  openPendingCandidatesModal(): void {
    this.pendingCandidates = this.selectedSolution?.candidatesJoinRequested || [];
    this.showPendingCandidatesModal = true;
  }

  closePendingCandidatesModal(): void {
    this.showPendingCandidatesModal = false;
    this.pendingCandidates = [];
  }

  approveCandidate(candidateId: string): void {
    if (!this.selectedSolution) return;

    // Проверяем, есть ли свободные места
    if (this.selectedSolution.candidates.length >= this.selectedSolution.assignment.candidatesCapacity) {
      this.notificationService.warning('Нет свободных мест в команде');
      return;
    }

    this.approvingCandidateId = candidateId;
    this.cdr.markForCheck();

    this.solutionsService.acceptJoinRequest(this.selectedSolution.id, candidateId).subscribe({
      next: () => {
        this.notificationService.success('Кандидат одобрен');
        this.approvingCandidateId = null;
        // Обновляем модалку и списки
        if (this.selectedSolution?.candidatesJoinRequested) {
          // Находим одобренного кандидата
          const approvedCandidate = this.selectedSolution.candidatesJoinRequested.find(c => c.id === candidateId);
          // Удаляем из pending
          this.selectedSolution.candidatesJoinRequested = this.selectedSolution.candidatesJoinRequested.filter(c => c.id !== candidateId);
          this.pendingCandidates = this.pendingCandidates.filter(c => c.id !== candidateId);
          // Добавляем в команду (если есть место)
          if (this.selectedSolution.candidates.length < this.selectedSolution.assignment.candidatesCapacity && approvedCandidate) {
            this.selectedSolution.candidates.push(approvedCandidate as CandidateFullInfo);
          }
        }
        this.loadSolutions();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to approve candidate:', error);
        const errorMessage = error?.error?.message || error?.message || 'Не удалось одобрить кандидата. Попробуйте позже.';
        this.notificationService.error(`Ошибка: ${errorMessage}`);
        this.approvingCandidateId = null;
        this.cdr.markForCheck();
      }
    });
  }

  startSolution(solution: SolutionFullInfo): void {
    if (!solution.id) return;

    // Для групповых проектов с недостаточным количеством участников - предупреждение
    if (solution.assignment.isGrouped && solution.candidates.length < solution.assignment.candidatesCapacity) {
      const confirmed = confirm(
        `ВНИМАНИЕ: В команде только ${solution.candidates.length} из ${solution.assignment.candidatesCapacity} участников.\n\n` +
        `Вы всё равно хотите взять задание в работу?`
      );
      if (!confirmed) return;
    }

    this.solutionsService.startSolution(solution.id).subscribe({
      next: () => {
        this.notificationService.success('Задание взято в работу!');
        this.closeSolutionModal();
        this.loadSolutions();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to start solution:', error);
        this.notificationService.error('Не удалось взять задание в работу. Попробуйте позже.');
        this.cdr.markForCheck();
      }
    });
  }

  copySolutionId(solutionId: string): void {
    navigator.clipboard.writeText(solutionId).then(() => {
      this.notificationService.success('ID решения скопирован в буфер обмена!');
    }).catch((err) => {
      console.error('Failed to copy solution ID:', err);
      this.notificationService.error('Не удалось скопировать ID. Попробуйте вручную.');
    });
  }

  sendToReview(solution: SolutionFullInfo): void {
    if (!solution.id) return;

    this.sendingToReview = true;
    this.cdr.markForCheck();

    this.solutionsService.sendToReview(solution.id).subscribe({
      next: () => {
        this.notificationService.success('Решение отправлено на проверку!');
        this.closeSolutionModal();
        this.loadSolutions();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to send to review:', error);
        this.notificationService.error('Не удалось отправить решение на проверку. Попробуйте позже.');
        this.sendingToReview = false;
        this.cdr.markForCheck();
      }
    });
  }

  canSendToReview(solution: SolutionFullInfo): boolean {
    if (!solution) return false;
    if (!solution.solutionUrl || solution.solutionUrl.trim() === '') return false;
    const currentUserId = this.authService.currentUser()?.userId;
    if (!currentUserId) return false;
    return solution.candidateOwner.id === currentUserId;
  }

  getSendToReviewDisabledReason(solution: SolutionFullInfo): string | null {
    if (!solution.solutionUrl || solution.solutionUrl.trim() === '') {
      return 'Сначала добавьте ссылку на решение';
    }
    const currentUserId = this.authService.currentUser()?.userId;
    if (!currentUserId) return 'Не удалось определить пользователя';
    if (solution.candidateOwner.id !== currentUserId) {
      return 'Только владелец решения может отправить его на проверку';
    }
    return null;
  }

  saveSolutionUrl(solution: SolutionFullInfo): void {
    if (!solution.id) return;

    this.savingSolutionUrl = true;
    this.cdr.markForCheck();

    const patchRequest = { solutionUrl: this.solutionUrl };

    this.solutionsService.updateSolution(solution.id, patchRequest).subscribe({
      next: (updated) => {
        this.notificationService.success('Ссылка сохранена!');
        this.selectedSolution = updated;
        this.loadSolutions();
        this.savingSolutionUrl = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to save solution URL:', error);
        this.notificationService.error('Не удалось сохранить ссылку. Попробуйте позже.');
        this.savingSolutionUrl = false;
        this.cdr.markForCheck();
      }
    });
  }

  getDaysRemaining(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  get isTeamFormValid(): boolean {
    if (!this.selectedAssignment?.isGrouped) return true;

    const nameLength = this.teamName.trim().length;
    const nameValid = nameLength >= this.TEAM_NAME_MIN_LENGTH &&
                      nameLength <= this.TEAM_NAME_MAX_LENGTH;

    // Описание не обязательное, но если введено - должно быть в пределах лимита
    const descLength = this.teamDescription.trim().length;
    const descValid = descLength === 0 ||
                      (descLength >= this.TEAM_DESC_MIN_LENGTH && descLength <= this.TEAM_DESC_MAX_LENGTH);

    return nameValid && descValid;
  }

  get canTakeAssignment(): boolean {
    if (this.takingAssignment) return false;
    if (!this.selectedAssignment) return false;

    if (this.selectedAssignment.isGrouped) {
      return this.isTeamFormValid;
    }
    return true;
  }

  get teamNameError(): string | null {
    if (!this.selectedAssignment?.isGrouped) return null;

    const nameLength = this.teamName.trim().length;
    if (nameLength === 0) return 'Введите название команды';
    if (nameLength < this.TEAM_NAME_MIN_LENGTH) return `Минимум ${this.TEAM_NAME_MIN_LENGTH} символа`;
    if (nameLength > this.TEAM_NAME_MAX_LENGTH) return `Максимум ${this.TEAM_NAME_MAX_LENGTH} символов`;
    return null;
  }

  get teamDescriptionError(): string | null {
    if (!this.selectedAssignment?.isGrouped) return null;

    const descLength = this.teamDescription.trim().length;
    // Описание не обязательное
    if (descLength === 0) return null;
    if (descLength < this.TEAM_DESC_MIN_LENGTH) return `Минимум ${this.TEAM_DESC_MIN_LENGTH} символов`;
    if (descLength > this.TEAM_DESC_MAX_LENGTH) return `Максимум ${this.TEAM_DESC_MAX_LENGTH} символов`;
    return null;
  }

  async takeAssignment(): Promise<void> {
    if (!this.selectedAssignment || !this.canTakeAssignment) return;

    this.takingAssignment = true;
    this.cdr.markForCheck();

    try {
      const request = {
        assignmentId: this.selectedAssignment.id,
        team: this.selectedAssignment.isGrouped ? {
          name: this.teamName.trim(),
          description: this.teamDescription.trim()
        } : undefined
      };

      await this.solutionsService.createSolution(request).toPromise();

      this.notificationService.success('Задание успешно взято!');
      this.closeAssignmentModal();
      // Перезагружаем решения для обновления счётчиков в табах
      this.loadSolutions();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to take assignment:', error);
      this.notificationService.error('Не удалось взять задание. Попробуйте позже.');
      this.cdr.markForCheck();
    } finally {
      this.takingAssignment = false;
      this.cdr.markForCheck();
    }
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid || !this.candidate) return;

    console.log('saveProfile: profileTechs =', this.profileTechs);
    console.log('saveProfile: candidate.technologies =', this.candidate.technologies);

    this.savingProfile = true;
    this.cdr.markForCheck();

    try {
      const formValue = this.profileForm.value;

      // Определяем изменения в технологиях
      const currentTechIds = this.candidate.technologies?.map(t => t.id) || [];
      const newTechIds = this.profileTechs.map(t => t.id);
      const addedTechs = newTechIds.filter(id => !currentTechIds.includes(id));
      const removedTechs = currentTechIds.filter(id => !newTechIds.includes(id));

      console.log('Current tech IDs:', currentTechIds);
      console.log('New tech IDs:', newTechIds);
      console.log('Added:', addedTechs);
      console.log('Removed:', removedTechs);

      const patchRequest: CandidatePatchApiRequest = {
        surname: formValue.surname !== this.candidate.surname ? formValue.surname : undefined,
        name: formValue.name !== this.candidate.name ? formValue.name : undefined,
        patronymic: formValue.patronymic !== this.candidate.patronymic
          ? { value: formValue.patronymic || null, isSet: true } as NullablePatch<string>
          : undefined,
        city: formValue.city !== this.candidate.city ? formValue.city : undefined,
        about: formValue.about !== this.candidate.about ? formValue.about : undefined,
        technologies: (addedTechs.length > 0 || removedTechs.length > 0)
          ? { toAdd: addedTechs, toRemove: removedTechs } as RelationsPatch
          : undefined
      };

      console.log('Patch request:', patchRequest);

      await this.candidatesService.updateCandidate(this.candidate.id, patchRequest).toPromise();

      // Reload candidate data
      this.loadCandidate();
      this.closeProfileEdit();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to update profile:', error);
      this.notificationService.error('Не удалось обновить профиль. Попробуйте позже.');
      this.cdr.markForCheck();
    } finally {
      this.savingProfile = false;
      this.cdr.markForCheck();
    }
  }

  // Technology modal methods
  techModalMode: 'filter' | 'profile' = 'filter';

  openTechModal(): void {
    this.techModalMode = 'filter';
    this.showTechModal = true;
    this.techSearchQuery = '';
    this.filteredTechs = this.allTechs;
    this.hasSearched = false;
    this.loadTechnologies();
  }

  closeTechModal(): void {
    this.showTechModal = false;
    this.techSearchQuery = '';
  }

  openTechModalForProfile(): void {
    this.techModalMode = 'profile';
    this.showTechModal = true;
    this.techSearchQuery = '';
    this.filteredTechs = this.allTechs;
    this.hasSearched = false;
    this.loadTechnologies();
  }

  closeTechModalForProfile(): void {
    this.showTechModal = false;
    this.techSearchQuery = '';
  }

  toggleTechForProfile(tech: Technology): void {
    const index = this.profileTechs.findIndex(t => t.id === tech.id);
    if (index > -1) {
      this.profileTechs.splice(index, 1);
    } else {
      this.profileTechs.push({ ...tech });
    }
  }

  saveTechsToProfile(): void {
    this.closeTechModalForProfile();
  }

  private loadTechnologies(): void {
    if (this.allTechs.length > 0) return; // Already loaded

    this.loadingTechs = true;
    this.cdr.markForCheck();
    this.technologiesService.searchTechnologies({}).subscribe({
      next: (response) => {
        this.allTechs = response?.items || [];
        this.filteredTechs = this.allTechs;
        this.loadingTechs = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load technologies:', error);
        this.loadingTechs = false;
        this.cdr.markForCheck();
      }
    });
  }

  onTechSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const query = this.techSearchQuery.trim();
      if (query) {
        this.loadingTechs = true;
        this.hasSearched = true;
        this.cdr.markForCheck();
        this.technologiesService.searchTechnologies({ name: query }).subscribe({
          next: (response) => {
            this.filteredTechs = response?.items || [];
            this.loadingTechs = false;
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Search error:', error);
            this.filteredTechs = this.allTechs.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
            this.loadingTechs = false;
            this.cdr.markForCheck();
          }
        });
      } else {
        this.filteredTechs = this.allTechs;
        this.hasSearched = false;
        this.cdr.markForCheck();
      }
    }, 300);
  }

  toggleTech(tech: Technology): void {
    const index = this.selectedTechs.findIndex(t => t.id === tech.id);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    } else {
      this.selectedTechs.push(tech);
    }
    this.applyFilters();
  }

  removeTech(techId: string): void {
    const index = this.selectedTechs.findIndex(t => t.id === techId);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    }
  }

  removeTechFromProfile(techId: string): void {
    const index = this.profileTechs.findIndex(t => t.id === techId);
    if (index > -1) {
      this.profileTechs.splice(index, 1);
    }
  }

  get filteredAvailableAssignments(): AssignmentFullInfo[] {
    return this.availableAssignments;
  }

  get filteredSolutions(): SolutionFullInfo[] {
    let result = this.solutions;

    // Filter by project type
    if (this.projectTypeFilter === 'group') {
      result = result.filter(solution => solution.assignment.isGrouped === true);
    } else if (this.projectTypeFilter === 'individual') {
      result = result.filter(solution => solution.assignment.isGrouped === false);
    }

    return result;
  }
}
