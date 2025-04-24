import { iQueueResponse } from '@/domain/queue/interfaces/queue.interface';
import { ServiceApi } from '@/domain/service/apis/service.api';
import { StatusApi } from '@/domain/status/apis/status.api';
import { eDomain } from '@/domain/status/enums/domain.enum';
import { UserApi } from '@/domain/user/apis/user.api';
import { iUser } from '@/domain/user/interfaces/user.interface';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
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
import { StatusUtils } from '@/shared/utils/status-severirty';

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
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-approval-user',
  imports: [...MODULES],
  templateUrl: './approval-user.component.html',
  styleUrl: './approval-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [MessageService, ConfirmationService],
})
export class ApprovalUserComponent implements OnInit {
  private readonly _userApi = inject(UserApi);
  private readonly _serviceApi = inject(ServiceApi);
  private readonly _statusApi = inject(StatusApi);
  private readonly _messageService = inject(MessageService);

  public loading = signal(true);
  public loadingBarbers = signal(false);
  public loadingServices = signal(false);
  public loadingStatus = signal(false);
  public selectedItem: iQueueResponse | null = null;

  public dataFormatada = moment().format('YYYY-MM-DD');
  public currentPage = signal(1);
  public pageSize = signal(10);
  public userList = signal<iUser[]>([]);
  public totalRecords = signal(0);
  public statusList = signal<any[]>([]);

  public filters = signal<{
    idStatus?: number;
    fullname?: string;
    nickname?: string;
    username?: string;
    phone?: string;
  }>({
    idStatus: undefined,
    fullname: '',
    nickname: '',
    username: '',
    phone: '',
  });

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    return StatusUtils.getStatusSeverity(status);
  }

  ngOnInit(): void {
    this.onLoadUsers();
    this.loadStatus();
  }

  onLoadUsers(): void {
    this.loading.set(true);

    const { idStatus, fullname, nickname, username, phone } = this.filters();

    this._userApi
      .getAllUsers({
        page: this.currentPage(),
        pageSize: this.pageSize(),
        idStatus,
        fullname,
        nickname,
        username,
        phone,
      })
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(error => {
          console.error('Erro ao carregar usuários:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar usuários',
          });
          return EMPTY;
        })
      )
      .subscribe({
        next: (response: iApiResponse<iUser[]>) => {
          this.userList.set(response.response);
          this.totalRecords.set(response.resultCount);
        },
        error: () => {
          this.userList.set([]);
          this.totalRecords.set(0);
        },
      });
  }

  onClearFilters(): void {
    this.filters.set({
      idStatus: undefined,
      fullname: '',
      nickname: '',
      username: '',
      phone: '',
    });
    this.currentPage.set(1);
    this.onLoadUsers();
  }

  onPageChange(event: any): void {
    const pageSize = +event.rows || 10;
    const pageNumber = +event.page || 0;

    this.pageSize.set(pageSize);
    this.currentPage.set(pageNumber + 1);
    this.onLoadUsers();
  }

  onApprove(user: iUser) {
    this._userApi
      .updateStatus(user.id, 2)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(error => {
          console.error('Erro ao aprovar usuários:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao aprovar usuário',
          });
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.onLoadUsers();
        },
        error: err => {
          console.error('erro: ', err);
        },
      });
  }

  onReject(user: iUser) {
    this._userApi
      .updateStatus(user.id, 3)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(error => {
          console.error('Erro ao reprovar usuário:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao reprovar usuários',
          });
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.onLoadUsers();
        },
        error: err => {
          console.error('erro: ', err);
        },
      });
  }

  loadStatus(): void {
    this.loadingStatus.set(true);
    this._statusApi
      .loadAll()
      .pipe(finalize(() => this.loadingStatus.set(false)))
      .subscribe({
        next: response => this.statusList.set(response.response.filter(domain => domain.domain === eDomain.USUARIO) || []),
        error: err => console.error('Error loading status:', err),
      });
  }
}
