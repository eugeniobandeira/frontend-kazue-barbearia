import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { createServiceFormControl } from '../../constants/service-form';
import { ServiceApi } from '../../apis/service.api';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { iServicePayload, iServiceResponse } from '../../interface/service.interface';
import { LoadingService } from '@/domain/auth/services/loading.service';
import { delay, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';

const MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, ButtonModule];

@Component({
  selector: 'app-service-form',
  imports: [...MODULES],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ServiceFormComponent implements OnChanges {
  private readonly _serviceApi = inject(ServiceApi);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);

  @Output() onSave = new EventEmitter<void>();
  @Input() serviceToEdit?: iServiceResponse | null;

  lista: any[] = [];

  public readonly serviceForm = createServiceFormControl();

  ngOnChanges(): void {
    if (this.serviceToEdit) {
      this.serviceForm.patchValue({
        code: this.serviceToEdit.code,
        description: this.serviceToEdit.description,
        price: this.serviceToEdit.price,
      });
    } else {
      this.serviceForm.reset();
    }
  }

  onSubmit(): void {
    this._isLoading.start();

    const { code, description, price } = this.serviceForm.getRawValue();

    const req: iServicePayload = {
      code,
      description,
      price,
    };

    const request$ = this.serviceToEdit ? this._serviceApi.update(this.serviceToEdit.id, req) : this._serviceApi.create(req);

    request$
      .pipe(
        delay(4000),
        finalize(() => this._isLoading.stop()),
        takeUntilDestroyed(this._destroy$)
      )
      .subscribe({
        next: data => {
          this.lista = [data];
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message, 3000, 'end', 'top');
          console.error('Error:', error);
        },
        complete: () => {
          const message = this.serviceToEdit ? 'Serviço atualizado com sucesso' : 'Serviço criado com sucesso';
          this._snackBarService.showSnackBar(message, 3000, 'end', 'top');
          this.serviceForm.reset();
          this.onSave.emit();
        },
      });
  }
}
