import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { AuthResponseData } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endPoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  APIKEY = 'AIzaSyCWOoL3J-yVKEdd2zsplS1zxYPrwBFbWuk';
  errorMessagesTypes: any = {
    EMAIL_EXISTS: 'This email already exists',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Try again later',
    EMAIL_NOT_FOUND: 'No user found with provided address',
    INVALID_PASSWORD: 'Invalid email or password',
  };
  ErrorResponseMessage!: string;
  user = new BehaviorSubject<User | null>(null);
  tokenExpirationTimer!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationsService
  ) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.endPoint + this.APIKEY, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  signIn(email: string, password: string) {
    const endPoint = this.endPoint.replace('signUp', 'signInWithPassword');
    return this.http
      .post<AuthResponseData>(endPoint + this.APIKEY, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationsDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationsDate);
    this.user.next(user);
    this.logOutInactivity(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  keepLogedIn() {
    const userData: User = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;

    const currentUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (currentUser.token) {
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.logOutInactivity(expirationDuration);
      this.user.next(currentUser);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    this.ErrorResponseMessage =
      this.errorMessagesTypes[errorRes.error.error.message];
    return throwError(() => this.ErrorResponseMessage);
  }

  logOutInactivity(expirationDuration: number) {
    this.tokenExpirationTimer = window.setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  logOut() {
    this.user.next(null);
    this.notificationService.notificationSubject.next(0);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
    clearTimeout(this.tokenExpirationTimer);
  }
}
