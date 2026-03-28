import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TalentBridgeRepository } from '../core/services/talent-bridge.repository';
import { NavbarComponent } from '../shared/components/navbar.component';
import { ReviewProgressComponent } from '../shared/components/review-progress.component';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';
import { Submission } from '../core/models/domain.models';

@Component({
  selector: 'app-submission-results',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ReviewProgressComponent, StatusBadgeComponent],
  template: `
    <div class="min-h-screen bg-white">
      <app-navbar [role]="'candidate'"></app-navbar>

      <div class="max-w-6xl mx-auto px-8 py-8" *ngIf="submission; else notFound">
        <a [routerLink]="'/candidate-dashboard'" class="text-sm uppercase tracking-wider text-gray-600 hover:text-indigo-600">← Назад</a>

        <!-- Header Section -->
        <div class="border-2 border-black p-8 mt-4 mb-8">
          <h1 class="text-2xl font-bold mb-4 uppercase">{{ submission.taskTitle }}</h1>
          <p class="text-sm mb-6"><span class="font-bold uppercase">ОТПРАВЛЕНО:</span> {{ submission.submittedDate }}</p>

          <app-review-progress
            [autoTests]="submission.status.autoTests"
            [aiAnalysis]="submission.status.aiAnalysis"
            [expertReview]="submission.status.expertReview"
          ></app-review-progress>
        </div>

        <!-- Overall Verdict -->
        <div class="border-2 border-black p-8 mb-8 text-center">
          <h2 class="font-bold text-2xl mb-4 uppercase">ОБШИЙ ВЕРДИКТ</h2>
          <app-status-badge [status]="getVerdictStatus()"></app-status-badge>
          <p class="mt-6 text-lg font-bold uppercase">{{ getVerdictText() }}</p>
        </div>

        <!-- Content Sections -->
        <div class="space-y-6">
          <!-- Auto Tests Section -->
          <div class="border-2 border-black p-6" *ngIf="submission.autoTestsResults as auto">
            <div class="border-b-2 border-gray-200 pb-4 mb-4">
              <h2 class="font-bold text-xl mb-2 uppercase">1. АВ"ТОТЕСТЫ</h2>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold">{{ auto.passed }} / {{ auto.total }} тестов пройдено</span>
                <span class="text-sm font-bold">{{ ((auto.passed / auto.total) * 100).toFixed(0) }}%</span>
              </div>
              <div class="w-full h-8 border-2 border-black flex">
                <div 
                  [style.width.%]="(auto.passed / auto.total) * 100"
                  [ngClass]="auto.passed === auto.total ? 'bg-emerald-500' : 'bg-amber-500'">
                </div>
              </div>
            </div>

            <!-- Test Results -->
            <div class="space-y-3">
              <div *ngFor="let test of auto.tests" class="border-2 border-black p-3 flex items-center justify-between">
                <span class="text-sm font-bold">{{ test.name }}</span>
                <app-status-badge [status]="test.passed ? 'passed' : 'failed'"></app-status-badge>
              </div>
            </div>
          </div>

          <!-- AI Analysis Section -->
          <div class="border-2 border-black p-6" *ngIf="submission.aiAnalysisResults as ai">
            <div class="border-b-2 border-gray-200 pb-4 mb-4">
              <h2 class="font-bold text-xl mb-2 uppercase">2. AI-АНАЛИЗ</h2>
              <p class="text-sm text-gray-600">{{ ai.issues.length }} проблем/рекомендаций</p>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let issue of ai.issues; let i = index" class="border-2 border-black p-4">
                <div class="flex gap-4 mb-2">
                  <span class="font-bold text-lg text-indigo-600 flex-shrink-0">{{ i + 1 }}</span>
                  <span class="font-bold text-sm uppercase text-gray-700">{{ issue.category }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ issue.description }}</p>
              </div>
            </div>
          </div>

          <!-- Expert Review Section -->
          <div class="border-2 border-black p-6">
            <div class="border-b-2 border-gray-200 pb-4 mb-4">
              <h2 class="font-bold text-xl mb-2 uppercase">3. ЭКСПЕРТНОЕ РЕВЬЮ</h2>
            </div>
            
            <div *ngIf="submission.expertReviewResults as review; else pendingReview">
              <div class="mb-4">
                <app-status-badge [status]="review.approved ? 'approved' : 'rejected'"></app-status-badge>
              </div>
              <div class="border-2 border-black p-4 bg-gray-50">
                <p class="text-sm leading-relaxed">{{ review.comment }}</p>
              </div>
            </div>
            
            <ng-template #pendingReview>
              <app-status-badge [status]="'pending'"></app-status-badge>
              <p class="mt-4 text-sm text-gray-600">Очередь экспертной проверки. Пожалуйста, ожидайте.</p>
            </ng-template>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="max-w-6xl mx-auto px-8 py-8">
          <div class="border-2 border-black p-8 text-center">
            <h2 class="text-xl font-bold uppercase">РЕШЕНИЕ НЕ НАЙДЕНО</h2>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class SubmissionResultsPage implements OnInit {
  submission: Submission | undefined;

  constructor(
    private repository: TalentBridgeRepository,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const submissionId = this.route.snapshot.paramMap.get('id');
    this.submission = this.repository.getSubmissionById(submissionId);
  }

  getVerdictStatus(): 'pending' | 'passed' | 'failed' | 'approved' | 'rejected' {
    if (!this.submission) return 'pending';
    
    if (this.submission.status.expertReview === 'approved') return 'approved';
    if (this.submission.status.expertReview === 'rejected') return 'rejected';
    if (this.submission.status.aiAnalysis === 'failed') return 'failed';
    if (this.submission.status.autoTests === 'failed') return 'failed';
    if (this.submission.status.autoTests === 'passed' && this.submission.status.aiAnalysis === 'passed') return 'passed';
    return 'pending';
  }

  getVerdictText(): string {
    if (!this.submission) return '';
    
    if (this.submission.status.expertReview === 'approved') return 'ОДОБРЕНО';
    if (this.submission.status.expertReview === 'rejected') return 'ОТКЛОНЕНО';
    if (this.submission.status.aiAnalysis === 'failed') return 'ТРЕБУЕТСЯ ДОРАБОТКА';
    if (this.submission.status.autoTests === 'failed') return 'НЕ ПРОШЛО АВТОТЕСТЫ';
    if (this.submission.status.expertReview === 'pending') return 'В ПРОЦЕССЕ ПРОВЕРКИ';
    return '';
  }
}
