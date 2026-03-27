import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';
import { ReviewProgressComponent } from '../shared/components/review-progress.component';
import { TechChipComponent } from '../shared/components/tech-chip.component';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { Task, Submission } from '../core/models/domain.models';
import { AVAILABLE_TECHS } from '../shared/utils/constants';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    ReviewProgressComponent,
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
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white text-2xl">
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
              ✎ РЕДАКТИРОВАТЬ
            </button>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ФИО</p>
              <p class="font-semibold text-lg">{{ profile.fullName }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Город</p>
              <p class="font-semibold text-lg">{{ profile.city }}</p>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">О себе</p>
            <p class="text-gray-700 leading-relaxed">{{ profile.about }}</p>
          </div>

          <div class="mt-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Навыки</p>
            <div class="flex flex-wrap gap-2">
              <div *ngFor="let skill of profile.skills" class="px-3 py-1.5 border-2 font-semibold text-sm" [ngClass]="getLevelColor(skill.level)">
                {{ skill.name }} • {{ skill.level }}
              </div>
            </div>
          </div>
          
          <!-- Profile Edit Form -->
          <div *ngIf="showProfileEdit" class="mt-6 border-t-2 border-indigo-200 pt-6">
            <div class="mb-4">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ИМЯ</label>
              <input 
                type="text" 
                [(ngModel)]="editProfile.fullName"
                class="w-full border-2 border-black p-3"
                placeholder="Ваше имя"/>
            </div>
            
            <div class="mb-4">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ГОРОД</label>
              <input 
                type="text" 
                [(ngModel)]="editProfile.city"
                class="w-full border-2 border-black p-3"
                placeholder="Ваш город"/>
            </div>
            
            <div class="mb-4">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ОБО МНЕ</label>
              <textarea 
                [(ngModel)]="editProfile.about"
                class="w-full border-2 border-black p-3 min-h-[120px]"
                placeholder="Расскажите о себе"></textarea>
            </div>

            <!-- Skills Management -->
            <div class="mb-6">
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider">НАВЫКИ</h3>
              <div class="mb-4">
                <div class="flex flex-wrap gap-2 mb-4">
                  <span *ngFor="let skill of editProfile.skills" 
                    class="inline-flex items-center gap-2 border-2 px-3 py-1 text-xs uppercase"
                    [ngClass]="getLevelColor(skill.level)">
                    {{ skill.name }}
                    <button 
                      (click)="removeSkill(skill.name)"
                      class="hover:opacity-70">×</button>
                  </span>
                </div>
              </div>

              <!-- Add Skill Form -->
              <div *ngIf="showSkillEdit" class="border-2 border-indigo-400 bg-indigo-50 p-4">
                <div class="mb-3">
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">НАВЫК</label>
                  <input 
                    type="text" 
                    [(ngModel)]="newSkill.name"
                    class="w-full border-2 border-black p-3"
                    placeholder="Название навыка"/>
                </div>
                <div class="mb-4">
                  <label class="block font-bold mb-2 text-sm uppercase tracking-wider">УРОВЕНЬ</label>
                  <select 
                    [(ngModel)]="newSkill.level"
                    class="w-full border-2 border-black p-3">
                    <option value="начинающий">начинающий</option>
                    <option value="базовый">базовый</option>
                    <option value="опытный">опытный</option>
                  </select>
                </div>
                <div class="flex gap-2">
                  <button 
                    (click)="addSkill()"
                    class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold">
                    ДОБАВИТЬ
                  </button>
                  <button 
                    (click)="showSkillEdit = false"
                    class="flex-1 border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors uppercase font-semibold">
                    ОТМЕНА
                  </button>
                </div>
              </div>

              <button 
                *ngIf="!showSkillEdit"
                (click)="showSkillEdit = true"
                class="mt-3 border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase font-semibold">
                + ДОБАВИТЬ НАВЫК
              </button>
            </div>

            <div class="flex gap-2">
              <button 
                (click)="saveProfile()"
                class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider">
                СОХРАНИТЬ
              </button>
              <button 
                (click)="showProfileEdit = false"
                class="flex-1 border-2 border-indigo-600 px-8 py-3 hover:bg-indigo-600 hover:text-white transition-colors font-bold uppercase tracking-wider">
                ОТМЕНА
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
                    [checked]="selectedTechs.includes(tech)"
                    (change)="toggleTech(tech)"
                    class="w-4 h-4 border-2 border-black"/>
                  <span>{{ tech }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1 space-y-12">
            <!-- Available Tasks Section -->
            <div>
              <h2 class="text-2xl font-bold mb-6 uppercase text-indigo-600">ДОСТУПНЫЕ ЗАДАНИЯ</h2>
              <div class="space-y-4">
                <div *ngFor="let task of filteredAvailableTasks" class="border-2 border-indigo-400 bg-white p-6 hover:shadow-lg transition-all">
                  <a
                    [routerLink]="['/task', task.id]"
                    [queryParams]="{ mode: 'available' }"
                    class="block hover:bg-gray-50 transition-colors -m-6 p-6 mb-0 cursor-pointer">
                    <div class="mb-3">
                      <h3 class="font-bold text-lg mb-1">{{ task.title }}</h3>
                      <p class="text-sm mb-2"><span class="font-bold">КОМПАНИЯ:</span> {{ task.company }}</p>
                      <p class="text-sm mb-3"><span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}</p>
                    </div>
                    <div class="flex items-center justify-between mb-3" *ngIf="task.taskType">
                      <span *ngIf="task.taskType === 'team'" class="border-2 border-purple-600 bg-purple-50 text-purple-700 text-xs px-3 py-1 font-semibold uppercase">
                        КОМАНДНОЕ (до {{ task.teamSize }} чел.)
                      </span>
                      <span *ngIf="task.taskType === 'individual'" class="border-2 border-indigo-600 bg-indigo-50 text-indigo-700 text-xs px-3 py-1 font-semibold uppercase">
                        ИНДИВИДУАЛЬНОЕ
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- In Progress Section -->
            <div *ngIf="tasksInProgressList.length > 0">
              <h2 class="text-2xl font-bold mb-6 uppercase text-amber-600">В ПРОЦЕССЕ</h2>
              <div class="space-y-4">
                <div *ngFor="let task of tasksInProgressList" class="border-2 border-amber-400 bg-white p-6 shadow-md">
                  <a
                    [routerLink]="['/task', task.id]"
                    [queryParams]="{ mode: 'inprogress' }"
                    class="block hover:bg-gray-50 transition-colors -m-6 p-6 mb-0 cursor-pointer">
                    <div class="mb-3">
                      <h3 class="font-bold text-lg mb-1">{{ task.title }}</h3>
                      <p class="text-sm mb-2"><span class="font-bold">КОМПАНИЯ:</span> {{ task.company }}</p>
                      <p class="text-sm mb-3"><span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Completed Tasks Section -->
            <div *ngIf="completedSubmissions.length > 0">
              <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">ЗАВЕРШЁННЫЕ</h2>
              <div class="space-y-4">
                <div *ngFor="let submission of completedSubmissions" class="border-2 border-emerald-400 bg-white p-6 shadow-md">
                  <a
                    [routerLink]="['/submission', submission.id]"
                    class="block hover:bg-gray-50 transition-colors -m-6 p-6 mb-0 cursor-pointer">
                    <div class="mb-3">
                      <h3 class="font-bold text-lg mb-1">{{ submission.taskTitle }}</h3>
                      <p class="text-sm"><span class="font-bold">ОТПРАВЛЕНО:</span> {{ submission.submittedDate }}</p>
                    </div>
                    <app-review-progress
                      [autoTests]="submission.status.autoTests"
                      [aiAnalysis]="submission.status.aiAnalysis"
                      [expertReview]="submission.status.expertReview"
                    ></app-review-progress>
                    <div *ngIf="submission.expertReviewResults" class="mt-4 border-l-4 border-emerald-600 pl-4 bg-emerald-50 p-3">
                      <p class="text-xs font-bold text-emerald-700 uppercase mb-1">Комментарий эксперта:</p>
                      <p class="text-sm text-gray-700">{{ submission.expertReviewResults.comment }}</p>
                    </div>
                    <div *ngIf="submission.status.expertReview === 'pending'" class="mt-4 border-l-4 border-amber-500 pl-4 bg-amber-50 p-3">
                      <p class="text-xs font-bold text-amber-700 uppercase mb-1">Статус:</p>
                      <p class="text-sm text-gray-700">Решение на проверке у эксперта. Ожидайте обратную связь.</p>
                    </div>
                    <div class="flex gap-2 items-center mt-3">
                      <span *ngIf="submission.status.expertReview === 'approved'" class="border-2 border-emerald-400 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 font-semibold uppercase">✓ ОДОБРЕНО</span>
                      <span *ngIf="submission.status.expertReview === 'rejected'" class="border-2 border-red-400 bg-red-50 text-red-700 text-xs px-3 py-1 font-semibold uppercase">✗ ОТКЛОНЕНО</span>
                      <span *ngIf="submission.status.expertReview === 'pending'" class="border-2 border-amber-400 bg-amber-50 text-amber-700 text-xs px-3 py-1 font-semibold uppercase">○ ОЖИДАНИЕ</span>
                    </div>
                  </a>
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
  selectedTechs: string[] = [];
  showProfileEdit = false;
  showSkillEdit = false;
  
  allTasks: Task[] = [];
  tasksInProgress: string[] = [];
  allSubmissions: Submission[] = [];
  
  profile = {
    fullName: 'Иван Петров',
    city: 'Москва',
    about: 'Junior Frontend разработчик, ищу первую работу в IT. Увлекаюсь веб-разработкой, готов учиться и развиваться.',
    skills: [
      { name: 'JavaScript', level: 'базовый' as const },
      { name: 'React', level: 'начинающий' as const },
      { name: 'HTML/CSS', level: 'опытный' as const },
      { name: 'Git', level: 'базовый' as const }
    ]
  };

  editProfile = { ...this.profile, skills: this.profile.skills.map(skill => ({ ...skill })) };

  newSkill = { name: '', level: 'базовый' as const };

  constructor(private repository: TalentBridgeRepository) {}

  ngOnInit() {
    this.allTasks = this.repository.getAvailableTasks();
    this.tasksInProgress = this.repository.getTasksInProgress();
    this.allSubmissions = this.repository.getCandidateSubmissions();
  }

  get filteredAvailableTasks(): Task[] {
    return this.allTasks.filter(task => {
      const notInProgress = !this.tasksInProgress.includes(task.id);
      const techMatch = this.selectedTechs.length === 0 || 
        this.selectedTechs.some(tech => task.technologies.includes(tech));
      return notInProgress && techMatch;
    });
  }

  get tasksInProgressList(): Task[] {
    return this.allTasks.filter(task => this.tasksInProgress.includes(task.id));
  }

  get completedSubmissions(): Submission[] {
    return this.allSubmissions.filter(sub => 
      sub.status.expertReview === 'approved' || sub.status.expertReview === 'rejected'
    );
  }

  toggleTech(tech: string) {
    const index = this.selectedTechs.indexOf(tech);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    } else {
      this.selectedTechs.push(tech);
    }
  }

  addSkill() {
    if (this.newSkill.name) {
      this.editProfile.skills.push({ ...this.newSkill });
      this.newSkill = { name: '', level: 'базовый' };
      this.showSkillEdit = false;
    }
  }

  removeSkill(name: string) {
    this.editProfile.skills = this.editProfile.skills.filter(s => s.name !== name);
  }

  openProfileEdit() {
    this.editProfile = {
      ...this.profile,
      skills: this.profile.skills.map(skill => ({ ...skill }))
    };
    this.showProfileEdit = true;
  }

  saveProfile() {
    this.profile = {
      ...this.editProfile,
      skills: this.editProfile.skills.map(skill => ({ ...skill }))
    };
    this.showProfileEdit = false;
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'начинающий':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'базовый':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'опытный':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }
}
