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

// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpClient,
// } from '@angular/common/http';
// import { Injectable, Injector } from '@angular/core';
// import { Observable, throwError, from, of } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private injector: Injector, private router: Router) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('access');

//     // Step 1: Skip verification if request is for verify or refresh
//     if (
//       req.url.includes('/api/app/auth/verify-access-token') ||
//       req.url.includes('/api/app/auth/refresh-token')
//     ) {
//       return next.handle(req);
//     }

//     if (!token) {
//       return next.handle(req);
//     }

//     const http = this.injector.get(HttpClient);

//     return this.verifyAccessToken(http, token).pipe(
//       switchMap((isValid) => {
//         if (!isValid) {
//           return this.refreshToken(http).pipe(
//             switchMap((newToken) => {
//               const clonedReq = this.addToken(req, newToken);
//               return next.handle(clonedReq);
//             }),
//             catchError((error) => {
//               this.logout();
//               return throwError(() => error);
//             })
//           );
//         } else {
//           const clonedReq = this.addToken(req, token);
//           return next.handle(clonedReq);
//         }
//       }),
//       catchError((error) => {
//         return throwError(() => error);
//       })
//     );
//   }

//   private addToken(req: HttpRequest<any>, token: string) {
//     const headers: any = {
//       Accept: 'application/json',
//       Authorization: `Bearer ${token}`,
//     };

//     if (req.body instanceof FormData) {
//       // FormData এর জন্য শুধু Authorization পাঠাবো
//       return req.clone({
//         setHeaders: { Authorization: `Bearer ${token}` },
//       });
//     }

//     return req.clone({ setHeaders: headers });
//   }

//   private verifyAccessToken(
//     http: HttpClient,
//     token: string
//   ): Observable<boolean> {
//     return http
//       .post<{ results: boolean }>(
//         'https://authentication.soowgoodbeta.com/api/app/auth/verify-access-token',
//         { accessToken: token }
//       )
//       .pipe(
//         switchMap((response) => {
//           return of(response?.results);
//         }),
//         catchError(() => {
//           return of(false);
//         })
//       );
//   }

//   private refreshToken(http: HttpClient): Observable<string> {
//     const refreshToken = localStorage.getItem('refreshToken') || '';

//     return http
//       .post<any>(
//         'https://authentication.soowgoodbeta.com/api/app/auth/refresh-token',
//         { refreshToken: refreshToken }
//       )
//       .pipe(
//         switchMap((response) => {
//           const newAccessToken = response.results?.accessToken;
//           const newRefreshToken = response.results?.refreshToken;

//           if (newAccessToken) {
//             localStorage.setItem('access', newAccessToken);
//           }
//           if (newRefreshToken) {
//             localStorage.setItem('refreshToken', newRefreshToken);
//           }

//           return of(newAccessToken);
//         })
//       );
//   }

//   private logout() {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refreshToken');
//     this.router.navigate(['/login']); // তোমার লগইন রাউট
//   }
// }
