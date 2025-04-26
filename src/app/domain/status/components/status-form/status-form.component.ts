import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { iStatusRequest, iStatusResponse } from '../../interfaces/status.interface';
import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { StatusApi } from '../../apis/status.api';
import { createStatusFormControl } from '../../constants/status-form';

const MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, ButtonModule, MessageModule, ProgressSpinnerModule];

@Component({
  selector: 'app-status-form',
  imports: [...MODULES],
  standalone: true,
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusFormComponent {
  private readonly _statusApi = inject(StatusApi);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);

  @Output() onSave = new EventEmitter<void>();
  statusToEdit = input<iStatusResponse | null>(null);

  public readonly formState = signal({
    submitted: false,
    success: false,
    error: null as string | null,
  });

  public readonly isSubmitting = computed(() => this.formState().submitted);
  public readonly errorMessage = computed(() => this.formState().error);
  public readonly isEditMode = computed(() => !!this.statusToEdit());

  public readonly statusForm = createStatusFormControl();

  constructor() {
    effect(() => {
      const status = this.statusToEdit();
      if (status) {
        this.statusForm.patchValue({
          code: status.code,
          description: status.description,
          domain: status.domain,
        });
      } else {
        this.statusForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.statusForm.invalid || this.isSubmitting()) return;

    this.formState.update(state => ({
      ...state,
      submitted: true,
      error: null,
    }));

    this._isLoading.start();

    const formValue = this.statusForm.getRawValue();
    const req: iStatusRequest = {
      code: formValue.code,
      description: formValue.description,
      domain: formValue.domain,
    };

    const statusId = this.statusToEdit()?.id;
    const request$ = statusId ? this._statusApi.update(statusId, req) : this._statusApi.create(req);

    request$
      .pipe(
        finalize(() => {
          this._isLoading.stop();
          this.formState.update(state => ({
            ...state,
            submitted: false,
          }));
        }),
        takeUntilDestroyed(this._destroy$)
      )
      .subscribe({
        next: () => {
          this.formState.update(state => ({
            ...state,
            success: true,
          }));

          const message = this.isEditMode() ? 'Status atualizado com sucesso' : 'Status criado com sucesso';

          this._snackBarService.showSnackBar(message, 3000, 'center', 'bottom');
          this.statusForm.reset();
          this.onSave.emit();
        },
        error: error => {
          const errorMsg = error?.error?.message ?? 'Erro ao processar requisição';
          this.formState.update(state => ({
            ...state,
            error: errorMsg,
          }));
          this._snackBarService.showSnackBar(errorMsg, 3000, 'end', 'top');
        },
      });
  }
}
