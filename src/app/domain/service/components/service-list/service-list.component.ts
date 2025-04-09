import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ServiceApi } from '../../apis/service.api';
import { TableModule } from 'primeng/table';
import { iServiceApiResponse, iServiceResponse } from '../../interface/service.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

const MODULES = [TableModule, CommonModule, ButtonModule];

@Component({
  selector: 'app-service-list',
  imports: [...MODULES],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ServiceListComponent implements OnInit {
  private readonly _serviceApi = inject(ServiceApi);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);
  private readonly _cdr = inject(ChangeDetectorRef);

  page: number = 1;
  pageSize: number = 10;

  serviceList: iServiceResponse[] = [];
  loading: boolean = true;
  selectedService: iServiceResponse | null = null;
  formVisible = false;

  @Output() editService = new EventEmitter<iServiceResponse>();

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad(): void {
    this._isLoading.start();
    this.loading = true;

    this._serviceApi
      .get({ page: this.page, pageSize: this.pageSize })
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: (response: iServiceApiResponse) => {
          this.serviceList = response?.response || [];
          this.loading = false;
          this._cdr.detectChanges();
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message || 'Erro ao carregar serviços.', 3000, 'end', 'top');
          this.loading = false;
        },
        complete: () => {
          this._isLoading.stop();
        },
      });
  }

  onDelete(service: iServiceResponse) {
    this._isLoading.start();

    this._serviceApi
      .delete(service.id)
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: () => {
          this._snackBarService.showSnackBar('Serviço excluído com sucesso.', 3000, 'start', 'top');
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message || 'Erro ao excluir serviço.', 3000, 'end', 'top');
        },
        complete: () => {
          this.onLoad();
          this._isLoading.stop();
        },
      });
  }

  onEdit(service: iServiceResponse) {
    this.editService.emit(service);
  }

  handleFormSave() {
    this.formVisible = false;
    this.selectedService = null;
    this.onLoad();
  }
}
