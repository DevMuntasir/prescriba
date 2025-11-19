import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken')
    ? JSON.parse(localStorage.getItem('accessToken') ?? '{}')
    : null;

  if (req.body instanceof FormData) {
    const clonedReq = req.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return next(clonedReq);
  }

  let headers: any = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const clonedReq = req.clone({ setHeaders: headers });

  return next(clonedReq);
};
