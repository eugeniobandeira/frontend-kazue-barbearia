import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { iStatusPayload, iStatusResponse } from '../../interfaces/status.interface';
import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs';
import { StatusApi } from '../../apis/status.api';
import { createStatusFormControl } from '../../constants/status-form';

const MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, ButtonModule];

@Component({
  selector: 'app-status-form',
  imports: [...MODULES],
  standalone: true,
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusFormComponent implements OnChanges {
  private readonly _statusApi = inject(StatusApi);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);

  @Output() onSave = new EventEmitter<void>();
  @Input() statusToEdit?: iStatusResponse | null;

  lista: any[] = [];

  public readonly statusForm = createStatusFormControl();

  ngOnChanges(): void {
    if (this.statusToEdit) {
      this.statusForm.patchValue({
        code: this.statusToEdit.code,
        description: this.statusToEdit.description,
        domain: this.statusToEdit.domain,
      });
    } else {
      this.statusForm.reset();
    }
  }

  onSubmit(): void {
    this._isLoading.start();

    const { code, description, domain } = this.statusForm.getRawValue();

    const req: iStatusPayload = {
      code,
      description,
      domain,
    };

    const request$ = this.statusToEdit ? this._statusApi.update(this.statusToEdit.id, req) : this._statusApi.create(req);

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
          const message = this.statusToEdit ? 'Status atualizado com sucesso' : 'Status criado com sucesso';
          this._snackBarService.showSnackBar(message, 3000, 'center', 'bottom');
          this.statusForm.reset();
          this.onSave.emit();
        },
      });
  }
}
