import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AVAILABLE_TECHS } from '../shared/utils/constants';
import { Task } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, TechChipComponent],
  template: `
    <div class="min-h-screen bg-white">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-4xl mx-auto px-8 py-8" *ngIf="task; else notFound">
        <a [routerLink]="'/employer-dashboard'" class="text-sm uppercase tracking-wider text-gray-600 hover:text-emerald-600">← Назад</a>

        <h1 class="text-3xl font-bold mb-8 mt-4 uppercase">РЕДАКТИРОВАНие ЗАДАНиЯ</h1>

        <form (ngSubmit)="submit()" class="border-2 border-black p-8 space-y-8">
          <!-- Title -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЗВАНИЕ ЗАДАНИЯ</label>
            <input 
              type="text" 
              [(ngModel)]="form.title" 
              name="title" 
              class="w-full border-2 border-black p-3" 
              placeholder=""
              required />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОПИСАНИЕ ПРОЕКТА</label>
            <textarea 
              [(ngModel)]="form.description" 
              name="description" 
              class="w-full border-2 border-black p-3 min-h-[120px]" 
              placeholder=""
              required></textarea>
          </div>

          <!-- Deadline -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ДЕДЛАЙН</label>
            <input 
              type="date" 
              [(ngModel)]="form.deadline" 
              name="deadline" 
              class="w-full border-2 border-black p-3" 
              required />
          </div>

          <!-- Task Type -->
          <div>
            <label class="block font-bold mb-3 text-sm uppercase tracking-wider">ТИП ЗАДАНИЯ</label>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  [(ngModel)]="form.taskType" 
                  value="individual" 
                  name="taskType"
                  class="w-4 h-4 border-2 border-black"
                  [disabled]="true" />
                <span class="font-bold uppercase" [ngClass]="{'text-gray-400': form.taskType !== 'individual'}">ИНДИВИДУАЛЬНО</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  [(ngModel)]="form.taskType" 
                  value="team" 
                  name="taskType"
                  class="w-4 h-4 border-2 border-black"
                  [disabled]="true" />
                <span class="font-bold uppercase" [ngClass]="{'text-gray-400': form.taskType !== 'team'}">КОМАНДА</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">Примечание: тип задания нельзя изменять после публикации</p>

            <!-- Team Size (read-only) -->
            <div *ngIf="form.taskType === 'team'" class="mt-4 pl-6 border-l-2 border-purple-600">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-purple-600">КОЛИЧЕСТВО ОЧЛЕНОВ</label>
              <input 
                type="number" 
                [(ngModel)]="form.teamSize" 
                name="teamSize" 
                class="w-full border-2 border-black p-3" 
                [disabled]="true" />
            </div>
          </div>

          <!-- Technologies -->
          <div>
            <label class="block font-bold mb-4 text-sm uppercase tracking-wider">ТЕХНОЛОГИИ</label>
            <div class="border-2 border-black p-6 space-y-4">
              <!-- Selected Techs Display -->
              <div *ngIf="selectedTechs.length > 0" class="flex flex-wrap gap-2 pb-4 border-b-2 border-gray-200">
                <app-tech-chip *ngFor="let tech of selectedTechs" [name]="tech"></app-tech-chip>
              </div>

              <!-- Tech Selection Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label *ngFor="let tech of AVAILABLE_TECHS" class="flex items-center gap-2 cursor-pointer text-xs">
                  <input 
                    type="checkbox" 
                    [checked]="selectedTechs.includes(tech)" 
                    (change)="toggleTech(tech)" 
                    class="w-4 h-4 border-2 border-black" />
                  <span>{{ tech }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Starter Project URL (Optional) -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЧАЛО ПРОЕКТА (опционально)</label>
            <input 
              type="url" 
              [(ngModel)]="form.starterProjectUrl" 
              name="starterProjectUrl" 
              class="w-full border-2 border-black p-3" 
              placeholder="https://github.com/..." />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6 border-t-2 border-black">
            <button 
              type="submit" 
              [disabled]="!isFormValid()"
              class="flex-1 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
              СОХРАНИТЬ ОБНОВЛЕНИЯ
            </button>
            <button 
              type="button" 
              (click)="cancel()"
              class="border-2 border-black px-8 py-4 hover:bg-gray-100 transition-colors font-bold uppercase tracking-wider">
              ОТМЕНА
            </button>
          </div>
        </form>
      </div>

      <ng-template #notFound>
        <div class="max-w-4xl mx-auto px-8 py-8">
          <div class="border-2 border-black p-8 text-center">
            <h2 class="text-xl font-bold uppercase">ЗАДАНИЕ НЕ НАЙДЕНО</h2>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class EditTaskPage implements OnInit {
  AVAILABLE_TECHS = AVAILABLE_TECHS;
  task: Task | null = null;
  selectedTechs: string[] = [];
  private notificationService = inject(NotificationService);

  form = {
    title: '',
    description: '',
    deadline: '',
    taskType: 'individual' as 'individual' | 'team',
    teamSize: 2,
    starterProjectUrl: ''
  };

  constructor(
    private repository: TalentBridgeRepository,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    const allTasks = this.repository.getEmployerTasks();
    this.task = allTasks.find(t => t.id === taskId) || null;
    
    if (this.task) {
      this.form.title = this.task.title;
      this.form.description = this.task.description;
      this.form.deadline = this.task.deadline;
      this.form.taskType = this.task.taskType || 'individual';
      this.form.teamSize = this.task.teamSize || 2;
      this.form.starterProjectUrl = this.task.starterProjectUrl || '';
      this.selectedTechs = [...this.task.technologies];
    }
  }

  toggleTech(tech: string): void {
    const index = this.selectedTechs.indexOf(tech);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    } else {
      this.selectedTechs.push(tech);
    }
  }

  isFormValid(): boolean {
    return this.form.title.trim() !== '' && 
           this.form.description.trim() !== '' && 
           this.form.deadline !== '' && 
           this.selectedTechs.length > 0;
  }

  submit(): void {
    if (!this.isFormValid()) return;
    this.notificationService.success('Задание успешно обновлено!');
    this.router.navigate(['/employer-dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/employer-dashboard']);
  }
}
