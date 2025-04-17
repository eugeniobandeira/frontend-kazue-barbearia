import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { createAccessCodeFormControl } from '../../constants/access-code-form';
import { BarbershopService } from '../../services/barbershop.service';
import { SnackBarService } from '@/shared/services/snackbar.service';

const MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, ButtonModule, CommonModule, DialogModule, DropdownModule];

@Component({
  selector: 'app-manage-status-form',
  imports: [...MODULES],
  templateUrl: './manage-status-form.component.html',
  styleUrl: './manage-status-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ManageStatusFormComponent {
  @Output() formCancel = new EventEmitter<void>();

  public readonly accessCodeForm = createAccessCodeFormControl();
  private readonly barbershopService = inject(BarbershopService);
  private readonly snackBarService = inject(SnackBarService);

  statusOptions = [
    { label: 'Aberto', value: true },
    { label: 'Fechado', value: false },
  ];

  onSubmit() {
    if (this.accessCodeForm.invalid) {
      this.snackBarService.showSnackBar('Por favor, preencha o formulário corretamente', 3000, 'center', 'bottom');
      return;
    }

    const { accessCode, isOpen } = this.accessCodeForm.getRawValue();

    this.barbershopService.setAccessCode(accessCode);
    isOpen ? this.barbershopService.open() : this.barbershopService.close();

    this.barbershopService.updateBarbershop(1).subscribe({
      next: () => {
        this.snackBarService.showSnackBar('Status atualizado com sucesso!', 3000, 'center', 'bottom');
        this.formCancel.emit();
      },
      error: err => {
        console.error('Erro ao atualizar status:', err);
        this.snackBarService.showSnackBar('Erro ao atualizar status.', 3000, 'center', 'bottom');
      },
    });
  }

  onCancel() {
    this.formCancel.emit();
  }
}
