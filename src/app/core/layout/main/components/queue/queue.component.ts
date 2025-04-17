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

const MODULES = [CommonModule, TableModule, BadgeModule, TagModule];

@Component({
  selector: 'app-queue',
  imports: [...MODULES],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class QueueComponent implements OnInit {
  private readonly _queueApi = inject(QueueApi);
  private readonly _barbershopService = inject(BarbershopService);

  public todayQueue = this._queueApi.queueListByDate;
  public barbershopInfo = this._barbershopService.barbershopInfo;
  public dataFormatada = moment().format('YYYY-MM-DD');
  public queue = signal<iQueueResponse[]>([]);

  public page = 1;
  public pageSize = 4;

  ngOnInit(): void {
    this.loadQueueByDate(this.dataFormatada);
  }

  loadQueueByDate(date: string): void {
    this._queueApi.getByDate(date).subscribe({
      next: (apiResponse: iApiResponse<iQueueResponse[]>) => {
        this.queue.set(apiResponse?.response);
      },
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

  stockSeverity(item: iQueueResponse): 'success' | 'warning' | 'danger' {
    switch (item.status.description) {
      case 'Ok':
        return 'danger';
      case 'Teste':
        return 'warning';
      case 'Ativo':
      default:
        return 'success';
    }
  }
}
