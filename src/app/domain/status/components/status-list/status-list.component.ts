import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { iStatusResponse } from '../../interfaces/status.interface';
import { StatusApi } from '../../apis/status.api';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { LoadingService } from '@/domain/auth/services/loading.service';

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

  selectedStatus = signal<iStatusResponse | null>(null);
  formVisible = signal(false);

  statusList = this._statusApi.statusList;
  loading = this._statusApi.isLoading;

  @Output() editStatus = new EventEmitter<iStatusResponse>();

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad(): void {
    this._isLoading.start();
    this._statusApi
      .loadAll()
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message || 'Erro ao carregar status.', 3000, 'center', 'bottom');
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
          this._isLoading.stop();
        },
      });
  }

  onEdit(status: iStatusResponse) {
    this.editStatus.emit(status);
    this.selectedStatus.set(status);
    this.formVisible.set(true);
  }

  handleFormSave() {
    this.formVisible.set(false);
    this.selectedStatus.set(null);
    this.onLoad();
  }
}
