import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { iServicePayload, iServiceResponse } from '../interface/service.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private readonly _http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/services';
  private readonly _serviceList = signal<iServiceResponse[]>([]);
  private readonly _loading = signal(false);

  public readonly serviceList = this._serviceList.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly serviceCount = computed(() => this._serviceList().length);

  public readonly serviceList$ = this._http.get<iApiResponse<iServiceResponse[]>>(this.API_URL);

  public readonly serviceListSignal = toSignal(this.serviceList$, {
    initialValue: { response: [], resultCount: 0, rowsCount: 0 } as iApiResponse<iServiceResponse[]>,
  });

  public get(): Observable<iApiResponse<iServiceResponse[]>> {
    this._loading.set(true);
    return this._http.get<iApiResponse<iServiceResponse[]>>(this.API_URL).pipe(
      tap({
        next: apiResponse => {
          this._serviceList.set(apiResponse?.response ?? []);
          this._loading.set(false);
        },
        error: () => {
          this._serviceList.set([]);
          this._loading.set(false);
        },
      })
    );
  }

  create(req: iServicePayload): Observable<iServiceResponse> {
    this._loading.set(true);
    return this._http.post<iServiceResponse>(this.API_URL, req).pipe(
      tap({
        next: newService => {
          this._serviceList.update(list => [...list, newService]);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      })
    );
  }

  update(id: number, req: iServicePayload): Observable<iServiceResponse> {
    this._loading.set(true);
    return this._http.put<iServiceResponse>(`${this.API_URL}/${id}`, req).pipe(
      tap({
        next: updatedService => {
          this._serviceList.update(list => list.map(item => (item.id === id ? updatedService : item)));
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      })
    );
  }

  delete(id: number): Observable<void> {
    this._loading.set(true);
    return this._http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap({
        next: () => {
          this._serviceList.update(list => list.filter(item => item.id !== id));
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      })
    );
  }
}
