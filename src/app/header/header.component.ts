import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import {
  fadeInOut,
  slidingApparition,
  goingToRight,
} from '../shared/animations';
import { AuthService } from '../login/auth.service';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [fadeInOut, slidingApparition, goingToRight],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private notifSub!: Subscription;
  isAuthenticated = false;
  notificationsNumber = 0;
  open = false;
  notResponsiveMode = window.innerWidth > 700;

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

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.notResponsiveMode = window.innerWidth > 700;
        this.open = false;
      });
  }

  toggleMenu() {
    this.open = !this.open;
  }

  unExpandNavigationMenu() {
    this.open = false;
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.notifSub.unsubscribe();
  }
}
