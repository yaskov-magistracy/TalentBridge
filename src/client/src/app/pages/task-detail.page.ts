import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { Task, Team } from '../core/models/domain.models';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, TechChipComponent],
  template: `
    <div class="min-h-screen bg-white">
      <app-navbar [role]="'candidate'"></app-navbar>

      <div class="max-w-4xl mx-auto px-8 py-8 relative" *ngIf="task; else notFound">
        <!-- Success Message -->
        <div *ngIf="submitted" class="mb-4 border-2 border-emerald-400 bg-emerald-50 text-emerald-700 p-4 text-center">
          ✓ Решение успешно отправлено на проверку!
        </div>

        <a [routerLink]="'/candidate-dashboard'" class="text-sm uppercase tracking-wider text-gray-600 hover:text-indigo-600">← Назад</a>

        <div class="border-2 border-black p-8 mt-4">
          <!-- Header Section -->
          <div class="mb-6 pb-6 border-b-2 border-black">
            <h1 class="text-3xl font-bold mb-4 uppercase">{{ task.title }}</h1>
            <div class="flex justify-between items-center mb-4">
              <div>
                <p class="text-sm mb-2"><span class="font-bold uppercase">КОМПАНИЯ:</span> {{ task.company }}</p>
                <p class="text-sm mb-4"><span class="font-bold uppercase">ДЕДЛАЙН:</span> {{ task.deadline }}</p>
              </div>
              <span *ngIf="task.taskType === 'team'" class="border-2 border-purple-600 bg-purple-50 text-purple-700 text-sm px-4 py-2 font-semibold uppercase">
                КОМАНДА
              </span>
              <span *ngIf="task.taskType === 'individual'" class="border-2 border-indigo-600 bg-indigo-50 text-indigo-700 text-sm px-4 py-2 font-semibold uppercase">
                ИНДИВИДУАЛЬНО
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
            </div>
          </div>

          <!-- Description Section -->
          <div class="mb-6 border-2 border-black p-6">
            <h2 class="font-bold text-xl mb-4 uppercase">ОПИСАНИЕ ПРОЕКТА</h2>
            <p class="text-sm leading-relaxed">{{ task.description }}</p>
          </div>

          <!-- Requirements Section -->
          <div class="mb-6 border-2 border-black p-6">
            <h2 class="font-bold text-xl mb-4 uppercase">ТРЕБОВАНИЯ</h2>
            <ul class="space-y-3">
              <li *ngFor="let req of task.requirements" class="text-sm">• {{ req }}</li>
            </ul>
          </div>

          <!-- Starter Project URL -->
          <div *ngIf="task.starterProjectUrl" class="mb-6 border-2 border-black p-6">
            <h2 class="font-bold text-xl mb-4 uppercase">НАЧАЛО ПРОЕКТА</h2>
            <a [href]="task.starterProjectUrl" target="_blank" class="text-sm text-indigo-600 hover:underline break-all">
              {{ task.starterProjectUrl }}
            </a>
          </div>

          <!-- Action Section -->
          <div *ngIf="mode === 'available'; else submitBlock" class="space-y-4">
            <!-- For team tasks, show team info -->
            <div *ngIf="task.taskType === 'team'" class="border-2 border-purple-400 bg-purple-50 p-6 mb-4">
              <h3 class="font-bold mb-3 uppercase text-purple-700">Объединитесь в команду или работайте индивидуально</h3>
              <p class="text-sm text-gray-600 mb-4">Индивидуально: 1 человек</p>
              <button 
                (click)="selectTaskType('individual')"
                class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider mb-3">
                РАБОТАТЬ ОдНОМУ
              </button>
              <button 
                (click)="showTeamModal = true"
                class="w-full border-2 border-purple-600 px-8 py-3 hover:bg-purple-600 hover:text-white transition-colors font-bold uppercase tracking-wider">
                НАЙТИ КОМАНДУ
              </button>
            </div>

            <!-- For individual tasks or when type is selected -->
            <button 
              *ngIf="task.taskType === 'individual' || selectedTaskType === 'individual'"
              (click)="takeTask()"
              class="w-full border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider">
              ВЗЯТЬ ЗАДАНИЕ
            </button>
          </div>

          <!-- Submit Block -->
          <ng-template #submitBlock>
            <form (ngSubmit)="submit()" class="space-y-4">
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Ссылка на GitHub репозиторий</label>
                <input 
                  type="url" 
                  [(ngModel)]="githubUrl" 
                  name="githubUrl" 
                  class="w-full border-2 border-black p-3" 
                  placeholder="https://github.com/..."
                  required />
              </div>
              <button 
                type="submit" 
                [disabled]="!githubUrl.trim()"
                class="w-full border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                ОТПРАВИТЬ НА ПРОВЕРКУ
              </button>
            </form>
          </ng-template>
        </div>
      </div>

      <!-- Team Modal -->
      <div *ngIf="showTeamModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-8 z-[9999]">
        <div class="bg-white border-2 border-purple-600 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="border-b-2 border-purple-600 p-6 flex justify-between items-center bg-purple-50">
            <h2 class="font-bold text-xl uppercase text-purple-600">КОМАНды</h2>
            <button (click)="showTeamModal = false" class="text-4xl hover:opacity-70">×</button>
          </div>
          
          <!-- Content -->
          <div class="flex-1 p-6 overflow-y-auto">
            <div *ngIf="!teamModalView || teamModalView === 'list'" class="space-y-4">
              <p class="text-sm text-gray-600 mb-4">Доступные команды для тіж задания</p>
              <a *ngFor="let team of availableTeams" class="block border-2 border-purple-400 bg-white p-6 hover:shadow-lg transition-all cursor-pointer">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-bold text-lg">{{ team.creatorName }}</h3>
                    <p class="text-xs text-gray-500 uppercase">{{ team.currentMembers }} / {{ team.maxMembers }} членов</p>
                  </div>
                  <button 
                    *ngIf="this.joinedTeamId !== team.id"
                    (click)="joinTeam(team.id)"
                    class="border-2 border-purple-600 bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors text-sm uppercase font-semibold">
                    ПОДОБРИТЬ
                  </button>
                  <div *ngIf="this.joinedTeamId === team.id" class="border-2 border-emerald-400 bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold">
                    ✓ ВЫ В КОМАНДЕ
                  </div>
                </div>
                <p class="text-sm text-gray-700 mb-3">{{ team.description }}</p>
                <div *ngIf="joinedTeamId === team.id && team.contactInfo" class="text-xs text-gray-500">
                  Контакт: {{ team.contactInfo }}
                </div>
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="border-t-2 border-purple-600 p-6 bg-gray-50 flex gap-2">
            <button 
              (click)="showTeamModal = false"
              class="flex-1 border-2 border-purple-600 px-6 py-3 hover:bg-purple-600 hover:text-white transition-colors font-bold uppercase tracking-wider">
              Отмена
            </button>
            <button 
              (click)="submitWithTeam()"
              [disabled]="!joinedTeamId"
              class="flex-1 border-2 border-purple-600 bg-purple-600 text-white px-6 py-3 hover:bg-purple-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50">
              ПОдтвердить
            </button>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="max-w-4xl mx-auto px-8 py-8">
          <div class="border-2 border-black p-8 text-center">
            <h2 class="text-xl font-bold uppercase">ЗАДАНИЕ НЕ НАйДЕНО</h2>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class TaskDetailPage implements OnInit {
  task: Task | undefined;
  mode: string | null = null;
  githubUrl = '';
  submitted = false;
  showTeamModal = false;
  teamModalView: 'list' | 'create' = 'list';
  selectedTaskType: 'individual' | 'team' | null = null;
  joinedTeamId: string | null = null;
  availableTeams: Team[] = [];

  constructor(
    private repository: TalentBridgeRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    this.task = this.repository.getTaskById(taskId);
    this.mode = this.route.snapshot.queryParamMap.get('mode');
    
    if (this.task?.id) {
      this.availableTeams = this.repository.getTeamsByTaskId(this.task.id);
    }
  }

  selectTaskType(type: 'individual' | 'team') {
    this.selectedTaskType = type;
  }

  takeTask(): void {
    this.router.navigate(['/candidate-dashboard']);
  }

  joinTeam(teamId: string): void {
    this.joinedTeamId = teamId;
  }

  submitWithTeam(): void {
    if (this.joinedTeamId) {
      this.showTeamModal = false;
      this.selectedTaskType = 'team';
      // Now show submission form
    }
  }

  submit(): void {
    if (!this.githubUrl.trim()) {
      return;
    }
    this.submitted = true;
    setTimeout(() => {
      this.router.navigate(['/candidate-dashboard']);
    }, 2000);
  }
}
