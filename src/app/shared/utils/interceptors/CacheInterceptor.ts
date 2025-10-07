import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<
    string,
    { data: any; etag: string; timestamp: number }
  >();
  private defaultExpirationTime = 10 * 60 * 1000; // 10 minutes

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    this.cleanupCache(); // Remove expired entries before intercepting

    const cachedEntry = this.cache.get(req.url);
    if (cachedEntry) {
      console.log('Cached');

      // Include the If-None-Match header in the request to check if the data has changed
      const clonedRequest = req.clone({
        setHeaders: { 'If-None-Match': cachedEntry.etag },
      });

      return next.handle(clonedRequest).pipe(
        tap((event) => {
          if (event instanceof HttpResponse && event.status === 304) {
            // The server indicates that the data has not changed (Not Modified)
            // Use the cached data
          } else if (event instanceof HttpResponse) {
            // The server has returned new data
            this.cache.set(req.url, {
              data: event.body,
              etag: event.headers.get('ETag') || '',
              timestamp: Date.now(),
            });
          }
        })
      );
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log('Hit');
          this.cache.set(req.url, {
            data: event.body,
            etag: event.headers.get('ETag') || '',
            timestamp: Date.now(),
          });
        }
      })
    );
  }

  private cleanupCache(): void {
    const now = Date.now();
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.defaultExpirationTime) {
        this.cache.delete(key); // Remove expired entry from the cache
      }
    });
  }
}
