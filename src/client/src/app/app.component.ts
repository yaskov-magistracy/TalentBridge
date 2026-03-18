/**
 * AppComponent - Корневой компонент приложения
 * 
 * Этот компонент является контейнером для всего приложения.
 * Он содержит router-outlet, в который Angular рендерит
 * активные компоненты на основе текущего маршрута.
 * 
 * Структура:
 * - <router-outlet></router-outlet> - точка вставки для активного компонента
 * 
 * Пример работы:
 * - При переходе на /candidate-dashboard, router-outlet отобразит CandidateDashboardComponent
 * - При переходе на /employer-dashboard, router-outlet отобразит EmployerDashboardComponent
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  // Селектор для использования в index.html
  selector: 'app-root',
  
  // Отдельный файл стилей (не используется, стили в глобальном styles.css)
  styleUrls: ['./app.component.css'],
  
  // Inline шаблон с router-outlet
  template: `
    <!-- 
      router-outlet - директива Angular Router
      Здесь отображается компонент, соответствующий текущему маршруту
    -->
    <router-outlet></router-outlet>
  `,
  
  // НЕ standalone - этот компонент объявляется в AppModule
  standalone: false
})
export class AppComponent {
  /**
   * Заголовок приложения
   * Используется для идентификации компонента в инструментах разработки
   */
  title = 'TalentBridge Platform Prototype (Angular)';
}
