import { QueueApi } from '@/domain/queue/apis/queue.api';
import { StatusUtils } from '@/shared/utils/status-severirty';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, catchError, EMPTY } from 'rxjs';

const MODULES = [
  CommonModule,
  TableModule,
  TagModule,
  ButtonModule,
  TooltipModule,
  ConfirmDialogModule,
  ToastModule,
  DialogModule,
  FormsModule,
  ReactiveFormsModule,
  DropdownModule,
  SelectModule,
  MultiSelectModule,
  CalendarModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-queue-history',
  standalone: true,
  imports: [...MODULES],
  templateUrl: './queue-history.component.html',
  styleUrl: './queue-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueHistoryComponent {
  private readonly _queueApi = inject(QueueApi);
  public queue = this._queueApi.queueListByDate;
  public selectedDate: Date = new Date();
  public loading = signal(true);

  onLoadQueueData(): void {
    const formattedDate = this.formatDate(this.selectedDate);

    this._queueApi
      .getHistory(formattedDate)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(err => {
          console.error('Erro: ', err);
          this._queueApi.queueListByDate.set([]);
          return EMPTY;
        })
      )
      .subscribe({
        next: response => {},
        error: err => console.error('Error loading queue:', err),
      });
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    return StatusUtils.getStatusSeverity(status);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
