import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken')
      ? JSON.parse(localStorage.getItem('accessToken') ?? '{}')
      : null;

    if (req.body instanceof FormData) {
      const clonedReq = req.clone({
        setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return next.handle(clonedReq);
    }

    let headers: any = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const clonedReq = req.clone({ setHeaders: headers });

    return next.handle(clonedReq);
  }
}
