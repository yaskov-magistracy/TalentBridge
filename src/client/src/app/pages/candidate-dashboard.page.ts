import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AuthService, CandidatesService, TechnologiesService, AssignmentsService, SolutionsService } from '../core';
import { CandidateFullInfo, Technology, CandidatePatchApiRequest, RelationsPatch, NullablePatch, AssignmentFullInfo, AssignmentSearchRequest } from '../core/models/api.models';
import { AVAILABLE_TECHS } from '../shared/utils/constants';

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
          <div *ngIf="showProfileEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="showProfileEdit = false">
            <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
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
                        (click)="openTechModal()"
                        class="border-2 border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors text-sm uppercase font-semibold flex items-center gap-2">
                        <span class="text-lg">+</span> ДОБАВИТЬ НАВЫК
                      </button>
                    </div>

                    <div class="space-y-2">
                      <div *ngFor="let tech of selectedTechs" class="flex items-center gap-2 border-2 p-2">
                        <span class="flex-1 text-sm">{{ tech.name }}</span>
                        <button type="button" (click)="removeTech(tech.id)" class="text-xl hover:opacity-70">🗑️</button>
                      </div>
                      <div *ngIf="selectedTechs.length === 0" class="text-gray-500 text-sm">
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
        <div *ngIf="showTechModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeTechModal()">
          <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
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
                  [checked]="selectedTechs.some(t => t.id === tech.id)"
                  (change)="toggleTech(tech)"
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
                (click)="closeTechModal()"
                class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold">
                ГОТОВО
              </button>
            </div>
          </div>
        </div>

        <!-- Assignment Detail Modal -->
        <div *ngIf="showAssignmentModal && selectedAssignment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeAssignmentModal()">
          <div class="bg-white border-2 border-indigo-600 p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold text-indigo-600 uppercase">{{ selectedAssignment.name }}</h2>
              <button (click)="closeAssignmentModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
            </div>

            <!-- Info Bar -->
            <div class="flex flex-wrap gap-4 mb-4 text-sm">
              <div>
                <span class="font-bold">КОМПАНИЯ:</span> {{ selectedAssignment.employer.name }}
              </div>
              <div>
                <span class="font-bold">ДЕДЛАЙН:</span> {{ selectedAssignment.deadLine | date:'dd.MM.yyyy' }}
              </div>
            </div>

            <!-- Repository Link -->
            <div *ngIf="selectedAssignment.templateUrl" class="mb-4">
              <a
                [href]="selectedAssignment.templateUrl"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                🔗 РЕПОЗИТОРИЙ: {{ selectedAssignment.templateUrl }}
              </a>
            </div>

            <!-- Technologies -->
            <div class="flex flex-wrap gap-2 mb-6">
              <app-tech-chip *ngFor="let tech of selectedAssignment.technologies" [name]="tech.name"></app-tech-chip>
            </div>

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
              <div class="space-y-3">
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

        <div class="flex gap-8">
          <!-- Left Sidebar - Technology Filter -->
          <div class="w-64 flex-shrink-0">
            <div class="border-2 border-indigo-600 bg-white p-6 shadow-md">
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-600">Фильтр по технологиям</h3>
              <div class="space-y-2">
                <label *ngFor="let tech of AVAILABLE_TECHS" class="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="selectedTechs.some(t => t.name === tech)"
                    (change)="toggleTech({ id: '', name: tech })"
                    class="w-4 h-4 border-2 border-black"/>
                  <span>{{ tech }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1 space-y-12">
            <!-- Search Bar -->
            <div>
              <input
                type="text"
                [(ngModel)]="assignmentSearchText"
                (ngModelChange)="onAssignmentSearch()"
                class="w-full border-2 border-black p-3"
                placeholder="Поиск заданий..."/>
            </div>

            <!-- Available Tasks Section -->
            <div>
              <h2 class="text-2xl font-bold mb-6 uppercase text-indigo-600">ДОСТУПНЫЕ ЗАДАНИЯ</h2>
              <div class="space-y-4">
                <div *ngFor="let assignment of filteredAvailableAssignments" [class]="assignment.isGrouped ? 'border-2 border-amber-400 bg-white p-6 hover:shadow-lg transition-all' : 'border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all'">
                  <div (click)="openAssignmentModal(assignment)" class="cursor-pointer">
                    <div class="mb-3">
                      <h3 class="font-bold text-lg mb-1">{{ assignment.name }}</h3>
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
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <app-tech-chip *ngFor="let tech of assignment.technologies" [name]="tech.name"></app-tech-chip>
                    </div>
                  </div>
                </div>
                <div *ngIf="filteredAvailableAssignments.length === 0" class="text-center py-8 text-gray-500">
                  Заданий пока нет
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CandidateDashboardPage implements OnInit {
  AVAILABLE_TECHS = AVAILABLE_TECHS;
  showProfileEdit = false;
  showTechModal = false;
  savingProfile = false;

  candidate: CandidateFullInfo | null = null;
  profileForm: FormGroup;

  // Tech modal
  techSearchQuery = '';
  allTechs: Technology[] = [];
  filteredTechs: Technology[] = [];
  selectedTechs: Technology[] = []; // Храним полные объекты, а не ID
  loadingTechs = false;
  hasSearched = false;
  private searchTimeout: any;

  // Assignments
  availableAssignments: AssignmentFullInfo[] = [];
  assignmentSearchText = '';
  selectedAssignment: AssignmentFullInfo | null = null;
  showAssignmentModal = false;
  teamName = '';
  teamDescription = '';
  takingAssignment = false;

  // Validators for team form
  readonly TEAM_NAME_MIN_LENGTH = 2;
  readonly TEAM_NAME_MAX_LENGTH = 50;
  readonly TEAM_DESC_MIN_LENGTH = 5;
  readonly TEAM_DESC_MAX_LENGTH = 200;

  constructor(
    private authService: AuthService,
    private candidatesService: CandidatesService,
    private technologiesService: TechnologiesService,
    private assignmentsService: AssignmentsService,
    private solutionsService: SolutionsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      surname: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      patronymic: [''],
      city: [''],
      about: ['']
    });
  }

  ngOnInit() {
    this.loadCandidate();
    this.loadAvailableAssignments();
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
    const searchRequest: AssignmentSearchRequest = {
      text: this.assignmentSearchText || undefined,
      take: 100,
      skip: 0
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

  onAssignmentSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadAvailableAssignments();
    }, 300);
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
      // Храним полные объекты технологий, а не только ID
      this.selectedTechs = this.candidate.technologies?.map(t => ({ ...t })) || [];
    }
    this.showProfileEdit = true;
    this.loadTechnologies();
  }

  openAssignmentModal(assignment: AssignmentFullInfo): void {
    this.selectedAssignment = assignment;
    this.showAssignmentModal = true;
    // Сбрасываем форму команды
    this.teamName = '';
    this.teamDescription = '';
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.selectedAssignment = null;
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
      
      alert('Задание успешно взято!');
      this.closeAssignmentModal();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to take assignment:', error);
      alert('Не удалось взять задание. Попробуйте позже.');
      this.cdr.markForCheck();
    } finally {
      this.takingAssignment = false;
      this.cdr.markForCheck();
    }
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid || !this.candidate) return;

    this.savingProfile = true;
    this.cdr.markForCheck();

    try {
      const formValue = this.profileForm.value;

      // Определяем изменения в технологиях
      const currentTechIds = this.candidate.technologies?.map(t => t.id) || [];
      const newTechIds = this.selectedTechs.map(t => t.id);
      const addedTechs = newTechIds.filter(id => !currentTechIds.includes(id));
      const removedTechs = currentTechIds.filter(id => !newTechIds.includes(id));

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

      await this.candidatesService.updateCandidate(this.candidate.id, patchRequest).toPromise();

      // Reload candidate data
      this.loadCandidate();
      this.showProfileEdit = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Не удалось обновить профиль. Попробуйте позже.');
      this.cdr.markForCheck();
    } finally {
      this.savingProfile = false;
      this.cdr.markForCheck();
    }
  }

  // Technology modal methods
  openTechModal(): void {
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
  }

  removeTech(techId: string): void {
    const index = this.selectedTechs.findIndex(t => t.id === techId);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    }
  }

  get filteredAvailableAssignments(): AssignmentFullInfo[] {
    if (this.selectedTechs.length === 0) {
      return this.availableAssignments;
    }
    const selectedTechNames = this.selectedTechs.map(t => t.name);
    return this.availableAssignments.filter(assignment =>
      assignment.technologies?.some(t => selectedTechNames.includes(t.name))
    );
  }
}
