import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  opacityTransition,
  fadeInOut,
  loginTransition,
  slidingApparition,
} from '../shared/animations';
import { AuthService } from '../login/auth.service';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    fadeInOut,
    opacityTransition,
    loginTransition,
    slidingApparition,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private notifSub!: Subscription;
  isAuthenticated = false;
  notificationsNumber = 0;

  constructor(
    private authService: AuthService,
    private notification: NotificationsService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user !== null;
    });

    this.notifSub = this.notification.notificationSubject.subscribe(
      (nNotifications: number) => {
        this.notificationsNumber = nNotifications;
      }
    );
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.notifSub.unsubscribe();
  }
}
