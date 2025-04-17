import { ChangeDetectionStrategy, Component, computed, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ServiceApi } from '../../apis/service.api';
import { TableModule } from 'primeng/table';
import { iServiceResponse } from '../../interface/service.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const MODULES = [TableModule, CommonModule, ButtonModule, TooltipModule, ProgressSpinnerModule];

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
  private readonly _destroy$ = inject(DestroyRef);

  selectedService = signal<iServiceResponse | null>(null);
  formVisible = signal(false);

  public serviceList = signal<iServiceResponse[]>([]);

  public loading = this._serviceApi.loading;

  @Output() editService = new EventEmitter<iServiceResponse>();

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad(): void {
    this._serviceApi
      .get()
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: response => {
          this.serviceList.set(response.response);
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message ?? 'Erro ao carregar serviços.', 3000, 'end', 'top');
        },
      });
  }

  onDelete(service: iServiceResponse) {
    this._serviceApi
      .delete(service.id)
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe({
        next: () => {
          this._snackBarService.showSnackBar('Serviço excluído com sucesso.', 3000, 'start', 'top');
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message ?? 'Erro ao excluir serviço.', 3000, 'end', 'top');
        },
      });
  }

  onEdit(service: iServiceResponse) {
    this.editService.emit(service);
    this.selectedService.set(service);
    this.formVisible.set(true);
  }

  handleFormSave() {
    this.formVisible.set(false);
    this.selectedService.set(null);
    this.onLoad();
  }
}
