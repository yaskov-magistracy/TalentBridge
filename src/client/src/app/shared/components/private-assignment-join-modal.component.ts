import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignmentsService, AuthService, SolutionsService } from '../../core';
import {
  AssignmentDifficulty,
  AssignmentFullInfo,
  SolutionFullInfo,
  SolutionSearchRequest,
} from '../../core/models/api.models';
import { NotificationService } from '../../core/services/notification.service';
import { TechChipComponent } from './tech-chip.component';

type AssignmentTeam = {
  solutionId: string;
  name: string;
  membersCount: number;
  joinRequestedByCurrentUser: boolean;
  solution: SolutionFullInfo;
};

@Component({
  selector: 'app-private-assignment-join-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TechChipComponent],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      (click)="close()"
    >
      <div
        class="bg-white border-2 border-indigo-600 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-start gap-4 mb-6">
          <div>
            <h2 class="text-2xl font-bold text-indigo-600 uppercase">Присоединиться по ID</h2>
            <p class="text-sm text-gray-600 mt-2">
              Введите ID задания для присоединения. Его можно получить от работодателя.
            </p>
          </div>
          <button type="button" (click)="close()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
        </div>

        <div class="mb-6">
          <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ID задания</label>
          <input
            type="text"
            [(ngModel)]="assignmentId"
            (ngModelChange)="onAssignmentIdChange($event)"
            class="w-full border-2 border-black p-3"
            placeholder="Например: 00000000-0000-0000-0000-000000000000"
            autofocus
          />
          <p *ngIf="loadingAssignment" class="text-sm text-gray-500 mt-2">Загрузка задания...</p>
          <p *ngIf="assignmentError" class="text-sm text-red-600 mt-2">{{ assignmentError }}</p>
        </div>

        <div
          *ngIf="assignment"
          (click)="openAssignmentDetails()"
          [class]="
            assignment.isGrouped
              ? 'border-2 border-amber-400 bg-white p-5 cursor-pointer hover:shadow-lg transition-all'
              : 'border-2 border-indigo-400 bg-white p-5 cursor-pointer hover:shadow-lg transition-all'
          "
        >
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
          </div>
        </div>
      </div>
    </div>

    <div
      *ngIf="showAssignmentDetails && assignment"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
      (click)="closeAssignmentDetails()"
    >
      <div
        class="bg-white border-2 border-indigo-600 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-indigo-600 uppercase">{{ assignment.name }}</h2>
          <button type="button" (click)="closeAssignmentDetails()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
        </div>

        <div *ngIf="assignment.technologies.length" class="flex flex-wrap gap-2 mb-4">
          <app-tech-chip *ngFor="let tech of assignment.technologies" [name]="tech.name"></app-tech-chip>
        </div>

        <div class="flex flex-wrap gap-4 mb-4 text-sm">
          <div>
            <span class="font-bold">КОМПАНИЯ:</span> {{ assignment.employer.name }}
          </div>
          <div>
            <span class="font-bold">ДЕДЛАЙН:</span> {{ assignment.deadLine | date:'dd.MM.yyyy' }}
          </div>
        </div>

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

        <div class="border-2 border-indigo-300 bg-indigo-50 p-4 mb-6 text-center">
          <span class="font-bold text-lg" [class]="getDaysRemaining(assignment.deadLine) < 0 ? 'text-red-600' : 'text-indigo-600'">
            ОСТАЛОСЬ ДНЕЙ: {{ getDaysRemaining(assignment.deadLine) }}
          </span>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-lg mb-3 uppercase">ОПИСАНИЕ ПРОЕКТА</h3>
          <div class="border-2 border-gray-300 p-4 bg-gray-50">
            <p class="text-gray-700 whitespace-pre-line">{{ assignment.description }}</p>
          </div>
        </div>

        <div *ngIf="assignment.isGrouped" class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
          <h3 class="font-bold text-lg mb-3 uppercase text-amber-800">
            ГРУППОВОЙ ПРОЕКТ (до {{ assignment.candidatesCapacity }} чел.)
          </h3>

          <div class="mb-4">
            <p class="text-sm font-bold uppercase text-amber-700 mb-2">
              Команды, выполняющие это задание:
            </p>
            <div *ngIf="loadingAssignmentTeams" class="text-sm text-gray-500">
              Загрузка команд...
            </div>
            <div *ngIf="!loadingAssignmentTeams && assignmentTeams.length > 0" class="space-y-2 max-h-48 overflow-y-auto">
              <div
                *ngFor="let team of assignmentTeams"
                (click)="openAssignmentTeamModal(team.solution)"
                class="flex flex-wrap justify-between items-center gap-2 bg-white border border-amber-300 p-2 cursor-pointer hover:bg-amber-50 transition-colors"
              >
                <div>
                  <p class="text-sm font-semibold">{{ team.name }}</p>
                  <p class="text-xs text-gray-600">Участников: {{ team.membersCount }} / {{ assignment.candidatesCapacity }}</p>
                </div>
                <span
                  *ngIf="team.joinRequestedByCurrentUser"
                  class="border border-orange-500 bg-orange-500 text-white px-3 py-1 text-xs font-bold uppercase whitespace-nowrap"
                >
                  на подтверждении
                </span>
              </div>
            </div>
            <div *ngIf="!loadingAssignmentTeams && assignmentTeams.length === 0" class="text-sm text-gray-500">
              Пока нет команд, выполняющих это задание.
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-sm font-bold uppercase text-amber-700">Создайте свою команду:</p>
            <div>
              <label class="block font-bold mb-2 text-sm uppercase">НАЗВАНИЕ КОМАНДЫ</label>
              <input
                type="text"
                [(ngModel)]="teamName"
                class="w-full border-2 border-black p-3 text-sm"
                [class.border-red-500]="teamNameError"
                [placeholder]="'От ' + TEAM_NAME_MIN_LENGTH + ' до ' + TEAM_NAME_MAX_LENGTH + ' символов'"
              />
              <p *ngIf="teamNameError" class="text-red-600 text-xs mt-1">{{ teamNameError }}</p>
            </div>
            <div>
              <label class="block font-bold mb-2 text-sm uppercase">ОПИСАНИЕ КОМАНДЫ (НЕ ОБЯЗАТЕЛЬНО)</label>
              <textarea
                [(ngModel)]="teamDescription"
                class="w-full border-2 border-black p-3 text-sm min-h-[100px]"
                [class.border-red-500]="teamDescriptionError"
                [placeholder]="'От ' + TEAM_DESC_MIN_LENGTH + ' до ' + TEAM_DESC_MAX_LENGTH + ' символов'"
              ></textarea>
              <p *ngIf="teamDescriptionError" class="text-red-600 text-xs mt-1">{{ teamDescriptionError }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-4 mt-auto pt-6 border-t-2">
          <button
            type="button"
            (click)="takeAssignment()"
            [disabled]="!canTakeAssignment"
            class="flex-1 border-2 border-indigo-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            [class]="canTakeAssignment ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500'"
          >
            {{ takingAssignment ? 'ОФОРМЛЕНИЕ...' : 'ВЗЯТЬ ЗАДАНИЕ' }}
          </button>
        </div>
      </div>
    </div>

    <div
      *ngIf="showAssignmentTeamModal && selectedAssignmentTeamSolution"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4"
      (click)="closeAssignmentTeamModal()"
    >
      <div
        class="bg-white border-2 border-indigo-600 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-indigo-600 uppercase">
            {{ selectedAssignmentTeamSolution.assignment.name }}
          </h2>
          <button type="button" (click)="closeAssignmentTeamModal()" class="text-3xl hover:text-red-600 cursor-pointer">×</button>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <app-tech-chip *ngFor="let tech of selectedAssignmentTeamSolution.assignment.technologies" [name]="tech.name"></app-tech-chip>
        </div>

        <div class="flex flex-wrap gap-4 mb-4 text-sm">
          <div>
            <span class="font-bold">КОМПАНИЯ:</span> {{ selectedAssignmentTeamSolution.assignment.employer.name }}
          </div>
          <div>
            <span class="font-bold">ДЕДЛАЙН:</span> {{ selectedAssignmentTeamSolution.assignment.deadLine | date:'dd.MM.yyyy' }}
          </div>
        </div>

        <div class="border-2 border-indigo-300 bg-indigo-50 p-4 mb-6 text-center">
          <span class="font-bold text-lg" [class]="getDaysRemaining(selectedAssignmentTeamSolution.assignment.deadLine) < 0 ? 'text-red-600' : 'text-indigo-600'">
            ОСТАЛОСЬ ДНЕЙ: {{ getDaysRemaining(selectedAssignmentTeamSolution.assignment.deadLine) }}
          </span>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-lg mb-2 uppercase">ОПИСАНИЕ ПРОЕКТА</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ selectedAssignmentTeamSolution.assignment.description }}</p>
        </div>

        <div class="mb-6 border-2 border-amber-300 bg-amber-50 p-4">
          <h3 class="font-bold text-lg mb-3 uppercase text-amber-800">
            КОМАНДА ({{ selectedAssignmentTeamSolution.candidates.length || 0 }} / {{ selectedAssignmentTeamSolution.assignment.candidatesCapacity }} чел.)
          </h3>

          <div *ngIf="selectedAssignmentTeamSolution.team" class="mb-4">
            <p class="text-sm font-bold uppercase">НАЗВАНИЕ КОМАНДЫ:</p>
            <p class="text-lg">{{ selectedAssignmentTeamSolution.team.name }}</p>
            <p *ngIf="selectedAssignmentTeamSolution.team.description" class="text-sm text-gray-600 mt-1">
              {{ selectedAssignmentTeamSolution.team.description }}
            </p>
          </div>

          <div class="mb-4">
            <p class="text-sm font-bold uppercase mb-3">УЧАСТНИКИ КОМАНДЫ:</p>
            <div class="space-y-3">
              <div *ngFor="let member of selectedAssignmentTeamSolution.candidates" class="flex items-center gap-3">
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

        <div class="flex gap-4 mt-auto pt-6 border-t-2">
          <button
            *ngIf="!isTeamJoinRequested(selectedAssignmentTeamSolution.id)"
            type="button"
            (click)="joinTeamSolution(selectedAssignmentTeamSolution.id)"
            [disabled]="joiningTeamSolutionId === selectedAssignmentTeamSolution.id"
            class="flex-1 border-2 border-emerald-600 px-8 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            [class]="joiningTeamSolutionId === selectedAssignmentTeamSolution.id ? 'bg-gray-300 text-gray-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'"
          >
            {{ joiningTeamSolutionId === selectedAssignmentTeamSolution.id ? 'ПРИСОЕДИНЕНИЕ...' : 'ПРИСОЕДИНИТЬСЯ' }}
          </button>
          <div
            *ngIf="isTeamJoinRequested(selectedAssignmentTeamSolution.id)"
            class="flex-1 border-2 border-orange-500 bg-orange-500 text-white px-8 py-3 font-bold uppercase tracking-wider text-center"
          >
            заявка на рассмотрении
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PrivateAssignmentJoinModalComponent implements OnChanges {
  private readonly authService = inject(AuthService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly solutionsService = inject(SolutionsService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() joined = new EventEmitter<void>();

  assignmentId = '';
  assignment: AssignmentFullInfo | null = null;
  loadingAssignment = false;
  assignmentError = '';
  takingAssignment = false;
  showAssignmentDetails = false;
  assignmentTeams: AssignmentTeam[] = [];
  loadingAssignmentTeams = false;
  selectedAssignmentTeamSolution: SolutionFullInfo | null = null;
  showAssignmentTeamModal = false;
  joiningTeamSolutionId: string | null = null;
  teamName = '';
  teamDescription = '';

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  readonly TEAM_NAME_MIN_LENGTH = 2;
  readonly TEAM_NAME_MAX_LENGTH = 50;
  readonly TEAM_DESC_MIN_LENGTH = 5;
  readonly TEAM_DESC_MAX_LENGTH = 200;

  ngOnChanges(): void {
    if (this.open) {
      this.reset();
    }
  }

  close(): void {
    this.reset();
    this.closed.emit();
  }

  onAssignmentIdChange(value: string): void {
    this.assignmentId = value;
    this.assignment = null;
    this.assignmentError = '';

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const id = value.trim();
    if (!id) {
      this.loadingAssignment = false;
      return;
    }

    this.loadingAssignment = true;
    this.searchTimeout = setTimeout(() => this.loadAssignmentById(id), 400);
  }

  openAssignmentDetails(): void {
    if (!this.assignment) return;
    this.showAssignmentDetails = true;
    this.assignmentTeams = [];
    if (this.assignment.isGrouped) {
      this.loadAssignmentTeams(this.assignment.id);
    }
  }

  closeAssignmentDetails(): void {
    this.showAssignmentDetails = false;
    this.assignmentTeams = [];
    this.loadingAssignmentTeams = false;
    this.closeAssignmentTeamModal();
  }

  openAssignmentTeamModal(solution: SolutionFullInfo): void {
    this.selectedAssignmentTeamSolution = solution;
    this.showAssignmentTeamModal = true;
  }

  closeAssignmentTeamModal(): void {
    this.showAssignmentTeamModal = false;
    this.selectedAssignmentTeamSolution = null;
    this.joiningTeamSolutionId = null;
  }

  async takeAssignment(): Promise<void> {
    if (!this.assignment || !this.canTakeAssignment) return;

    this.takingAssignment = true;
    this.cdr.markForCheck();

    const request = {
      assignmentId: this.assignment.id,
      team: this.assignment.isGrouped
        ? {
            name: this.teamName.trim(),
            description: this.teamDescription.trim(),
          }
        : undefined,
    };

    try {
      await this.solutionsService.createSolution(request).toPromise();
      this.notificationService.success('Задание успешно взято!');
      this.joined.emit();
      this.close();
    } catch (error) {
      console.error('Failed to take private assignment:', error);
      this.notificationService.error('Не удалось взять задание. Попробуйте позже.');
    } finally {
      this.takingAssignment = false;
      this.cdr.markForCheck();
    }
  }

  get canTakeAssignment(): boolean {
    if (this.takingAssignment || !this.assignment) return false;
    if (!this.assignment.isGrouped) return true;
    return !this.teamNameError && !this.teamDescriptionError;
  }

  get teamNameError(): string | null {
    if (!this.assignment?.isGrouped) return null;
    const length = this.teamName.trim().length;
    if (length === 0) return 'Введите название команды';
    if (length < this.TEAM_NAME_MIN_LENGTH) return `Минимум ${this.TEAM_NAME_MIN_LENGTH} символа`;
    if (length > this.TEAM_NAME_MAX_LENGTH) return `Максимум ${this.TEAM_NAME_MAX_LENGTH} символов`;
    return null;
  }

  get teamDescriptionError(): string | null {
    if (!this.assignment?.isGrouped) return null;
    const length = this.teamDescription.trim().length;
    if (length === 0) return null;
    if (length < this.TEAM_DESC_MIN_LENGTH) return `Минимум ${this.TEAM_DESC_MIN_LENGTH} символов`;
    if (length > this.TEAM_DESC_MAX_LENGTH) return `Максимум ${this.TEAM_DESC_MAX_LENGTH} символов`;
    return null;
  }

  getAssignmentMaxAttempts(assignment: AssignmentFullInfo): number {
    return assignment.attemptsCoefficients?.length || 0;
  }

  getDifficultyLabel(difficulty: AssignmentDifficulty): string {
    const labels: Record<AssignmentDifficulty, string> = {
      Normal: 'Обычная',
      Advanced: 'Продвинутая',
      Hard: 'Сложная',
    };
    return labels[difficulty] || difficulty;
  }

  formatAttemptCoefficients(assignment: AssignmentFullInfo): string {
    const coefficients = assignment.attemptsCoefficients ?? [];
    if (!coefficients.length) return 'Не заданы';
    return coefficients.map((coefficient) => `${coefficient}`).join(', ');
  }

  getDaysRemaining(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  hasCurrentUserJoinRequest(solution: SolutionFullInfo): boolean {
    const currentUserId = this.authService.currentUser()?.userId;
    if (!currentUserId) return false;
    return (solution.candidatesJoinRequested || []).some((candidate) => candidate.id === currentUserId);
  }

  isTeamJoinRequested(solutionId: string): boolean {
    const team = this.assignmentTeams.find((item) => item.solutionId === solutionId);
    return Boolean(team?.joinRequestedByCurrentUser);
  }

  joinTeamSolution(solutionId: string): void {
    this.joiningTeamSolutionId = solutionId;
    this.cdr.markForCheck();

    this.solutionsService.requestJoinSolution(solutionId).subscribe({
      next: () => {
        this.notificationService.success('Запрос на присоединение к команде отправлен');
        this.assignmentTeams = this.assignmentTeams.map((team) =>
          team.solutionId === solutionId ? { ...team, joinRequestedByCurrentUser: true } : team,
        );
        if (this.assignment?.id) {
          this.loadAssignmentTeams(this.assignment.id);
        }
        this.closeAssignmentTeamModal();
        this.joiningTeamSolutionId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to join private assignment team solution:', error);
        const errorMessage = error?.error?.message || error?.message || 'Не удалось отправить запрос. Попробуйте позже.';
        this.notificationService.error(`Ошибка: ${errorMessage}`);
        this.joiningTeamSolutionId = null;
        this.cdr.markForCheck();
      },
    });
  }

  private loadAssignmentById(id: string): void {
    this.assignmentsService.getAssignment(id).subscribe({
      next: (assignment) => {
        this.assignment = assignment;
        this.loadingAssignment = false;
        this.assignmentError = '';
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load private assignment:', error);
        this.assignment = null;
        this.loadingAssignment = false;
        this.assignmentError = 'Задание не найдено. Проверьте ID и попробуйте снова.';
        this.cdr.markForCheck();
      },
    });
  }

  private loadAssignmentTeams(assignmentId: string): void {
    this.loadingAssignmentTeams = true;
    this.assignmentTeams = [];

    const searchRequest: SolutionSearchRequest = {
      assignmentId,
      take: 100,
      skip: 0,
      isAvailableToJoin: true,
      excludeCandidateOwnerId: this.authService.currentUser()?.userId,
    };

    this.solutionsService.searchSolutions(searchRequest).subscribe({
      next: (response) => {
        this.assignmentTeams = (response.items || [])
          .filter((solution) => solution.assignment.isGrouped && solution.team)
          .map((solution) => ({
            solutionId: solution.id,
            name: solution.team!.name,
            membersCount: solution.candidates.length,
            joinRequestedByCurrentUser: this.hasCurrentUserJoinRequest(solution),
            solution,
          }));
        this.loadingAssignmentTeams = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load private assignment teams:', error);
        this.loadingAssignmentTeams = false;
        this.cdr.markForCheck();
      },
    });
  }

  private reset(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
    this.assignmentId = '';
    this.assignment = null;
    this.loadingAssignment = false;
    this.assignmentError = '';
    this.takingAssignment = false;
    this.showAssignmentDetails = false;
    this.assignmentTeams = [];
    this.loadingAssignmentTeams = false;
    this.selectedAssignmentTeamSolution = null;
    this.showAssignmentTeamModal = false;
    this.joiningTeamSolutionId = null;
    this.teamName = '';
    this.teamDescription = '';
  }
}
