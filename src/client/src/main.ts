/**
 * main.ts - Точка входа в Angular приложение
 * 
 * Этот файл инициализирует Angular приложение путем загрузки корневого модуля (AppModule)
 * и запускает приложение в браузере.
 * 
 * platformBrowserDynamic() - создает платформу для запуска Angular в браузере
 * bootstrapModule(AppModule) - загружает корневой модуль приложения
 */

import { AppModule } from './app/app.module';
import {platformBrowser} from "@angular/platform-browser";

// Загружаем корневой модуль и запускаем приложение
platformBrowser()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
