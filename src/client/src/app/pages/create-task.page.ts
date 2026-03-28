import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { AVAILABLE_TECHS } from '../shared/utils/constants';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, TechChipComponent],
  template: `
    <div class="min-h-screen bg-white">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-4xl mx-auto px-8 py-8">
        <a [routerLink]="'/employer-dashboard'" class="text-sm uppercase tracking-wider text-gray-600 hover:text-emerald-600">← Назад</a>

        <h1 class="text-3xl font-bold mb-8 mt-4 uppercase">СОЗДАНИЕ НОВОГО ЗАДАНИЯ</h1>

        <form (ngSubmit)="submit()" class="border-2 border-black p-8 space-y-8">
          <!-- Title -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЗВАНИЕ ЗАДАНИЯ</label>
            <input 
              type="text" 
              [(ngModel)]="form.title" 
              name="title" 
              class="w-full border-2 border-black p-3" 
              placeholder="Например: REST API для системы управления задачами"
              required />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОПИСАНИЕ ПОРОЕКТА</label>
            <textarea 
              [(ngModel)]="form.description" 
              name="description" 
              class="w-full border-2 border-black p-3 min-h-[120px]" 
              placeholder="Опишите цели, требования и особенности проекта"
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
            <div class="border-2 border-black p-6 space-y-4">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  [(ngModel)]="form.taskType" 
                  value="individual" 
                  name="taskType"
                  class="w-5 h-5 mt-0.5 border-2 border-black" />
                <div>
                  <span class="font-bold uppercase">Индивидуальное</span>
                  <p class="text-sm text-gray-600 mt-1">Задание выполняется одним кандидатом</p>
                </div>
              </label>
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  [(ngModel)]="form.taskType" 
                  value="team" 
                  name="taskType"
                  class="w-5 h-5 mt-0.5 border-2 border-black" />
                <div class="flex-1">
                  <span class="font-bold uppercase">Командное</span>
                  <p class="text-sm text-gray-600 mt-1">Задание выполняется командой кандидатов</p>

                  <!-- Team Size -->
                  <div *ngIf="form.taskType === 'team'" class="mt-4 border-t-2 border-gray-300 pt-4">
                    <label class="block font-bold mb-2 text-xs uppercase tracking-wider">Максимальный размер команды</label>
                    <div class="flex items-center gap-3">
                      <input 
                        type="number" 
                        [(ngModel)]="form.teamSize" 
                        name="teamSize" 
                        class="w-24 border-2 border-black p-2 text-center" 
                        min="2"
                        max="10" />
                      <span class="text-sm text-gray-600">человек (от 2 до 10)</span>
                    </div>
                  </div>
                </div>
              </label>
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
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАЧАЛО ПРОЕКТА (ссылка, опционально)</label>
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
              ОПУБЛИКОВАТЬ ЗАДАНИЕ
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
    </div>
  `
})
export class CreateTaskPage {
  AVAILABLE_TECHS = AVAILABLE_TECHS;
  selectedTechs: string[] = [];
  
  form = {
    title: '',
    description: '',
    deadline: '',
    taskType: 'individual' as 'individual' | 'team',
    teamSize: 2,
    starterProjectUrl: ''
  };

  constructor(public router: Router) {}

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
           this.selectedTechs.length > 0 &&
           (this.form.taskType === 'individual' || (this.form.taskType === 'team' && this.form.teamSize >= 2 && this.form.teamSize <= 10));
  }

  submit(): void {
    if (!this.isFormValid()) return;
    alert('Задание создано и опубликовано!');
    this.router.navigate(['/employer-dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/employer-dashboard']);
  }
}
