import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SplashScreenService } from './splash-screen.service';

@Injectable()
export class SplashInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: SplashScreenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('caught');
    this.totalRequests++;
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          setTimeout(() => {
            this.loadingService.setLoading(false);
          }, 1000);
        }
      })
    );
  }
}
