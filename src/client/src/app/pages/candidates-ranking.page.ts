import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { CandidateRanking } from '../core/models/domain.models';
import { getLevelColor } from '../shared/utils/level-colors';

@Component({
  selector: 'app-candidates-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold uppercase text-emerald-600 mb-2">РЕЙТИНГ КАНДИДАТОВ</h1>
            <p class="text-gray-600">Лучшие разработчики платформы TalentBridge</p>
          </div>
          <a [routerLink]="'/employer-dashboard'" class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2">
            ЗАКРЫТЬ
          </a>
        </div>

        <!-- Filters Section -->
        <div class="bg-white border-2 border-emerald-600 p-6 mb-6 shadow-md">
          <div class="flex gap-6 items-center flex-wrap">
            <!-- Skill Filter -->
            <div class="flex-1 min-w-64">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">ФИЛЬТР ПО НАВЫКУ</label>
              <select 
                [(ngModel)]="filterSkill" 
                class="w-full border-2 border-black p-3">
                <option value="">Все навыки</option>
                <option *ngFor="let skill of allSkills" [value]="skill">{{ skill }}</option>
              </select>
            </div>

            <!-- Sorting -->
            <div class="flex-1 min-w-64">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">СОРТИРОВКА</label>
              <select 
                [(ngModel)]="sortBy" 
                class="w-full border-2 border-black p-3">
                <option value="rating">По рейтингу ⭐</option>
                <option value="tasks">По количеству заданий 📊</option>
                <option value="successRate">По проценту успеха ✓</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Candidates List -->
        <div class="space-y-4">
          <a *ngFor="let candidate of filteredCandidates; let index = index" 
            [routerLink]="['/candidate', candidate.id]" 
            class="block bg-white border-2 border-emerald-400 p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            
            <div class="flex gap-6 flex-wrap">
              <!-- Rank Badge -->
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                #{{ index + 1 }}
              </div>

              <!-- Candidate Info -->
              <div class="flex-1">
                <!-- Header Row -->
                <div class="flex justify-between items-start mb-3 flex-wrap gap-4">
                  <div>
                    <h3 class="text-2xl font-bold mb-1 uppercase">{{ candidate.name }}</h3>
                    <div class="text-sm text-gray-600">📍 {{ candidate.city }}</div>
                  </div>

                  <!-- Stats -->
                  <div class="flex gap-6 text-center">
                    <div>
                      <div class="text-2xl font-bold text-amber-600">{{ candidate.rating.toFixed(1) }}</div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Рейтинг</p>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-emerald-600">{{ candidate.completedTasksCount }}</div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Заданий</p>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-indigo-600">{{ candidate.successRate }}%</div>
                      <p class="text-xs text-gray-500 uppercase font-bold">Успех</p>
                    </div>
                  </div>
                </div>

                <!-- About -->
                <p class="text-gray-700 mb-4 leading-relaxed text-sm">{{ candidate.about }}</p>

                <!-- Skills -->
                <div class="flex flex-wrap gap-2">
                  <div *ngFor="let skill of candidate.skills.slice(0, 5)" 
                    class="px-3 py-1 border-2 font-semibold text-sm uppercase"
                    [ngClass]="getLevelColor(skill.level)">
                    {{ skill.name }} • {{ skill.level }}
                  </div>
                  <div *ngIf="candidate.skills.length > 5" class="px-3 py-1 border-2 border-gray-300 bg-gray-50 text-gray-700 font-semibold text-sm">
                    +{{ candidate.skills.length - 5 }} еще
                  </div>
                </div>

                <!-- Last Active -->
                <p class="text-xs text-gray-500 mt-3">✓ Активен: {{ candidate.lastActive }}</p>
              </div>
            </div>
          </a>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredCandidates.length === 0" class="border-2 border-gray-400 bg-gray-50 p-8 text-center">
          <p class="text-gray-600 font-bold uppercase">НЕ НАЙДЕНО КАНДИДАТОВ С ВЫБРАННЫМИ ФИЛЬТРАМИ</p>
        </div>
      </div>
    </div>
  `
})
export class CandidatesRankingPage {
  filterSkill = '';
  sortBy: 'rating' | 'tasks' | 'successRate' = 'rating';

  constructor(private repository: TalentBridgeRepository) {}

  get allSkills(): string[] {
    return Array.from(
      new Set(
        this.repository
          .getCandidatesRanking()
          .flatMap(candidate => candidate.skills.map(skill => skill.name))
      )
    );
  }

  get filteredCandidates(): CandidateRanking[] {
    let candidates = this.repository.getCandidatesRanking();

    // Apply skill filter
    if (this.filterSkill) {
      candidates = candidates.filter(candidate =>
        candidate.skills.some(skill => skill.name === this.filterSkill)
      );
    }

    // Apply sorting
    return [...candidates].sort((a, b) => {
      if (this.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (this.sortBy === 'tasks') {
        return b.completedTasksCount - a.completedTasksCount;
      }
      return b.successRate - a.successRate;
    });
  }

  getLevelColor(level: 'начинающий' | 'базовый' | 'опытный'): string {
    return getLevelColor(level);
  }
}
