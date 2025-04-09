import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { iStatusGet, iStatusPayload, iStatusResponse } from '../interfaces/status.interface';
import { Observable } from 'rxjs';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusApi {
  private readonly API_URL = environment.apiUrl + '/status';
  private readonly _httpClient = inject(HttpClient);

  create(req: iStatusPayload): Observable<iStatusResponse> {
    return this._httpClient.post<iStatusResponse>(this.API_URL, req);
  }

  update(id: number, req: iStatusPayload): Observable<iStatusResponse> {
    return this._httpClient.put<iStatusResponse>(`${this.API_URL}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/${id}`);
  }

  get(req: iStatusGet): Observable<iApiResponse<iStatusResponse>> {
    let params: HttpParams = new HttpParams();

    if (req.code) {
      params = params.set('code', req.code);
    }

    if (req.description) {
      params = params.set('description', req.description);
    }

    params = params.set('Page', req.page.toString()).set('PageSize', req.pageSize.toString());
    return this._httpClient.get<iApiResponse<iStatusResponse>>(this.API_URL, { params });
  }
}
