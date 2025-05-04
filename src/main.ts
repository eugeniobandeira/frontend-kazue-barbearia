// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

/* main.ts */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// ===============================================
// 1. FORÇAR TEMA LIGHT ANTES DE INICIAR O ANGULAR
// ===============================================
document.documentElement.style.colorScheme = 'light';
document.documentElement.classList.add('light-theme');
document.documentElement.setAttribute('data-theme', 'light');

// Limpar qualquer configuração de tema anterior
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('p-theme');
  localStorage.removeItem('theme-preference');
}

// 2. INICIAR APLICAÇÃO ANGULAR
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
