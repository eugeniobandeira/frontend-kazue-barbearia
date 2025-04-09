import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';
import { iServiceApiResponse, iServiceGet, iServicePayload, iServiceResponse } from '../interface/service.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private readonly API_URL = environment.apiUrl + '/services';
  private readonly _httpClient = inject(HttpClient);

  public isLoading = signal(false);
  public serviceList = signal<iServiceResponse[]>([]);

  public get(req: iServiceGet): Observable<iServiceApiResponse> {
    let params: HttpParams = new HttpParams();

    if (req.code) {
      params = params.set('code', req.code);
    }

    if (req.description) {
      params = params.set('description', req.description);
    }

    params = params.set('Page', req.page.toString()).set('PageSize', req.pageSize.toString());
    return this._httpClient.get<iServiceApiResponse>(this.API_URL, { params });
  }

  public getById(id: number): Observable<iServiceResponse> {
    return this._httpClient.get<iServiceResponse>(`${this.API_URL}/${id}`);
  }

  public create(req: iServicePayload): Observable<iServiceResponse> {
    return this._httpClient.post<iServiceResponse>(this.API_URL, req);
  }

  public update(id: number, req: iServicePayload): Observable<iServiceResponse> {
    return this._httpClient.put<iServiceResponse>(`${this.API_URL}/${id}`, req);
  }

  public delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/${id}`);
  }
}
