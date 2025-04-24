import { iQueueResponse } from '@/domain/queue/interfaces/queue.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import moment from 'moment';
import { QueueApi } from '@/domain/queue/apis/queue.api';
import { BadgeModule } from 'primeng/badge';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';
import { BarbershopService } from '@/domain/barbershop/services/barbershop.service';
import { TagModule } from 'primeng/tag';
import { StatusUtils } from '@/shared/utils/status-severirty';
import { finalize, catchError, EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';

const MODULES = [CommonModule, TableModule, BadgeModule, TagModule];

@Component({
  selector: 'app-queue',
  imports: [...MODULES],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [MessageService],
})
export class QueueComponent implements OnInit {
  private readonly _queueApi = inject(QueueApi);
  private readonly _barbershopService = inject(BarbershopService);
  private readonly _messageService = inject(MessageService);

  public todayQueue = this._queueApi.queueListByDate;
  public barbershopInfo = this._barbershopService.barbershopInfo;
  public dataFormatada = moment().format('YYYY-MM-DD');
  public queue = this._queueApi.queueList;
  public loading = signal(true);

  ngOnInit(): void {
    this.loadQueueByDate();

    setInterval(() => {
      this.loadQueueByDate();
    }, 300000);
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    return StatusUtils.getStatusSeverity(status);
  }

  loadQueueByDate(): void {
    this._queueApi
      .getByDate(this.dataFormatada)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(err => {
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar dados da fila. Error: ' + err.message,
          });
          return EMPTY;
        })
      )
      .subscribe({
        next: (apiResponse: iApiResponse<iQueueResponse[]>) => {},
        error: err => console.error('Error loading queue:', err),
      });
  }

  shouldShowQueue(): boolean {
    return this.barbershopInfo().isOpen || (this.todayQueue()?.length ?? 0) > 0;
  }

  rowClass(item: iQueueResponse) {
    return {
      '!bg-primary !text-primary-contrast': item.status.id === 16,
    };
  }

  rowStyle(item: iQueueResponse) {
    return item.status.description === 'Pendente' ? { fontWeight: 'bold', fontStyle: 'italic' } : {};
  }
}
