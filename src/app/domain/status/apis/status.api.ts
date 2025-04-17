import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { iStatusRequest, iStatusResponse } from '../interfaces/status.interface';
import { Observable, tap } from 'rxjs';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusApi {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiUrl + '/status';

  public statusList = signal<iStatusResponse[]>([]);
  public isLoading = signal(false);
  public statusCount = computed(() => this.statusList().length);

  public loadAll(): Observable<iApiResponse<iStatusResponse[]>> {
    this.isLoading.set(true);
    return this._http.get<iApiResponse<iStatusResponse[]>>(this._apiUrl).pipe(
      tap({
        next: response => {
          this.statusList.set(response.response || []);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      })
    );
  }

  public create(status: iStatusRequest): Observable<iStatusResponse> {
    this.isLoading.set(true);
    return this._http.post<iStatusResponse>(this._apiUrl, status).pipe(
      tap({
        next: newStatus => {
          this.statusList.update(list => [...list, newStatus]);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      })
    );
  }

  public update(id: number, status: iStatusRequest): Observable<iStatusResponse> {
    this.isLoading.set(true);
    return this._http.put<iStatusResponse>(`${this._apiUrl}/${id}`, status).pipe(
      tap({
        next: updatedStatus => {
          this.statusList.update(list => list.map(item => (item.id === id ? updatedStatus : item)));
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      })
    );
  }

  public delete(id: number): Observable<void> {
    this.isLoading.set(true);
    return this._http.delete<void>(`${this._apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.statusList.update(list => list.filter(item => item.id !== id));
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      })
    );
  }

  public getById(id: number): iStatusResponse | undefined {
    return this.statusList().find(status => status.id === id);
  }
}
