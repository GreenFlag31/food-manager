import { Component, OnInit } from '@angular/core';
import { selfPic } from '../animations';
import { FoodDataService } from '../food-data-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [selfPic],
})
export class NotificationsComponent implements OnInit {
  notificationsDays = this.foodData.notificationsDays;
  nItemsToExpire!: number;
  constructor(private foodData: FoodDataService) {}

  ngOnInit(): void {}

  numberItemsToExpire(numberItems: number) {
    this.nItemsToExpire = numberItems;
    this.foodData.notificationsDays = this.notificationsDays;
    this.foodData.hasBeenNotified = this.nItemsToExpire;
    console.log(this.foodData.hasBeenNotified);
  }
}
