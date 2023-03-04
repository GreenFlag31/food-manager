import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { FoodDataService } from '../shared/food-data-service.service';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.css'],
})
export class GettingStartedComponent implements OnInit {
  userIsConnected = false;
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private notification: NotificationsService,
    private foodData: FoodDataService
  ) {}

  ngOnInit() {
    this.userIsConnected = this.auth.user['_value'] !== null;

    this.route.data.subscribe((data) => {
      if (!data['items']) return;

      this.foodData.setDayLeftItems(this.notification.notificationsDays);
      this.notification.notificationSubject.next(
        this.notification.numberOfNotifications()
      );
    });
  }
}
