import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { iStatusResponse } from '../../interfaces/status.interface';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';
import { StatusApi } from '../../apis/status.api';

const MODULES = [TableModule, CommonModule, ButtonModule];

@Component({
  selector: 'app-status-list',
  imports: [...MODULES],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StatusListComponent implements OnInit {
  private readonly _statusApi = inject(StatusApi);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);
  private readonly _cdr = inject(ChangeDetectorRef);

  page: number = 1;
  pageSize: number = 10;

  statusList: iStatusResponse[] = [];
  loading: boolean = true;
  selectedStatus: iStatusResponse | null = null;
  formVisible = false;

  @Output() editStatus = new EventEmitter<iStatusResponse>();

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad(): void {
    this._isLoading.start();
    this.loading = true;

    this._statusApi
      .get({ page: this.page, pageSize: this.pageSize })
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: (response: iApiResponse<iStatusResponse>) => {
          this.statusList = response?.response || [];
          this.loading = false;
          this._cdr.detectChanges();
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message || 'Erro ao carregar status.', 3000, 'center', 'bottom');
          this.loading = false;
        },
        complete: () => {
          this._isLoading.stop();
        },
      });
  }

  onDelete(status: iStatusResponse) {
    this._isLoading.start();

    this._statusApi
      .delete(status.id)
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: () => {
          this._snackBarService.showSnackBar('Status excluído com sucesso.', 3000, 'center', 'bottom');
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message || 'Erro ao excluir status.', 3000, 'center', 'bottom');
        },
        complete: () => {
          this.onLoad();
          this._isLoading.stop();
        },
      });
  }

  onEdit(status: iStatusResponse) {
    this.editStatus.emit(status);
  }

  handleFormSave() {
    this.formVisible = false;
    this.selectedStatus = null;
    this.onLoad();
  }
}
