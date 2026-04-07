import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, AssignmentsService, TalentBridgeRepository, TechnologiesService, SolutionsService } from '../core';
import { NavbarComponent } from '../shared/components/navbar.component';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';
import { ReviewProgressComponent } from '../shared/components/review-progress.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { EmployerCandidate, EmployerProfile, Submission } from '../core/models/domain.models';
import { AssignmentFullInfo, AssignmentSearchRequest, AssignmentUpdateEntity, AssignmentCreateApiRequest, RelationsPatch, Technology, SolutionState, SolutionSearchRequest } from '../core/models/api.models';
import { AVAILABLE_TECHS } from '../shared/utils/constants';
import { NotificationService } from '../core/services/notification.service';

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
<!--            <a [routerLink]="'/candidates-ranking'" class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider bg-white">-->
<!--              РЕЙТИНГ КАНДИДАТОВ-->
<!--            </a>-->
            <button
              (click)="openCreateModal()"
              class="border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider">
              + СОЗДАТЬ ЗАДАНИЕ
            </button>
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
              ✏️ Редактировать
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
            <div *ngFor="let assignment of publishedAssignments" [class]="assignment.isGrouped ? 'border-2 border-amber-400 bg-white p-6 shadow-md' : 'border-2 border-emerald-400 bg-white p-6 shadow-md'">
              <div class="flex justify-between items-start gap-4 flex-wrap">
                <div class="flex-1">
                  <h3 class="font-bold text-lg mb-2 uppercase">{{ assignment.name }}</h3>
                  <a
                    *ngIf="assignment.templateUrl"
                    [href]="assignment.templateUrl"
                    target="_blank"
                    class="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-2">
                    🔗 {{ assignment.templateUrl }}
                  </a>
                  <div class="flex gap-6 text-sm">
                    <p><span class="font-bold uppercase">ДЕДЛАЙН:</span> {{ assignment.deadLine | date:'dd.MM.yyyy' }}</p>
                    <p><span class="font-bold uppercase">УЧАСТНИКОВ:</span> {{ assignment.candidatesCapacity }}</p>
                    <p><span class="font-bold uppercase">ТИП:</span> {{ assignment.isGrouped ? 'ГРУППОВОЕ' : 'ИНДИВИДУАЛЬНОЕ' }}</p>
                  </div>
                  <div class="flex gap-4 mt-2 text-sm">
                    <p>
                      <span class="font-bold uppercase">РЕШЕНИЙ:</span>
                      <span class="font-semibold">{{ assignmentStats.get(assignment.id)?.total ?? 0 }}</span>
                    </p>
                    <p *ngIf="(assignmentStats.get(assignment.id)?.inReview ?? 0) > 0">
                      <span class="font-bold uppercase">НА ПРОВЕРКЕ:</span>
                      <span class="font-semibold text-emerald-600">{{ assignmentStats.get(assignment.id)?.inReview }}</span>
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span *ngFor="let tech of assignment.technologies" class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-300">
                      {{ tech.name }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <a
                    [routerLink]="['/assignment', assignment.id, 'solutions']"
                    class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors text-sm uppercase font-semibold">
                    👁️ Просмотр решений
                  </a>
                  <button
                    (click)="openEditAssignmentModal(assignment)"
                    class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase font-semibold">
                    РЕДАКТИРОВАТЬ
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="publishedAssignments.length === 0" class="text-center py-8 text-gray-500">
              У вас пока нет опубликованных заданий
            </div>
          </div>
        </div>

        <!-- Candidates and Solutions Table -->
<!--        <div>-->
<!--          <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">КАНДИДАТЫ И РЕШЕНИЯ</h2>-->
<!--          <div class="border-2 border-emerald-600 bg-white shadow-md overflow-hidden">-->
<!--            &lt;!&ndash; Table Header &ndash;&gt;-->
<!--            <div class="grid grid-cols-6 gap-4 p-4 bg-emerald-50 border-b-2 border-emerald-600 font-bold text-sm uppercase">-->
<!--              <div>Кандидат</div>-->
<!--              <div>Задание</div>-->
<!--              <div>Дата</div>-->
<!--              <div>Этап</div>-->
<!--              <div>Статус</div>-->
<!--              <div>Действия</div>-->
<!--            </div>-->

<!--            &lt;!&ndash; Table Rows &ndash;&gt;-->
<!--            <div *ngFor="let candidate of candidates" class="grid grid-cols-6 gap-4 p-4 border-b-2 border-emerald-200 last:border-b-0 items-center text-sm">-->
<!--              <a [routerLink]="['/candidate', candidate.id]" class="font-bold hover:text-emerald-600 cursor-pointer">{{ candidate.name }}</a>-->
<!--              <div class="text-xs">{{ candidate.taskTitle }}</div>-->
<!--              <div class="text-xs text-gray-500">{{ candidate.submittedDate }}</div>-->
<!--              <div class="text-xs uppercase text-gray-700">-->
<!--                <span *ngIf="candidate.currentStage === 'autoTests'">Автотесты</span>-->
<!--                <span *ngIf="candidate.currentStage === 'aiAnalysis'">АО-Анализ</span>-->
<!--                <span *ngIf="candidate.currentStage === 'expertReview'">Эксперт</span>-->
<!--              </div>-->
<!--              <div><app-status-badge [status]="candidate.stageStatus"></app-status-badge></div>-->
<!--              <div class="flex gap-2">-->
<!--                <button-->
<!--                  *ngIf="candidate.stageStatus === 'pending' && candidate.currentStage === 'expertReview'"-->
<!--                  (click)="openExpertReviewModal(candidate.submissionId)"-->
<!--                  class="border-2 border-indigo-600 bg-indigo-600 text-white px-3 py-1 hover:bg-indigo-700 transition-colors text-xs uppercase font-semibold">-->
<!--                  ПРОВЕРИТь-->
<!--                </button>-->
<!--                <a [routerLink]="['/candidate', candidate.id]" class="border-2 border-emerald-600 px-3 py-1 hover:bg-emerald-600 hover:text-white transition-colors text-xs uppercase font-semibold">-->
<!--                  ПРОФИЛЬ-->
<!--                </a>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>

      <!-- Expert Review Modal -->
      <div *ngIf="showExpertReviewModal && selectedSubmission" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-8 z-[9999]">
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

      <!-- Edit Assignment Modal -->
      <div *ngIf="showEditAssignmentModal && editingAssignment" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeEditAssignmentModal()">
        <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-indigo-600 uppercase">РЕДАКТИРОВАНИЕ ЗАДАНИЯ</h2>
            <button (click)="closeEditAssignmentModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
          </div>

          <form (ngSubmit)="saveAssignment()" class="flex-1 overflow-y-auto pr-2 space-y-6">
            <!-- Name -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЗВАНИЕ ЗАДАНИЯ</label>
              <input
                type="text"
                [(ngModel)]="editForm.name"
                name="editName"
                #nameInput="ngModel"
                class="w-full border-2 border-black p-3"
                [class.border-red-500]="nameInput.invalid && nameInput.touched"
                placeholder="Например: REST API для системы управления задачами"
                required
                minlength="5"
                maxlength="100" />
              <p *ngIf="nameInput.invalid && nameInput.touched" class="text-red-600 text-xs mt-1">
                Название должно быть от 5 до 100 символов
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОПИСАНИЕ ПРОЕКТА</label>
              <textarea
                [(ngModel)]="editForm.description"
                name="editDescription"
                #descInput="ngModel"
                class="w-full border-2 border-black p-3 min-h-[120px]"
                [class.border-red-500]="descInput.invalid && descInput.touched"
                placeholder="Опишите цели, требования и особенности проекта"
                required
                minlength="10"
                maxlength="2000"></textarea>
              <p *ngIf="descInput.invalid && descInput.touched" class="text-red-600 text-xs mt-1">
                Описание должно быть от 10 до 2000 символов
              </p>
            </div>

            <!-- Template URL -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ССЫЛКА НА ШАБЛОН (РЕПОЗИТОРИЙ)</label>
              <input
                type="url"
                [(ngModel)]="editForm.templateUrl"
                name="editTemplateUrl"
                #urlInput="ngModel"
                class="w-full border-2 border-black p-3"
                [class.border-red-500]="urlInput.invalid && urlInput.touched"
                placeholder="https://github.com/username/repo"
                required
                pattern="https?://.+" />
              <p *ngIf="urlInput.invalid && urlInput.touched" class="text-red-600 text-xs mt-1">
                Введите корректный URL (начинается с http:// или https://)
              </p>
            </div>

            <!-- Deadline & Capacity -->
            <div class="grid gap-4" [class.grid-cols-2]="editForm.isGrouped">
              <div [class.col-span-2]="!editForm.isGrouped">
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ДЕДЛАЙН</label>
                <input
                  type="date"
                  [(ngModel)]="editForm.deadLine"
                  name="editDeadLine"
                  #deadlineInput="ngModel"
                  class="w-full border-2 border-black p-3"
                  [class.border-red-500]="deadlineInput.invalid && deadlineInput.touched"
                  required />
              </div>
              <div *ngIf="editForm.isGrouped">
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">МАКС. УЧАСТНИКОВ</label>
                <input
                  type="number"
                  [(ngModel)]="editForm.candidatesCapacity"
                  name="editCandidatesCapacity"
                  #capacityInput="ngModel"
                  class="w-full border-2 border-black p-3"
                  [class.border-red-500]="capacityInput.invalid && capacityInput.touched"
                  min="2"
                  max="20"
                  required />
                <p *ngIf="capacityInput.invalid && capacityInput.touched" class="text-red-600 text-xs mt-1">
                  От 2 до 20 участников
                </p>
              </div>
            </div>

            <!-- Task Type -->
            <div>
              <label class="block font-bold mb-3 text-sm uppercase tracking-wider">ТИП ЗАДАНИЯ</label>
              <div class="border-2 border-black p-6 space-y-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    [checked]="!editForm.isGrouped"
                    (change)="editForm.isGrouped = false"
                    name="editTaskType"
                    class="w-5 h-5 mt-0.5 border-2 border-black" />
                  <div>
                    <span class="font-bold uppercase">ИНДИВИДУАЛЬНОЕ</span>
                    <p class="text-sm text-gray-600 mt-1">Задание выполняется одним кандидатом</p>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    [checked]="editForm.isGrouped"
                    (change)="editForm.isGrouped = true"
                    name="editTaskType"
                    class="w-5 h-5 mt-0.5 border-2 border-black" />
                  <div>
                    <span class="font-bold uppercase">КОМАНДНОЕ</span>
                    <p class="text-sm text-gray-600 mt-1">Задание выполняется командой кандидатов</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Technologies -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block font-bold text-sm uppercase tracking-wider">ТЕХНОЛОГИИ</label>
                <button
                  type="button"
                  (click)="openTechModal()"
                  class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors text-sm uppercase font-semibold flex items-center gap-2">
                  <span class="text-lg">+</span> ДОБАВИТЬ
                </button>
              </div>
              <div class="flex flex-wrap gap-2 min-h-[50px] border-2 border-gray-300 p-3">
                <div *ngFor="let tech of selectedTechs" class="px-3 py-1.5 border-2 border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold text-sm flex items-center gap-2">
                  {{ tech.name }}
                  <button type="button" (click)="removeTech(tech.id)" class="text-lg hover:opacity-70">×</button>
                </div>
                <div *ngIf="selectedTechs.length === 0" class="text-gray-500 text-sm">Технологии не выбраны</div>
              </div>
            </div>
          </form>

          <!-- Footer -->
          <div class="flex gap-4 mt-6 pt-6 border-t-2">
            <button
              (click)="saveAssignment()"
              [disabled]="savingAssignment || !isFormValid()"
              class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              [class]="isFormValid() && !savingAssignment ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500'">
              {{ savingAssignment ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ' }}
            </button>
            <button
              (click)="closeEditAssignmentModal()"
              class="flex-1 border-2 border-gray-400 px-8 py-3 hover:bg-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
              ОТМЕНА
            </button>
          </div>
        </div>
      </div>

      <!-- Create Assignment Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeCreateModal()">
        <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-indigo-600 uppercase">СОЗДАНИЕ НОВОГО ЗАДАНИЯ</h2>
            <button (click)="closeCreateModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
          </div>

          <form (ngSubmit)="createAssignment()" class="flex-1 overflow-y-auto pr-2 space-y-6">
            <!-- Name -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЗВАНИЕ ЗАДАНИЯ</label>
              <input
                type="text"
                [(ngModel)]="createForm.name"
                name="createName"
                #createNameInput="ngModel"
                class="w-full border-2 border-black p-3"
                [class.border-red-500]="createNameInput.invalid && createNameInput.touched"
                placeholder="Например: REST API для системы управления задачами"
                required
                minlength="5"
                maxlength="100" />
              <p *ngIf="createNameInput.invalid && createNameInput.touched" class="text-red-600 text-xs mt-1">
                Название должно быть от 5 до 100 символов
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОПИСАНИЕ ПРОЕКТА</label>
              <textarea
                [(ngModel)]="createForm.description"
                name="createDescription"
                #createDescInput="ngModel"
                class="w-full border-2 border-black p-3 min-h-[120px]"
                [class.border-red-500]="createDescInput.invalid && createDescInput.touched"
                placeholder="Опишите цели, требования и особенности проекта"
                required
                minlength="10"
                maxlength="2000"></textarea>
              <p *ngIf="createDescInput.invalid && createDescInput.touched" class="text-red-600 text-xs mt-1">
                Описание должно быть от 10 до 2000 символов
              </p>
            </div>

            <!-- Template URL -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ССЫЛКА НА ШАБЛОН (РЕПОЗИТОРИЙ)</label>
              <input
                type="url"
                [(ngModel)]="createForm.templateUrl"
                name="createTemplateUrl"
                #createUrlInput="ngModel"
                class="w-full border-2 border-black p-3"
                [class.border-red-500]="createUrlInput.invalid && createUrlInput.touched"
                placeholder="https://github.com/username/repo"
                required
                pattern="https?://.+" />
              <p *ngIf="createUrlInput.invalid && createUrlInput.touched" class="text-red-600 text-xs mt-1">
                Введите корректный URL (начинается с http:// или https://)
              </p>
            </div>

            <!-- Deadline & Capacity -->
            <div class="grid gap-4" [class.grid-cols-2]="createForm.isGrouped">
              <div [class.col-span-2]="!createForm.isGrouped">
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ДЕДЛАЙН</label>
                <input
                  type="date"
                  [(ngModel)]="createForm.deadLine"
                  name="createDeadLine"
                  #createDeadlineInput="ngModel"
                  class="w-full border-2 border-black p-3"
                  [class.border-red-500]="createDeadlineInput.invalid && createDeadlineInput.touched"
                  required />
              </div>
              <div *ngIf="createForm.isGrouped">
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">МАКС. УЧАСТНИКОВ</label>
                <input
                  type="number"
                  [(ngModel)]="createForm.candidatesCapacity"
                  name="createCandidatesCapacity"
                  #createCapacityInput="ngModel"
                  class="w-full border-2 border-black p-3"
                  [class.border-red-500]="createCapacityInput.invalid && createCapacityInput.touched"
                  min="2"
                  max="20"
                  required />
                <p *ngIf="createCapacityInput.invalid && createCapacityInput.touched" class="text-red-600 text-xs mt-1">
                  От 2 до 20 участников
                </p>
              </div>
            </div>

            <!-- Task Type -->
            <div>
              <label class="block font-bold mb-3 text-sm uppercase tracking-wider">ТИП ЗАДАНИЯ</label>
              <div class="border-2 border-black p-6 space-y-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    [checked]="!createForm.isGrouped"
                    (change)="createForm.isGrouped = false"
                    name="createTaskType"
                    class="w-5 h-5 mt-0.5 border-2 border-black" />
                  <div>
                    <span class="font-bold uppercase">ИНДИВИДУАЛЬНОЕ</span>
                    <p class="text-sm text-gray-600 mt-1">Задание выполняется одним кандидатом</p>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    [checked]="createForm.isGrouped"
                    (change)="createForm.isGrouped = true"
                    name="createTaskType"
                    class="w-5 h-5 mt-0.5 border-2 border-black" />
                  <div>
                    <span class="font-bold uppercase">КОМАНДНОЕ</span>
                    <p class="text-sm text-gray-600 mt-1">Задание выполняется командой кандидатов</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Technologies -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block font-bold text-sm uppercase tracking-wider">ТЕХНОЛОГИИ</label>
                <button
                  type="button"
                  (click)="openCreateTechModal()"
                  class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors text-sm uppercase font-semibold flex items-center gap-2">
                  <span class="text-lg">+</span> ДОБАВИТЬ
                </button>
              </div>
              <div class="flex flex-wrap gap-2 min-h-[50px] border-2 border-gray-300 p-3">
                <div *ngFor="let tech of createSelectedTechs" class="px-3 py-1.5 border-2 border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold text-sm flex items-center gap-2">
                  {{ tech.name }}
                  <button type="button" (click)="removeCreateTech(tech.id)" class="text-lg hover:opacity-70">×</button>
                </div>
                <div *ngIf="createSelectedTechs.length === 0" class="text-gray-500 text-sm">Технологии не выбраны</div>
              </div>
            </div>
          </form>

          <!-- Footer -->
          <div class="flex gap-4 mt-6 pt-6 border-t-2">
            <button
              (click)="createAssignment()"
              [disabled]="creatingAssignment || !isCreateFormValid()"
              class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              [class]="isCreateFormValid() && !creatingAssignment ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500'">
              {{ creatingAssignment ? 'СОЗДАНИЕ...' : 'СОЗДАТЬ ЗАДАНИЕ' }}
            </button>
            <button
              (click)="closeCreateModal()"
              class="flex-1 border-2 border-gray-400 px-8 py-3 hover:bg-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
              ОТМЕНА
            </button>
          </div>
        </div>
      </div>

      <!-- Technology Modal -->
      <div *ngIf="showTechModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeTechModal()">
        <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold mb-4 uppercase text-indigo-600">ВЫБЕРИТЕ ТЕХНОЛОГИИ</h3>

          <!-- Search Input -->
          <div class="mb-4">
            <input
              type="text"
              [(ngModel)]="techSearchQuery"
              (ngModelChange)="onTechSearch()"
              class="w-full border-2 border-black p-3 text-sm"
              placeholder="Поиск технологий..."
              autofocus />
          </div>

          <!-- Technologies Grid -->
          <div class="grid grid-cols-3 gap-2 overflow-y-auto max-h-96">
            <label *ngFor="let tech of filteredTechs" class="flex items-center gap-2 text-xs cursor-pointer border-2 p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                [checked]="techModalMode === 'create' ? createSelectedTechs.some(t => t.id === tech.id) : selectedTechs.some(t => t.id === tech.id)"
                (change)="techModalMode === 'create' ? toggleCreateTech(tech) : toggleTech(tech)"
                class="w-4 h-4 border-2 border-black" />
              <span>{{ tech.name }}</span>
            </label>
          </div>

          <!-- Modal Actions -->
          <div class="mt-6 flex gap-2">
            <button
              type="button"
              (click)="techModalMode === 'create' ? closeCreateTechModal() : closeTechModal()"
              class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold">
              ГОТОВО
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly solutionsService = inject(SolutionsService);
  private readonly technologiesService = inject(TechnologiesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly repository = inject(TalentBridgeRepository);
  private readonly notificationService = inject(NotificationService);

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
  publishedAssignments: AssignmentFullInfo[] = [];
  candidates: EmployerCandidate[] = [];
  assignmentStats: Map<string, { total: number; inReview: number }> = new Map();

  // Edit assignment modal
  showEditAssignmentModal = false;
  editingAssignment: AssignmentFullInfo | null = null;
  editForm: {
    name: string;
    description: string;
    templateUrl: string;
    deadLine: string;
    candidatesCapacity: number;
    isGrouped: boolean;
  } = {
    name: '',
    description: '',
    templateUrl: '',
    deadLine: '',
    candidatesCapacity: 1,
    isGrouped: false
  };
  allTechs: Technology[] = [];
  selectedTechs: Technology[] = [];
  techSearchQuery = '';
  filteredTechs: Technology[] = [];
  savingAssignment = false;

  // Create assignment modal
  showCreateModal = false;
  createForm: {
    name: string;
    description: string;
    templateUrl: string;
    deadLine: string;
    candidatesCapacity: number;
    isGrouped: boolean;
  } = {
    name: '',
    description: '',
    templateUrl: '',
    deadLine: '',
    candidatesCapacity: 1,
    isGrouped: false
  };
  createSelectedTechs: Technology[] = [];
  creatingAssignment = false;

  showExpertReviewModal = false;
  selectedSubmission: Submission | null = null;
  expertComment = '';

  ngOnInit() {
    this.profile = this.repository.getEmployerProfile();
    if (this.profile) {
      this.editProfile = { ...this.profile, website: this.profile.website || '' };
    }
    this.candidates = this.repository.getEmployerCandidates();
    this.loadPublishedAssignments();
  }

  private loadAssignmentStats(): void {
    // Загружаем статистику после загрузки заданий
    setTimeout(() => {
      this.publishedAssignments.forEach(assignment => {
        this.loadStatsForAssignment(assignment.id);
      });
    }, 100);
  }

  private loadStatsForAssignment(assignmentId: string): void {
    const searchRequest: SolutionSearchRequest = {
      assignmentId: assignmentId,
      take: 1000,
      skip: 0
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        const solutions = response.items || [];
        const total = solutions.length;
        const inReview = solutions.filter(s => s.state === 'ExpertReview').length;
        this.assignmentStats.set(assignmentId, { total, inReview });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load assignment stats:', error);
        this.cdr.markForCheck();
      }
    });
  }

  private loadPublishedAssignments(): void {
    const employerId = this.authService.currentUser()?.userId;
    if (!employerId) return;

    const searchRequest: AssignmentSearchRequest = {
      employerId: employerId,
      take: 100,
      skip: 0
    };

    this.assignmentsService.searchAssignments(searchRequest).subscribe({
      next: (response) => {
        this.publishedAssignments = response.items || [];
        this.cdr.markForCheck();
        // Загружаем статистику после загрузки заданий
        this.loadAssignmentStats();
      },
      error: (error) => {
        console.error('Failed to load published assignments:', error);
        this.cdr.markForCheck();
      }
    });
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
      this.notificationService.success('Решение одобрено!');
      this.closeExpertReviewModal();
    }
  }

  rejectSubmission() {
    if (this.selectedSubmission) {
      this.notificationService.warning('Решение отклонено!');
      this.closeExpertReviewModal();
    }
  }

  // Edit Assignment Modal Methods
  openEditAssignmentModal(assignment: AssignmentFullInfo): void {
    this.editingAssignment = assignment;
    this.editForm = {
      name: assignment.name,
      description: assignment.description,
      templateUrl: assignment.templateUrl || '',
      deadLine: assignment.deadLine.split('T')[0],
      candidatesCapacity: assignment.candidatesCapacity || 2,
      isGrouped: assignment.isGrouped
    };
    this.selectedTechs = assignment.technologies?.map(t => ({ ...t })) || [];
    this.showEditAssignmentModal = true;
    this.loadAllTechnologies();
  }

  closeEditAssignmentModal(): void {
    this.showEditAssignmentModal = false;
    this.editingAssignment = null;
  }

  saveAssignment(): void {
    if (!this.editingAssignment) return;

    // Проверка валидности формы
    if (!this.isFormValid()) {
      this.notificationService.warning('Заполните все обязательные поля корректно');
      return;
    }

    this.savingAssignment = true;
    this.cdr.markForCheck();

    // Определяем изменения в технологиях
    const currentTechIds = this.editingAssignment.technologies?.map(t => t.id) || [];
    const newTechIds = this.selectedTechs.map(t => t.id);
    const addedTechs = newTechIds.filter(id => !currentTechIds.includes(id));
    const removedTechs = currentTechIds.filter(id => !newTechIds.includes(id));

    const patchRequest: AssignmentUpdateEntity = {
      name: this.editForm.name,
      description: this.editForm.description,
      templateUrl: { value: this.editForm.templateUrl },
      deadLine: this.editForm.deadLine,
      candidatesCapacity: this.editForm.isGrouped ? this.editForm.candidatesCapacity : undefined,
      technologies: (addedTechs.length > 0 || removedTechs.length > 0)
        ? { toAdd: addedTechs, toRemove: removedTechs } as RelationsPatch
        : undefined
    };

    this.assignmentsService.updateAssignment(this.editingAssignment.id, patchRequest).subscribe({
      next: () => {
        this.notificationService.success('Задание успешно обновлено!');
        this.closeEditAssignmentModal();
        this.loadPublishedAssignments();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to update assignment:', error);
        this.notificationService.error('Не удалось обновить задание. Попробуйте позже.');
        this.savingAssignment = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Create Assignment Modal Methods
  openCreateModal(): void {
    this.showCreateModal = true;
    this.createForm = {
      name: '',
      description: '',
      templateUrl: '',
      deadLine: '',
      candidatesCapacity: 1,
      isGrouped: false
    };
    this.createSelectedTechs = [];
    this.loadAllTechnologies();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  isCreateFormValid(): boolean {
    if (!this.createForm.name || this.createForm.name.length < 5 || this.createForm.name.length > 100) return false;
    if (!this.createForm.description || this.createForm.description.length < 10 || this.createForm.description.length > 2000) return false;
    if (!this.createForm.templateUrl || !this.createForm.templateUrl.match(/^https?:\/\//)) return false;
    if (!this.createForm.deadLine) return false;
    if (this.createForm.isGrouped && (this.createForm.candidatesCapacity < 2 || this.createForm.candidatesCapacity > 20)) return false;
    return true;
  }

  createAssignment(): void {
    if (!this.isCreateFormValid()) {
      this.notificationService.warning('Заполните все обязательные поля корректно');
      return;
    }

    this.creatingAssignment = true;
    this.cdr.markForCheck();

    const techIds = this.createSelectedTechs.map(t => t.id);

    const createRequest: AssignmentCreateApiRequest = {
      name: this.createForm.name,
      description: this.createForm.description,
      templateUrl: this.createForm.templateUrl,
      deadLine: this.createForm.deadLine,
      candidatesCapacity: this.createForm.candidatesCapacity,
      technologies: techIds
    };

    this.assignmentsService.createAssignment(createRequest).subscribe({
      next: () => {
        this.notificationService.success('Задание успешно создано!');
        this.closeCreateModal();
        this.loadPublishedAssignments();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to create assignment:', error);
        this.notificationService.error('Не удалось создать задание. Попробуйте позже.');
        this.creatingAssignment = false;
        this.cdr.markForCheck();
      }
    });
  }

  openCreateTechModal(): void {
    this.techModalMode = 'create';
    this.showTechModal = true;
    this.techSearchQuery = '';
    this.filteredTechs = this.allTechs;
  }

  closeCreateTechModal(): void {
    this.showTechModal = false;
    this.techSearchQuery = '';
  }

  toggleCreateTech(tech: Technology): void {
    const index = this.createSelectedTechs.findIndex(t => t.id === tech.id);
    if (index > -1) {
      this.createSelectedTechs.splice(index, 1);
    } else {
      this.createSelectedTechs.push({ ...tech });
    }
  }

  removeCreateTech(techId: string): void {
    const index = this.createSelectedTechs.findIndex(t => t.id === techId);
    if (index > -1) {
      this.createSelectedTechs.splice(index, 1);
    }
  }

  // Technology Modal Methods
  showTechModal = false;
  techModalMode: 'create' | 'edit' = 'edit';

  openTechModal(): void {
    this.techModalMode = 'edit';
    this.showTechModal = true;
    this.techSearchQuery = '';
    this.filteredTechs = this.allTechs;
  }

  loadAllTechnologies(): void {
    if (this.allTechs.length > 0) return;

    this.technologiesService.searchTechnologies({}).subscribe({
      next: (response) => {
        this.allTechs = response?.items || [];
        this.filteredTechs = this.allTechs;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load technologies:', error);
        this.cdr.markForCheck();
      }
    });
  }

  closeTechModal(): void {
    this.showTechModal = false;
    this.techSearchQuery = '';
  }

  onTechSearch(): void {
    const query = this.techSearchQuery.trim().toLowerCase();
    if (query) {
      this.filteredTechs = this.allTechs.filter(t => t.name.toLowerCase().includes(query));
    } else {
      this.filteredTechs = this.allTechs;
    }
  }

  toggleTech(tech: Technology): void {
    const index = this.selectedTechs.findIndex(t => t.id === tech.id);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    } else {
      this.selectedTechs.push({ ...tech });
    }
  }

  removeTech(techId: string): void {
    const index = this.selectedTechs.findIndex(t => t.id === techId);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    }
  }

  isFormValid(): boolean {
    if (!this.editForm.name || this.editForm.name.length < 5 || this.editForm.name.length > 100) return false;
    if (!this.editForm.description || this.editForm.description.length < 10 || this.editForm.description.length > 2000) return false;
    if (!this.editForm.templateUrl || !this.editForm.templateUrl.match(/^https?:\/\//)) return false;
    if (!this.editForm.deadLine) return false;
    if (this.editForm.isGrouped && (this.editForm.candidatesCapacity < 2 || this.editForm.candidatesCapacity > 20)) return false;
    return true;
  }
}
