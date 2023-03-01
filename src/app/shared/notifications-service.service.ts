import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FoodDataService } from './food-data-service.service';
import { foodObject } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  notificationsDays = 5;
  hasBeenNotified = 0;
  newItemUnderNotification: foodObject[] = [];
  notificationSubject = new Subject<number>();

  constructor(private foodData: FoodDataService) {}

  filterAccordingToDaysBefore(daysBefore: number): foodObject[] {
    return this.foodData.listItems.filter(
      (item) => item.dayLeft! <= daysBefore
    );
  }

  itemsToBeNotified(): foodObject[] {
    return this.filterAccordingToDaysBefore(this.notificationsDays);
  }

  numberOfNotifications(): number {
    return this.itemsToBeNotified().length - this.hasBeenNotified;
  }
}
