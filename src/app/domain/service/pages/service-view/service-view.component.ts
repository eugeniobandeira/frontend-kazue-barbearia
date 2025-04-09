import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { ServiceFormComponent } from '../../components/service-form/service-form.component';
import { ServiceListComponent } from '../../components/service-list/service-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ServiceApi } from '../../apis/service.api';
import { iServiceResponse } from '../../interface/service.interface';

const COMPONENTS = [ServiceFormComponent, ServiceListComponent];
const MODULES = [RouterModule, CommonModule, DialogModule, DynamicDialogModule, ButtonModule];

@Component({
  selector: 'app-service-view',
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './service-view.component.html',
  styleUrl: './service-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ServiceViewComponent {
  @ViewChild(ServiceListComponent) serviceList!: ServiceListComponent;

  visible: boolean = false;
  selectedService: iServiceResponse | null = null;

  private readonly _serviceApi = inject(ServiceApi);

  showDialog() {
    this.selectedService = null;
    this.visible = true;
  }

  handleEdit(service: iServiceResponse) {
    this.selectedService = service;
    this.visible = true;
  }

  handleSave() {
    this.visible = false;
    this.selectedService = null;
    this.serviceList.onLoad();
  }
}
