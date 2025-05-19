import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { iQueueGet, iQueueRequest, iQueueResponse, iQueueUpdateRequest } from '../interfaces/queue.interface';
import { Observable, tap } from 'rxjs';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class QueueApi {
  private readonly _API_URL = environment.apiUrl + '/queue';
  private readonly _httpClient = inject(HttpClient);

  public isLoading = signal(false);
  public queueList = signal<iQueueResponse[]>([]);
  public queueListByDate = signal<iQueueResponse[]>([]);

  public get(req: iQueueGet): Observable<iQueueResponse[]> {
    let params = new HttpParams();
    if (req.idCustomer) {
      params = params.set('idCustomer', req.idCustomer);
    }
    if (req.idBarber) {
      params = params.set('idBarber', req.idBarber);
    }

    params = params.set('page', req.page.toString()).set('pageSize', req.pageSize.toString());

    return this._httpClient.get<iQueueResponse[]>(this._API_URL, { params });
  }

  public getById(id: number): Observable<iQueueResponse> {
    return this._httpClient.get<iQueueResponse>(`${this._API_URL}/${id}`);
  }

  public getByDate(date: string): Observable<iApiResponse<iQueueResponse[]>> {
    return this._httpClient.get<iApiResponse<iQueueResponse[]>>(`${this._API_URL}/filter?date=${date}`).pipe(
      tap(response => {
        let filtered = response.response;

        if (filtered) {
          filtered = filtered.filter(item => item.status.description !== 'Finalizado');
        }

        this.queueListByDate.set(filtered);
        this.queueList.set(filtered);
      })
    );
  }

  public getHistory(date: string): Observable<iApiResponse<iQueueResponse[]>> {
    return this._httpClient.get<iApiResponse<iQueueResponse[]>>(`${this._API_URL}/filter?date=${date}`).pipe(
      tap(response => {
        let filtered = response.response;

        this.queueListByDate.set(filtered);
        this.queueList.set(filtered);
      })
    );
  }

  public create(req: iQueueRequest): Observable<iQueueResponse> {
    return this._httpClient.post<iQueueResponse>(this._API_URL, req).pipe(
      tap(newQueueItem => {
        this.queueListByDate.set([...this.queueListByDate(), newQueueItem]);
        this.queueList.set([...this.queueList(), newQueueItem]);
      })
    );
  }

  public update(id: number, req: iQueueUpdateRequest): Observable<iQueueResponse> {
    return this._httpClient.put<iQueueResponse>(`${this._API_URL}/${id}`, req).pipe(
      tap(updatedQueueItem => {
        const updatedQueue = this.queueListByDate().map(item => (item.id === id ? { ...item, ...updatedQueueItem } : item));
        this.queueListByDate.set(updatedQueue);

        const updatedGlobalQueue = this.queueList().map(item => (item.id === id ? { ...item, ...updatedQueueItem } : item));
        this.queueList.set(updatedGlobalQueue);
      })
    );
  }

  public delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this._API_URL}/${id}`).pipe(
      tap(() => {
        const updatedQueue = this.queueListByDate().filter(item => item.id !== id);
        this.queueListByDate.set(updatedQueue);
        const updatedGlobalQueue = this.queueList().filter(item => item.id !== id);
        this.queueList.set(updatedGlobalQueue);
      })
    );
  }
}
