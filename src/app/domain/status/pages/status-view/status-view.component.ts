import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { iStatusResponse } from '../../interfaces/status.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { StatusApi } from '../../apis/status.api';
import { StatusFormComponent } from '../../components/status-form/status-form.component';
import { StatusListComponent } from '../../components/status-list/status-list.component';

const COMPONENTS = [StatusFormComponent, StatusListComponent];
const MODULES = [RouterModule, CommonModule, DialogModule, DynamicDialogModule, ButtonModule];

@Component({
  selector: 'app-status-view',
  imports: [...COMPONENTS, ...MODULES],
  standalone: true,
  templateUrl: './status-view.component.html',
  styleUrl: './status-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusViewComponent {
  @ViewChild(StatusListComponent) statusList!: StatusListComponent;

  visible: boolean = false;
  selectedStatus: iStatusResponse | null = null;

  private readonly _statusApi = inject(StatusApi);

  showDialog() {
    this.selectedStatus = null;
    this.visible = true;
  }

  handleEdit(service: iStatusResponse) {
    this.selectedStatus = service;
    this.visible = true;
  }

  handleSave() {
    this.visible = false;
    this.selectedStatus = null;
    this.statusList.onLoad();
  }
}
