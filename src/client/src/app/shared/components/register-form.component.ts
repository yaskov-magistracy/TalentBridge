import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CandidatesService, TechnologiesService } from '../../core';
import { ApiError, Technology } from '../../core/models/api.models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Фамилия</label>
        <input
          type="text"
          formControlName="surname"
          name="surname"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Ваша фамилия"
        />
        <div *ngIf="formGroup.get('surname')?.invalid && formGroup.get('surname')?.touched" class="mt-1 text-red-600 text-xs">
          Введите фамилию (от 1 до 50 символов)
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Имя</label>
        <input
          type="text"
          formControlName="name"
          name="name"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Ваше имя"
        />
        <div *ngIf="formGroup.get('name')?.invalid && formGroup.get('name')?.touched" class="mt-1 text-red-600 text-xs">
          Введите имя (от 1 до 50 символов)
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Отчество (необязательно)</label>
        <input
          type="text"
          formControlName="patronymic"
          name="patronymic"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Ваше отчество"
        />
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Логин</label>
        <input
          type="text"
          formControlName="email"
          name="email"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Придумайте логин"
        />
        <div *ngIf="formGroup.get('email')?.invalid && formGroup.get('email')?.touched" class="mt-1 text-red-600 text-xs">
          Введите логин (от 1 до 100 символов)
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Пароль</label>
        <input
          type="password"
          formControlName="password"
          name="password"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="••••••••"
        />
        <div *ngIf="formGroup.get('password')?.invalid && formGroup.get('password')?.touched" class="mt-1 text-red-600 text-xs">
          Введите пароль (от 1 до 100 символов)
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Подтвердите пароль</label>
        <input
          type="password"
          formControlName="confirmPassword"
          name="confirmPassword"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="••••••••"
          required
        />
        <div *ngIf="formGroup.hasError('passwordMismatch')" class="mt-2 border-2 border-red-400 bg-red-50 p-3 text-red-700 text-xs">
          ⚠️ Пароли не совпадают!
        </div>
        <div *ngIf="formGroup.get('confirmPassword')?.hasError('required') && formGroup.get('confirmPassword')?.touched" class="mt-1 text-red-600 text-xs">
          Подтвердите пароль
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Технологии (необязательно)</label>
        <div class="flex items-center gap-4">
          <button
            type="button"
            (click)="openTechModal()"
            class="flex-1 border-2 border-black px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left"
          >
            {{ selectedTechs.length > 0 ? 'Выбрано: ' + selectedTechs.join(', ') : 'Выбрать технологии' }}
          </button>
          <span class="text-xs text-gray-500 whitespace-nowrap">{{ selectedTechs.length }} выбр.</span>
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Город (необязательно)</label>
        <input
          type="text"
          formControlName="city"
          name="city"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Ваш город"
        />
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">О себе (необязательно)</label>
        <textarea
          formControlName="about"
          name="about"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="Расскажите о себе"
          rows="3"
        ></textarea>
      </div>

      <button
        type="submit"
        [disabled]="loading || formGroup.invalid"
        class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ getButtonText() }}
      </button>
    </form>

    <!-- Technology Modal -->
    <div *ngIf="showTechModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" (click)="closeTechModal()">
      <div class="bg-white border-2 border-indigo-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold mb-4 uppercase text-indigo-600">Выберите технологии</h3>
        
        <!-- Search Input -->
        <div class="mb-4">
          <input
            type="text"
            [(ngModel)]="techSearchQuery"
            (ngModelChange)="onTechSearch()"
            class="w-full border-2 border-black p-3 text-sm"
            placeholder="Поиск технологий..."
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
              [checked]="selectedTechs.includes(tech.name)"
              (change)="toggleTech(tech)"
              class="w-4 h-4 border-2 border-black"
            />
            <span>{{ tech.name }}</span>
          </label>
          <div *ngIf="filteredTechs.length === 0 && hasSearched" class="col-span-3 text-center py-8 text-gray-500">
            Технологии не найдены
          </div>
        </div>

        <!-- Selected Technologies -->
        <div *ngIf="selectedTechs.length > 0" class="mt-4 pt-4 border-t-2">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Выбрано:</p>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let tech of selectedTechs" class="inline-flex items-center gap-1 border-2 border-indigo-600 bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
              {{ tech }}
              <button type="button" (click)="toggleTechByName(tech)" class="hover:opacity-70">×</button>
            </span>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex gap-2">
          <button
            type="button"
            (click)="closeTechModal()"
            class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors uppercase font-semibold"
          >
            Готово
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center border-t-2 border-gray-200 pt-6">
      <p class="text-sm text-gray-600 mb-3">
        Уже есть аккаунт?
      </p>
      <a
        [routerLink]="'/junior-auth'"
        [queryParams]="{mode: 'login'}"
        class="text-sm font-bold text-indigo-600 hover:underline uppercase tracking-wider"
      >
        Войти
      </a>
    </div>

    <div class="mt-6 text-center">
      <a [routerLink]="'/'" class="text-xs hover:underline uppercase tracking-wider text-gray-600 hover:text-indigo-600 font-semibold">
        ← НАЗАД НА ГЛАВНУЮ
      </a>
    </div>
  `
})
export class RegisterForm implements OnInit {
  formGroup: FormGroup;
  loading = false;
  showTechModal = false;
  techSearchQuery = '';
  availableTechs: Technology[] = [];
  filteredTechs: Technology[] = [];
  selectedTechs: string[] = [];
  loadingTechs = false;
  hasSearched = false;
  private searchTimeout: any;
  private notificationService = inject(NotificationService);

  constructor(
    private authService: AuthService,
    private candidatesService: CandidatesService,
    private technologiesService: TechnologiesService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      surname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      patronymic: [''],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
      city: [''],
      about: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadTechnologies();
  }

  private loadTechnologies(): void {
    this.loadingTechs = true;
    this.technologiesService.searchTechnologies({}).subscribe({
      next: (response) => {
        if (response && response.items && response.items.length > 0) {
          this.availableTechs = response.items;
          this.filteredTechs = response.items;
        }
        this.loadingTechs = false;
      },
      error: (error) => {
        console.error('Failed to load technologies:', error);
        this.loadingTechs = false;
      }
    });
  }

  openTechModal(): void {
    this.showTechModal = true;
    this.techSearchQuery = '';
    this.filteredTechs = this.availableTechs;
    this.hasSearched = false;
  }

  closeTechModal(): void {
    this.showTechModal = false;
    this.techSearchQuery = '';
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
            this.filteredTechs = this.availableTechs.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
            this.loadingTechs = false;
            this.cdr.markForCheck();
          }
        });
      } else {
        this.filteredTechs = this.availableTechs;
        this.hasSearched = false;
        this.cdr.markForCheck();
      }
    }, 300);
  }

  toggleTech(tech: Technology): void {
    const index = this.selectedTechs.indexOf(tech.name);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    } else {
      this.selectedTechs.push(tech.name);
    }
  }

  toggleTechByName(techName: string): void {
    const index = this.selectedTechs.indexOf(techName);
    if (index > -1) {
      this.selectedTechs.splice(index, 1);
    }
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (password && confirmPassword && password === confirmPassword) {
      group.get('confirmPassword')?.setErrors(null);
    }
    
    return null;
  }

  getButtonText(): string {
    if (this.loading) return 'Загрузка...';
    if (this.formGroup.hasError('passwordMismatch')) return 'Пароли не совпадают';
    return 'Зарегистрироваться';
  }

  async submit(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      const formValue = this.formGroup.value;

      // Получаем ID выбранных технологий
      const techIds: string[] = [];
      if (this.selectedTechs.length > 0) {
        const selectedTechObjects = this.availableTechs.filter(t => this.selectedTechs.includes(t.name));
        selectedTechObjects.forEach(t => techIds.push(t.id));
      }

      await this.candidatesService.createCandidate({
        login: formValue.email,
        password: formValue.password,
        surname: formValue.surname,
        name: formValue.name,
        patronymic: formValue.patronymic || undefined,
        city: formValue.city || '',
        about: formValue.about || '',
        technologies: techIds
      }).toPromise();

      await this.authService.login({
        login: formValue.email,
        password: formValue.password
      });

      this.router.navigateByUrl('/candidate-dashboard');
    } catch (error) {
      console.error('Register error:', error);
      const apiError = error as ApiError;
      this.notificationService.error(apiError?.message || 'Произошла ошибка. Попробуйте позже.');
    } finally {
      this.loading = false;
    }
  }
}
