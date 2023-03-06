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
  itemToDelete!: string;
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        this.itemToDelete = this.authService.itemDeletedID;
        const clonedReq = req.clone({
          url:
            req.url +
            `/${user.id}${
              this.itemToDelete ? `/${this.itemToDelete}.json` : '.json'
            }`,
          params: new HttpParams().set('auth', user.token!),
        });
        this.authService.itemDeletedID = '';
        return next.handle(clonedReq);
      })
    );
  }
}
