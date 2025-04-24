import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { iUser, iUserCreateRequest, iUserGet, iUserProfileResponse, iUserRegisteredResponse, iUserShortResponse, iUserUpdate } from '../interfaces/user.interface';
import { iChangePassword } from '@/domain/auth/interfaces/request/change-password.interface';
import { map, Observable, tap } from 'rxjs';
import { eRoles } from '@/shared/enums/roles.enum';
import { iApiResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly API_URL = environment.apiUrl + '/users';
  private readonly _httpClient = inject(HttpClient);

  public barberList = signal<iUserShortResponse[]>([]);

  getBarberList(): Observable<iUserShortResponse[]> {
    return this._httpClient.get<iApiResponse<iUserShortResponse[]>>(`${this.API_URL}/roles/${eRoles.ADMIN}`).pipe(
      map(response => response.response),
      tap(barbers => this.barberList.set(barbers))
    );
  }

  public create(req: iUserCreateRequest): Observable<iUserRegisteredResponse> {
    return this._httpClient.post<iUserRegisteredResponse>(this.API_URL, req);
  }

  public getById(id: number): Observable<iUserRegisteredResponse> {
    return this._httpClient.get<iUserRegisteredResponse>(`${this.API_URL}/${id}`);
  }

  public get(req: iUserGet): Observable<iUserShortResponse[]> {
    let params = new HttpParams().set('page', req.page.toString()).set('pageSize', req.pageSize.toString());

    return this._httpClient.get<iUserShortResponse[]>(this.API_URL, { params });
  }

  public getAllUsers(req: iUserGet): Observable<iApiResponse<iUser[]>> {
    let params = new HttpParams().set('page', req.page.toString()).set('pageSize', req.pageSize.toString());

    if (req.idStatus) params = params.set('idStatus', req.idStatus);
    if (req.fullname) params = params.set('fullname', req.fullname);
    if (req.nickname) params = params.set('nickname', req.nickname);
    if (req.username) params = params.set('username', req.username);
    if (req.phone) params = params.set('phone', req.phone);

    return this._httpClient.get<iApiResponse<iUser[]>>(`${this.API_URL}`, { params }).pipe(map(response => response));
  }

  public update(id: string, req: iUserUpdate): Observable<iUserProfileResponse> {
    return this._httpClient.put<iUserProfileResponse>(`${this.API_URL}/${id}`, req);
  }

  public updateStatus(id: string, idStatus: number): Observable<iUserShortResponse> {
    return this._httpClient.put<iUserShortResponse>(`${this.API_URL}/${id}/status`, idStatus);
  }

  public delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/${id}`);
  }

  public changePassword(req: iChangePassword): Observable<void> {
    return this._httpClient.put<void>(`${this.API_URL}/change-password`, req);
  }
}
