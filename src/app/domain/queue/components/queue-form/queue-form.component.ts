import { LoadingService } from '@/domain/auth/services/loading.service';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs';
import { createQueueFormControl } from '../../constants/queue-form';
import { iQueueResponse, iQueueRequest } from '../../interfaces/queue.interface';
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

const MODULES = [FormsModule, ReactiveFormsModule, DropdownModule, MultiSelectModule, InputTextModule, ButtonModule, RouterModule, InputNumberModule];

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
  @Input() queueToEdit?: iQueueResponse | null;

  user = this._authService.getUser();
  validationCode: string = '';
  lista: any = [];

  public barberList = signal<any[]>([]);
  public serviceList = signal<any[]>([]);
  public loadingBarbers = signal(false);
  public loadingServices = signal(false);
  public barbershopInfo = this._barbershopService.barbershopInfo;

  public readonly queueForm = createQueueFormControl();

  ngOnInit() {
    this._barbershopService.loadBarbershopData(1).subscribe();

    this.queueForm.get('idServices')?.valueChanges.subscribe(services => {
      if (Array.isArray(services)) {
        const selectedIds = services.map(id => id.toString());

        const total = this.serviceList()
          .filter(service => selectedIds.includes(service.id.toString()))
          .reduce((sum, service) => sum + service.price, 0);

        this.queueForm.get('amount')?.setValue(total, { emitEvent: false });
      } else {
        this.queueForm.get('amount')?.setValue(0, { emitEvent: false });
      }
    });

    this.loadInitialData();
  }

  isOk(): boolean {
    const code = this.barbershopInfo().accessCode;
    const status = this.barbershopInfo().isOpen;

    const pin = this.queueForm.getRawValue().validationCode;

    return code === pin && status === true;
  }

  onLoadBarbers(): void {
    this.loadingBarbers.set(true);
    this._userApi
      .getBarberList()
      .pipe(
        takeUntilDestroyed(this._destroy$),
        finalize(() => this.loadingBarbers.set(false))
      )
      .subscribe({
        next: barbers => {
          this.barberList.set(barbers);
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message ?? 'Erro ao carregar barbeiros.', 3000, 'end', 'top');
        },
      });
  }

  onLoadServices(): void {
    this.loadingServices.set(true);
    this._serviceApi
      .get()
      .pipe(
        takeUntilDestroyed(this._destroy$),
        finalize(() => this.loadingServices.set(false))
      )
      .subscribe({
        next: response => {
          this.serviceList.set(response.response || []);
        },
        error: error => {
          this._snackBarService.showSnackBar(error?.error?.message ?? 'Erro ao carregar serviços.', 3000, 'end', 'top');
        },
      });
  }

  private loadInitialData() {
    this.onLoadBarbers();
    this.onLoadServices();
  }

  onSubmit(): void {
    this._isLoading.start();

    const { idBarber, amount, idServices } = this.queueForm.getRawValue();

    const req: iQueueRequest = {
      idCustomer: this.user?.id.toString() ?? '',
      idBarber,
      amount,
      idServices: idServices.map((id: number | string) => id.toString()),
    };

    this._queueApi
      .create(req)
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
          const message = 'Você foi adicionado na fila com sucesso.';
          this._snackBarService.showSnackBar(message, 3000, 'end', 'top');
          this.queueForm.reset();
          this.onSave.emit();
          this.router.navigate(['/home']);
        },
      });
  }
}
