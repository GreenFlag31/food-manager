import { Component, OnInit } from '@angular/core';
import { itemsToExpire } from '../animations';
import { FoodDataService } from '../shared/food-data-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [itemsToExpire],
})
export class NotificationsComponent implements OnInit {
  notificationsDays = this.foodData.notificationsDays;
  nItemsToExpire!: number;
  animate = true;
  constructor(private foodData: FoodDataService) {}

  ngOnInit() {
    this.foodData.newItemUnderNotification = [];
    this.toggleAnimation();
  }

  numberItemsToExpire(numberItems: number) {
    if (this.nItemsToExpire !== numberItems) {
      this.toggleAnimation();
    }
    this.nItemsToExpire = numberItems;
    this.foodData.notificationsDays = this.notificationsDays;
    this.foodData.hasBeenNotified = this.nItemsToExpire;
  }

  toggleAnimation() {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 100);
  }
}
