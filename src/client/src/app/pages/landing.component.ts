/**
 * LandingComponent - Главная страница платформы TalentBridge
 * 
 * Это первая страница, которую видят пользователи.
 * Предоставляет выбор роли: кандидат (junior) или работодатель.
 * 
 * Структура страницы:
 * 1. Шапка с логотипом
 * 2. Hero-секция с заголовком и описанием
 * 3. Выбор роли (две большие карточки)
 * 4. Блок с описанием трехэтапной проверки
 * 5. Секция преимуществ
 * 
 * Переходы:
 * - Клик на "Я джун" -> /junior-auth
 * - Клик на "Я работодатель" -> /employer-auth
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота во весь экран
      - bg-gradient-to-br: градиентный фон от slate-50 к indigo-50
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      
      <!-- ===== ШАПКА С ЛОГОТИПОМ ===== -->
      <div class="border-b-2 border-indigo-600 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <!-- Логотип с градиентным текстом -->
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            TALENTBRIDGE
          </h1>
        </div>
      </div>

      <!-- ===== ОСНОВНОЕ СОДЕРЖИМОЕ ===== -->
      <div class="max-w-6xl mx-auto px-8 py-20">
        
        <!-- ===== HERO СЕКЦИЯ ===== -->
        <div class="text-center mb-20">
          <!-- Бейдж с призывом к действию -->
          <div class="inline-block mb-6">
            <div class="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full border border-indigo-300">
              <span class="text-sm font-semibold">✨ Решение парадокса опыта</span>
            </div>
          </div>
          
          <!-- Главный заголовок -->
          <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            ПЛАТФОРМА ДЛЯ НАЧАЛА КАРЬЕРЫ
          </h2>
          
          <!-- Подзаголовок -->
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Выполняй реальные задачи от компаний, получай опыт и находи свою первую работу в IT
          </p>
        </div>

        <!-- ===== ВЫБОР РОЛИ ===== -->
        <!-- Две большие карточки для выбора роли -->
        <div class="grid grid-cols-2 gap-8 mb-24">
          
          <!-- Карточка: Я ДЖУН -->
          <a routerLink="/junior-auth"
             class="group relative border-2 border-indigo-600 bg-white p-12 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-center">
              <!-- Иконка -->
              <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">👨‍💻</div>
              <!-- Заголовок карточки -->
              <h3 class="text-2xl font-bold mb-3 text-indigo-600">Я ДЖУН</h3>
              <!-- Описание -->
              <p class="text-gray-600">Выполняю задания для получения опыта</p>
            </div>
            <!-- Эффект рамки при наведении -->
            <div class="absolute inset-0 border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
          </a>

          <!-- Карточка: Я РАБОТОДАТЕЛЬ -->
          <a routerLink="/employer-auth"
             class="group relative border-2 border-emerald-600 bg-white p-12 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-center">
              <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
              <h3 class="text-2xl font-bold mb-3 text-emerald-600">Я РАБОТОДАТЕЛЬ</h3>
              <p class="text-gray-600">Создаю задания и ищу талантливых кандидатов</p>
            </div>
            <div class="absolute inset-0 border-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -m-1"></div>
          </a>
          
        </div>

        <!-- ===== ТРЕХЭТАПНАЯ ПРОВЕРКА ===== -->
        <div class="border-2 border-indigo-600 bg-white p-10 shadow-xl">
          <!-- Заголовок блока -->
          <div class="text-center mb-10">
            <h3 class="text-3xl font-bold mb-3 text-indigo-600">ТРЕХЭТАПНАЯ ПРОВЕРКА РЕШЕНИЙ</h3>
            <p class="text-gray-600">Объективная оценка твоих навыков на каждом этапе</p>
          </div>
          
          <!-- Три карточки этапов -->
          <div class="grid grid-cols-3 gap-8">
            
            <!-- ЭТАП 1: АВТОТЕСТЫ -->
            <div class="border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-white p-8 hover:shadow-lg transition-shadow">
              <!-- Номер этапа -->
              <div class="w-20 h-20 border-2 border-indigo-600 bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 mb-6 mx-auto">
                1
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-indigo-600">АВТОТЕСТЫ</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">
                Автоматическая проверка функциональности и качества кода
              </p>
            </div>

            <!-- ЭТАП 2: AI-АНАЛИЗ -->
            <div class="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-white p-8 hover:shadow-lg transition-shadow">
              <div class="w-20 h-20 border-2 border-purple-600 bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600 mb-6 mx-auto">
                2
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-purple-600">AI-АНАЛИЗ</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">
                Искусственный интеллект проверяет архитектуру и best practices
              </p>
            </div>

            <!-- ЭТАП 3: ЭКСПЕРТНОЕ РЕВЬЮ -->
            <div class="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white p-8 hover:shadow-lg transition-shadow">
              <div class="w-20 h-20 border-2 border-emerald-600 bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-600 mb-6 mx-auto">
                3
              </div>
              <h4 class="font-bold text-xl mb-3 text-center text-emerald-600">ЭКСПЕРТНОЕ РЕВЬЮ</h4>
              <p class="text-sm text-center text-gray-600 leading-relaxed">
                Опытный разработчик дает финальную оценку и комментарии
              </p>
            </div>
            
          </div>
        </div>

        <!-- ===== ПРЕИМУЩЕСТВА ===== -->
        <div class="mt-20 grid grid-cols-3 gap-6">
          
          <!-- Преимущество 1: Реальный опыт -->
          <div class="bg-white border-2 border-indigo-200 p-6 text-center">
            <div class="text-4xl mb-4">✅</div>
            <h4 class="font-bold text-lg mb-2">Реальный опыт</h4>
            <p class="text-sm text-gray-600">Работа над настоящими проектами компаний</p>
          </div>
          
          <!-- Преимущество 2: Портфолио -->
          <div class="bg-white border-2 border-purple-200 p-6 text-center">
            <div class="text-4xl mb-4">✨</div>
            <h4 class="font-bold text-lg mb-2">Портфолио</h4>
            <p class="text-sm text-gray-600">Докажи свои навыки выполненными проектами</p>
          </div>
          
          <!-- Преимущество 3: Прямой путь к работе -->
          <div class="bg-white border-2 border-emerald-200 p-6 text-center">
            <div class="text-4xl mb-4">👥</div>
            <h4 class="font-bold text-lg mb-2">Прямой путь к работе</h4>
            <p class="text-sm text-gray-600">Компании сами приглашают лучших кандидатов</p>
          </div>
          
        </div>
        
      </div>
    </div>
  `
})
export class LandingComponent {}
