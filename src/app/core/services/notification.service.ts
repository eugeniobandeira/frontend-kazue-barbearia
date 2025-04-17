import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(messageKey: string, params?: object): void {
    this.show(messageKey, 'success-snackbar', params);
  }

  showError(messageKey: string, params?: object): void {
    this.show(messageKey, 'error-snackbar', params);
  }

  private show(messageKey: string, panelClass: string, params?: object): void {
    this.snackBar.open(messageKey, 'OK', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
