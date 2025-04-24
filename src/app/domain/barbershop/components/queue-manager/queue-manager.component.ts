import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { catchError, EMPTY, finalize } from 'rxjs';
import { QueueApi } from '@/domain/queue/apis/queue.api';
import { BarbershopService } from '@/domain/barbershop/services/barbershop.service';
import { iQueueResponse } from '@/domain/queue/interfaces/queue.interface';
import { UserApi } from '@/domain/user/apis/user.api';
import { ServiceApi } from '@/domain/service/apis/service.api';
import { StatusApi } from '@/domain/status/apis/status.api';
import { QueueManagerFormGroup, createQueueManagerFormControl } from '../../constants/queue-manager-form';
import { MultiSelectModule } from 'primeng/multiselect';
import { eDomain } from '@/domain/status/enums/domain.enum';
import moment from 'moment';
import { StatusUtils } from '@/shared/utils/status-severirty';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

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
];

@Component({
  selector: 'app-queue-manager',
  standalone: true,
  imports: [...MODULES],
  templateUrl: './queue-manager.component.html',
  styleUrls: ['./queue-manager.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class QueueManagerComponent implements OnInit {
  private readonly _queueApi = inject(QueueApi);
  private readonly _queueStateService = inject(QueueApi);
  private readonly _userApi = inject(UserApi);
  private readonly _serviceApi = inject(ServiceApi);
  private readonly _statusApi = inject(StatusApi);
  private readonly _barbershopService = inject(BarbershopService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);

  public queue = this._queueApi.queueList;
  public loading = signal(true);
  public loadingBarbers = signal(false);
  public loadingServices = signal(false);
  public loadingStatus = signal(false);

  public barbershopInfo = this._barbershopService.barbershopInfo;

  public displayEditDialog = signal(false);
  public selectedItem: iQueueResponse | null = null;
  public queueForm: QueueManagerFormGroup = createQueueManagerFormControl();

  public barberList = signal<any[]>([]);
  public serviceList = signal<any[]>([]);
  public statusList = signal<any[]>([]);

  public dataFormatada = moment().format('YYYY-MM-DD');

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    return StatusUtils.getStatusSeverity(status);
  }

  showDialog: boolean = false;

  ngOnInit(): void {
    this.loadQueueData();
    this.loadInitialData();
  }

  loadQueueData(): void {
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

  loadInitialData(): void {
    this.loadBarbers();
    this.loadServices();
    this.loadStatus();
  }

  loadBarbers(): void {
    this.loadingBarbers.set(true);
    this._userApi
      .getBarberList()
      .pipe(finalize(() => this.loadingBarbers.set(false)))
      .subscribe({
        next: barbers => this.barberList.set(barbers),
        error: err => console.error('Error loading barbers:', err),
      });
  }

  loadServices(): void {
    this.loadingServices.set(true);
    this._serviceApi
      .get()
      .pipe(finalize(() => this.loadingServices.set(false)))
      .subscribe({
        next: response => this.serviceList.set(response.response || []),
        error: err => console.error('Error loading services:', err),
      });
  }

  loadStatus(): void {
    this.loadingStatus.set(true);
    this._statusApi
      .loadAll()
      .pipe(finalize(() => this.loadingStatus.set(false)))
      .subscribe({
        next: response => this.statusList.set(response.response.filter(domain => domain.domain === eDomain.CORTE) || []),
        error: err => console.error('Error loading status:', err),
      });
  }

  shouldShowQueue(): boolean {
    return this.barbershopInfo().isOpen || this.queue().length > 0;
  }

  // getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
  //   switch (status?.toUpperCase()) {
  //     case 'EM ANDAMENTO':
  //       return 'warn';
  //     case 'FINALIZADO':
  //       return 'success';
  //     default:
  //       return 'info';
  //   }
  // }

  openEditDialog(item: iQueueResponse): void {
    this.selectedItem = item;
    this.showDialog = true;

    this.queueForm.patchValue({
      idCustomer: item.customer.id.toString(),
      idBarber: item.barber.id.toString(),
      idServices: item.services.map(s => s.id.toString()),
      amount: item.amount,
    });
  }

  closeEditDialog(): void {
    this.showDialog = false;
    this.queueForm.reset();
    this.selectedItem = null;
  }

  onEditSubmit(): void {
    if (this.queueForm.invalid || !this.selectedItem) return;

    const formValue = this.queueForm.getRawValue();

    this._queueApi
      .update(this.selectedItem.id, {
        idCustomer: formValue.idCustomer,
        idBarber: formValue.idBarber,
        idServices: formValue.idServices,
        idStatus: formValue.idStatus,
        amount: formValue.amount,
      })
      .subscribe({
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Atendimento atualizado com sucesso!',
          });
          this.closeEditDialog();
          this.loadQueueData();
        },
        error: err => {
          console.error('Error updating queue:', err);
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar atendimento!',
          });
        },
      });

    this.showDialog = false;
  }

  confirmDelete(queueId: number): void {
    this._confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este atendimento?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this._queueApi.delete(queueId).subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Atendimento cancelado com sucesso!',
            });
            this.loadQueueData();
          },
          error: err => {
            console.error('Erro ao cancelar atendimento:', err);
            this._messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao cancelar atendimento!',
            });
          },
        });
      },
    });
  }

  rowClass(item: iQueueResponse) {
    return {
      'bg-blue-50': item.status.description === 'EM ANDAMENTO',
      'bg-green-50': item.status.description === 'FINALIZADO',
    };
  }

  rowStyle(item: iQueueResponse) {
    return {
      'font-weight': item.status.description === 'PENDENTE' ? '500' : 'normal',
    };
  }
}
