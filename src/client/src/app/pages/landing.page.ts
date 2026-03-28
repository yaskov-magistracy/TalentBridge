import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-full bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      <div class="border-b-2 border-indigo-600 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            TALENTBRIDGE
          </h1>
        </div>
      </div>

      <div class="flex-1 max-w-6xl mx-auto w-full px-8 py-20">
        <div class="text-center mb-20">
          <div class="inline-block mb-6">
            <div class="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full border border-indigo-300">
              <span class="text-sm">✨</span>
              <span class="text-sm font-semibold">Решение парадокса опыта</span>
            </div>
          </div>
          <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent uppercase tracking-wider">
            Платформа для начала карьеры
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Выполняй реальные задачи от компаний, получай опыт и находи свою первую работу в IT
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-24">
          <a routerLink="/junior-auth" class="group relative border-2 border-indigo-600 bg-white p-12 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer text-center">
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">👨‍💻</div>
            <h3 class="text-2xl font-bold mb-3 text-indigo-600 uppercase tracking-wider">Я ДЖУН</h3>
            <p class="text-gray-600">Выполняю задания для получения опыта</p>
            <div class="absolute inset-0 border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
          </a>

          <a routerLink="/employer-auth" class="group relative border-2 border-emerald-600 bg-white p-12 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer text-center">
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
            <h3 class="text-2xl font-bold mb-3 text-emerald-600 uppercase tracking-wider">Я РАБОТОДАТЕЛЬ</h3>
            <p class="text-gray-600">Создаю задания и ищу талантливых кандидатов</p>
            <div class="absolute inset-0 border-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
          </a>
        </div>

        <div class="border-2 border-indigo-600 bg-white p-10 shadow-xl">
          <div class="text-center mb-10">
            <h3 class="text-3xl font-bold mb-3 text-indigo-600 uppercase">Трехэтапная проверка решений</h3>
            <p class="text-gray-600">Объективная оценка твоих навыков на каждом этапе</p>
          </div>

          <div class="grid grid-cols-3 gap-8">
            <div class="border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-white p-8 hover:shadow-lg transition-shadow">
              <div class="w-20 h-20 border-2 border-indigo-600 bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 mb-6 mx-auto">
                1
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-indigo-600 uppercase">Автотесты</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">Автоматическая проверка функциональности и качества кода</p>
            </div>

            <div class="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-white p-8 hover:shadow-lg transition-shadow">
              <div class="w-20 h-20 border-2 border-purple-600 bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600 mb-6 mx-auto">
                2
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-purple-600 uppercase">AI-анализ</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">Искусственный интеллект проверяет архитектуру и best practices</p>
            </div>

            <div class="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white p-8 hover:shadow-lg transition-shadow">
              <div class="w-20 h-20 border-2 border-emerald-600 bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-600 mb-6 mx-auto">
                3
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-emerald-600 uppercase">Экспертное ревью</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">Опытный разработчик дает финальную оценку и комментарии</p>
            </div>
          </div>
        </div>

        <div class="mt-20 grid grid-cols-3 gap-6">
          <div class="bg-white border-2 border-indigo-200 p-6 text-center">
            <div class="text-4xl text-indigo-600 mb-4">✓</div>
            <h4 class="font-bold text-lg mb-2">Реальный опыт</h4>
            <p class="text-sm text-gray-600">Работа над настоящими проектами компаний</p>
          </div>
          <div class="bg-white border-2 border-purple-200 p-6 text-center">
            <div class="text-4xl text-purple-600 mb-4">✨</div>
            <h4 class="font-bold text-lg mb-2">Портфолио</h4>
            <p class="text-sm text-gray-600">Докажи свои навыки выполненными проектами</p>
          </div>
          <div class="bg-white border-2 border-emerald-200 p-6 text-center">
            <div class="text-4xl text-emerald-600 mb-4">👥</div>
            <h4 class="font-bold text-lg mb-2">Прямой путь к работе</h4>
            <p class="text-sm text-gray-600">Компании сами приглашают лучших кандидатов</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LandingPage {}
