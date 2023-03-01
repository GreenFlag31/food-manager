import { Component, OnInit } from '@angular/core';
import { itemsToExpire } from '../shared/animations';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [itemsToExpire],
})
export class NotificationsComponent implements OnInit {
  notificationsDays = this.notification.notificationsDays;
  nItemsToExpire!: number;
  animate = true;
  constructor(private notification: NotificationsService) {}

  ngOnInit() {
    this.notification.newItemUnderNotification = [];
    this.toggleAnimation();
  }

  numberItemsToExpire(numberItems: number) {
    if (this.nItemsToExpire !== numberItems) {
      this.toggleAnimation();
    }
    this.nItemsToExpire = numberItems;
    this.notification.notificationsDays = this.notificationsDays;
    this.notification.hasBeenNotified = this.nItemsToExpire;
  }

  toggleAnimation() {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 100);
  }
}
