import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { iQueueGet, iQueueRequest, iQueueResponse } from '../interfaces/queue.interface';
import { Observable, tap } from 'rxjs';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class QueueApi {
  private readonly API_URL = environment.apiUrl + '/queue';
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

    return this._httpClient.get<iQueueResponse[]>(this.API_URL, {
      params,
    });
  }

  public getById(id: number): Observable<iQueueResponse> {
    return this._httpClient.get<iQueueResponse>(`${this.API_URL}/${id}`);
  }

  public getByDate(date: string): Observable<iApiResponse<iQueueResponse[]>> {
    return this._httpClient.get<iApiResponse<iQueueResponse[]>>(`${this.API_URL}/filter?date=${date}`).pipe(
      tap(response => {
        this.queueListByDate.set(response.response);
      })
    );
  }

  public create(req: iQueueRequest): Observable<iQueueResponse> {
    return this._httpClient.post<iQueueResponse>(this.API_URL, req);
  }

  public update(id: number, req: iQueueRequest): Observable<iQueueResponse> {
    return this._httpClient.put<iQueueResponse>(`${this.API_URL}/${id}`, req);
  }

  public delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/${id}`);
  }
}
