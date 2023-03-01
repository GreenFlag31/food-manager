import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { changedAnimation, fadeInOut } from '../animations';
import { AuthService } from '../login/auth.service';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [fadeInOut, changedAnimation],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private notifSub!: Subscription;
  isAuthenticated = false;
  @Input() notificationsNumber = 0;

  constructor(
    private authService: AuthService,
    private foodData: FoodDataService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user !== null;
      console.log(this.isAuthenticated);
    });

    this.notifSub = this.foodData.ObsArrayNotifications.subscribe(
      (nNotifications: number) => {
        this.notificationsNumber = nNotifications;
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.notifSub.unsubscribe();
  }
}
