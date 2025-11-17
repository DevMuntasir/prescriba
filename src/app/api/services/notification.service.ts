import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { NotificationDto } from '../dto-models/models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getListByUserId(
    userId: number,
    role: string
  ): Observable<NotificationDto[]> {
    const params = new HttpParams().set('role', role);

    return this.http.get<NotificationDto[]>(
      `${this.baseUrl}/api/app/notification/by-user-id/${userId}`,
      { params }
    );
  }
}
