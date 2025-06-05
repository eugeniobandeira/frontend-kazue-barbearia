import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const MODULES = [RouterModule, NgxSpinnerModule, ToastModule];

interface NgxSpinnerConfig {
  type?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...MODULES],
  providers: [MessageService],
  template: `
    <router-outlet></router-outlet>
    <ngx-spinner name="globalSpinner" bdColor="rgba(51,51,51,0.8)" size="medium" color="#fff" type="ball-scale-multiple">
      <p style="font-size: 20px; color: white">Carregando...</p>
    </ngx-spinner>
    <p-toast></p-toast>
  `,
})
export class AppComponent {
  private readonly messageService = inject(MessageService);
  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso!',
      detail: 'Carregamento completado com sucesso!',
    });
  }
}
