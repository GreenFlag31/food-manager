import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        clearTimeout(this.authService.tokenExpirationTimer);
        this.authService.keepLogedIn(true);

        const clonedReq = req.clone({
          url: req.url + `/${user.id}.json`,
          params: new HttpParams().set('auth', user.token!),
        });
        return next.handle(clonedReq);
      })
    );
  }
}
