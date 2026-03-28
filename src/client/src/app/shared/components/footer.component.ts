import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-900 text-slate-400 mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm">
                TB
              </div>
              <span class="text-lg font-bold text-white">
                Talent<span class="text-indigo-400">Bridge</span>
              </span>
            </div>
            <p class="text-sm leading-relaxed text-slate-500">
              Платформа для оценки навыков разработчиков через реальные проектные задания. Без резюме, только код.
            </p>
            <div class="flex gap-3 mt-4">
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">G</a>
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">X</a>
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">in</a>
            </div>
          </div>

          <div>
            <h4 class="text-white text-sm font-semibold mb-4">Для кандидатов</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/candidate-dashboard" class="hover:text-slate-200 transition-colors">Найти задания</a></li>
              <li><a routerLink="/candidate-dashboard" class="hover:text-slate-200 transition-colors">Мой профиль</a></li>
              <li><a routerLink="/candidates-ranking" class="hover:text-slate-200 transition-colors">Рейтинг кандидатов</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white text-sm font-semibold mb-4">Для работодателей</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/create-task" class="hover:text-slate-200 transition-colors">Опубликовать задание</a></li>
              <li><a routerLink="/employer-dashboard" class="hover:text-slate-200 transition-colors">База кандидатов</a></li>
              <li><a routerLink="/candidates-ranking" class="hover:text-slate-200 transition-colors">Рейтинг кандидатов</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white text-sm font-semibold mb-4">О платформе</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-slate-200 transition-colors">О нас</a></li>
              <li><a href="#" class="hover:text-slate-200 transition-colors">Блог</a></li>
              <li><a href="#" class="hover:text-slate-200 transition-colors">Конфиденциальность</a></li>
              <li><a href="#" class="hover:text-slate-200 transition-colors">Условия использования</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-800 mt-10 pt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <p>© {{ currentYear }} TalentBridge. Все права защищены.</p>
          <p>Сделано для начинающих разработчиков</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}