import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';
import { iBarbershop } from '../interface/barbershop.interface';

@Injectable({
  providedIn: 'root',
})
export class BarbershopService {
  private readonly _API_URL = `${environment.apiUrl}/barbershop`;
  private readonly _http = inject(HttpClient);

  public barbershopStatus = signal<boolean>(false);
  public accessCode = signal<string>('');

  public open() {
    this.barbershopStatus.set(true);
  }

  public close() {
    this.barbershopStatus.set(false);
  }

  public setAccessCode(code: string) {
    this.accessCode.set(code);
  }

  public currentCode() {
    return this.accessCode();
  }

  public updateBarbershop(id: number) {
    return this._http.put<iBarbershop>(`${this._API_URL}/${id}`, {
      accessCode: this.currentCode(),
      isOpen: this.barbershopStatus(),
    });
  }

  public getBarbershop(id: number): Observable<iBarbershop> {
    return this._http.get<iBarbershop>(`${this._API_URL}/${id}`);
  }

  public barbershopInfo = computed(() => ({
    isOpen: this.barbershopStatus(),
    accessCode: this.accessCode(),
  }));

  public loadBarbershopData(id: number): Observable<iBarbershop> {
    return this._http.get<iBarbershop>(`${this._API_URL}/${id}`).pipe(
      tap(barbershop => {
        this.barbershopStatus.set(barbershop.isOpen);
        this.accessCode.set(barbershop.accessCode);
      })
    );
  }
}
