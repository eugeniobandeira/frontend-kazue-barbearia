import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs';
import { createQueueFormControl } from '../../constants/queue-form';
import { QueueApi } from '../../apis/queue.api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthService } from '@/core/services/auth.service';
import { UserApi } from '@/domain/user/apis/user.api';
import { ServiceApi } from '@/domain/service/apis/service.api';
import { Router, RouterModule } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { BarbershopService } from '@/domain/barbershop/services/barbershop.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  DropdownModule,
  MultiSelectModule,
  InputTextModule,
  ButtonModule,
  RouterModule,
  InputNumberModule,
  CommonModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-queue-form',
  imports: [...MODULES],
  templateUrl: './queue-form.component.html',
  styleUrl: './queue-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class QueueFormComponent implements OnInit {
  private readonly _queueApi = inject(QueueApi);
  private readonly _userApi = inject(UserApi);
  private readonly _serviceApi = inject(ServiceApi);
  private readonly _authService = inject(AuthService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly _barbershopService = inject(BarbershopService);

  @Output() onSave = new EventEmitter<void>();

  user = this._authService.getUser();

  public barberList = signal<any[]>([]);
  public serviceList = signal<any[]>([]);
  public loadingBarbers = signal(false);
  public loadingServices = signal(false);
  public barbershopInfo = this._barbershopService.barbershopInfo;
  public showPinError = signal(false);
  public isShopClosed = signal(false);
  public isLoadingData = signal(true);

  public readonly queueForm = createQueueFormControl();

  ngOnInit() {
    this.loadBarbershopData();
    this.setupFormListeners();
    this.loadInitialData();
  }

  private loadBarbershopData(): void {
    this._barbershopService.loadBarbershopData(1).subscribe({
      next: () => {
        this.isShopClosed.set(!this.barbershopInfo().isOpen);
        if (this.isShopClosed()) {
          this.queueForm.disable();
        }
        this.isLoadingData.set(false);
      },
      error: () => {
        this.isLoadingData.set(false);
        this._snackBarService.showSnackBar('Erro ao carregar dados da barbearia', 3000, 'center', 'bottom');
      },
    });
  }

  private setupFormListeners(): void {
    this.queueForm.get('validationCode')?.valueChanges.subscribe(() => {
      this.checkPinValidity();
    });

    this.queueForm.get('idServices')?.valueChanges.subscribe(services => {
      const total = Array.isArray(services) ? this.calculateTotal(services) : 0;
      this.queueForm.get('amount')?.setValue(total, { emitEvent: false });
    });
  }

  private calculateTotal(services: any[]): number {
    const selectedIds = services.map(id => id.toString());
    return this.serviceList()
      .filter(service => selectedIds.includes(service.id.toString()))
      .reduce((sum, service) => sum + service.price, 0);
  }

  private checkPinValidity(): void {
    const pin = this.queueForm.getRawValue().validationCode;
    const code = this.barbershopInfo().accessCode;
    this.showPinError.set(pin !== '' && pin !== code);
  }

  isOk(): boolean {
    const code = this.barbershopInfo().accessCode;
    const status = this.barbershopInfo().isOpen;
    const pin = this.queueForm.getRawValue().validationCode;
    return code === pin && status === true;
  }

  private loadInitialData() {
    this.loadBarbers();
    this.loadServices();
  }

  private loadBarbers(): void {
    this.loadingBarbers.set(true);
    this._userApi
      .getBarberList()
      .pipe(
        takeUntilDestroyed(this._destroy$),
        finalize(() => this.loadingBarbers.set(false))
      )
      .subscribe({
        next: barbers => this.barberList.set(barbers),
        error: error => this.showError('Erro ao carregar barbeiros', error),
      });
  }

  private loadServices(): void {
    this.loadingServices.set(true);
    this._serviceApi
      .get()
      .pipe(
        takeUntilDestroyed(this._destroy$),
        finalize(() => this.loadingServices.set(false))
      )
      .subscribe({
        next: response => this.serviceList.set(response.response || []),
        error: error => this.showError('Erro ao carregar serviços', error),
      });
  }

  private showError(defaultMessage: string, error: any): void {
    this._snackBarService.showSnackBar(error?.error?.message ?? defaultMessage, 3000, 'center', 'bottom');
  }

  onSubmit(): void {
    if (this.queueForm.invalid) return;

    this._isLoading.start();
    const { idBarber, amount, idServices } = this.queueForm.getRawValue();

    this._queueApi
      .create({
        idCustomer: this.user?.id.toString() ?? '',
        idBarber,
        amount,
        idServices: idServices.map((id: number | string) => id.toString()),
      })
      .pipe(
        delay(4000),
        finalize(() => this._isLoading.stop()),
        takeUntilDestroyed(this._destroy$)
      )
      .subscribe({
        next: () => this.handleSuccess(),
        error: error => this.handleError(error),
      });
  }

  private handleSuccess(): void {
    this._snackBarService.showSnackBar('Você foi adicionado na fila com sucesso.', 3000, 'center', 'bottom');
    this.queueForm.reset();
    this.onSave.emit();
    this.router.navigate(['/home']);
  }

  private handleError(error: any): void {
    this._snackBarService.showSnackBar(error?.error?.message ?? 'Erro ao processar solicitação', 3000, 'center', 'bottom');
    console.error('Error:', error);
  }
}
