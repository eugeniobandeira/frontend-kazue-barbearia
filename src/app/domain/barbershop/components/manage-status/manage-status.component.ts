import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BarbershopService } from '../../services/barbershop.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

const MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, ButtonModule, CommonModule, DialogModule, DropdownModule];

@Component({
  selector: 'app-manage-status',
  imports: [...MODULES],
  templateUrl: './manage-status.component.html',
  styleUrls: ['./manage-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageStatusComponent implements OnInit {
  private readonly _barbershopService = inject(BarbershopService);

  public barbershopInfo = this._barbershopService.barbershopInfo;
  public isLoading = signal(true);

  ngOnInit(): void {
    this.loadBarbershopData();
  }

  private loadBarbershopData(): void {
    const barbershopId = 1;

    this._barbershopService.loadBarbershopData(barbershopId).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }
}
