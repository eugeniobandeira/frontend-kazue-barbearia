import { iQueueResponse } from '@/domain/queue/interfaces/queue.interface';
import { ServiceApi } from '@/domain/service/apis/service.api';
import { StatusApi } from '@/domain/status/apis/status.api';
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

  ngOnInit(): void {
    this.onLoadUsers();
  }

  onLoadUsers() {
    this.loading.set(true);
    this._userApi
      .getAllUsers({
        page: this.currentPage(),
        pageSize: this.pageSize(),
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
      .subscribe(users => {
        this.userList.set(users);
        // Atualize totalRecords se sua API retornar o total
        // this.totalRecords.set(response.total);
      });
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page + 1);
    this.pageSize.set(event.rows);
    this.onLoadUsers();
  }

  getSeverity(status: string): string {
    // Implemente sua lógica de severidade aqui
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'danger';
      case 'pendente':
        return 'warning';
      default:
        return 'info';
    }
  }

  editUser(user: iUser) {
    // Implemente a lógica de edição
    console.log('Editar usuário:', user);
  }

  confirmDelete(userId: string) {
    // Implemente a confirmação de exclusão
    console.log('Excluir usuário:', userId);
  }
}
