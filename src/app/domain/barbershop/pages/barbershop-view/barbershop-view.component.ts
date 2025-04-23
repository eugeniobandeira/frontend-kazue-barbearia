import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManageStatusComponent } from '../../components/manage-status/manage-status.component';
import { ManageStatusFormComponent } from '../../components/manage-status-form/manage-status-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { QueueManagerComponent } from '../../components/queue-manager/queue-manager.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [ManageStatusComponent, ManageStatusFormComponent, QueueManagerComponent];

const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  CommonModule,
  DialogModule,
  DropdownModule,
  RouterModule,
];

@Component({
  selector: 'app-barbershop-view',
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './barbershop-view.component.html',
  styleUrl: './barbershop-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopViewComponent {
  public displayDialog: boolean = false;

  showDialog() {
    this.displayDialog = true;
  }
}
