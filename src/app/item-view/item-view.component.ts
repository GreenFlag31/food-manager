import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, interval, takeWhile } from 'rxjs';
import { opacityTransition } from '../shared/animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
  animations: [opacityTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemViewComponent implements OnInit {
  item!: foodObject;
  id!: number;
  statusAnimation = false;
  changedName = false;
  changedDate = false;
  enableCountUp = true;
  listItems: foodObject[] = [];
  notificationsNumber = 0;

  constructor(
    private route: ActivatedRoute,
    private foodData: FoodDataService,
    private router: Router,
    private notification: NotificationsService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.queryParamMap.get('id')) || 0;
    this.addDataIfDirectAccess();
    this.navigateTo(0);
    this.setNotification();
  }

  setNotification() {
    // if direct URL
    this.notification.newItemUnderNotification =
      this.notification.itemsToBeNotified();
    this.notificationsNumber =
      this.notification.newItemUnderNotification.length -
      this.notification.hasBeenNotified;
    if (this.notificationsNumber === 0) {
      this.notification.newItemUnderNotification = [];
    }
    this.notification.notificationSubject.next(this.notificationsNumber);
  }

  addDataIfDirectAccess() {
    this.route.data.subscribe(() => {
      // keeping criteria set by user
      if (
        this.foodData.criteria.sortedBy !== 'date' ||
        this.foodData.criteria.order !== 'ascending' ||
        this.foodData.listItems[0].dayLeft
      ) {
        this.listItems = this.foodData.listItems;
        return;
      }

      this.foodData.setDayLeftItems(this.notification.notificationsDays);
      this.foodData.sortItems(
        this.foodData.criteria.sortedBy,
        this.foodData.criteria.order
      );
      this.listItems = this.foodData.listItems;
    });
  }

  getItem(id: number) {
    this.item =
      this.foodData.listItems.find((item) => item.itemId === id) ||
      this.foodData.listItems[0];

    // if animation stopped by changing item, recompute
    this.item.dayLeft = this.foodData.setDayLeftItem(
      this.item,
      this.notification.notificationsDays
    );

    this.id = this.foodData.listItems.indexOf(this.item);
  }

  navigateTo(n: number) {
    if (!this.foodData.listItems.length) {
      return this.goBack();
    }

    this.enableCountUp = false;
    this.correctIdUrl(this.id + n);
    this.getItem(this.id);

    this.router.navigate(['my-list/item'], {
      queryParams: {
        name: this.item.name,
        bestBefore: this.item.bestBefore,
        id: this.id,
      },
    });
  }

  correctIdUrl(navigateIndex: number) {
    if (navigateIndex >= this.foodData.listItems.length) {
      this.id = 0;
    } else if (navigateIndex < 0) {
      this.id = this.foodData.listItems.length - 1;
    } else {
      this.id = navigateIndex;
    }
  }

  statusChanged(copiedItem: foodObject[]) {
    this.changedName = copiedItem[0].name !== copiedItem[1].name;
    this.changedDate = copiedItem[0].bestBefore !== copiedItem[1].bestBefore;
    this.statusAnimation = !this.statusAnimation;

    setTimeout(() => {
      this.item.name = copiedItem[1].name;
      this.item.bestBefore = copiedItem[1].bestBefore;
      const totalDays = this.foodData.setDayLeftItem(
        this.item,
        this.notification.notificationsDays
      );

      this.changeNotification(copiedItem[0]);
      this.countUp(totalDays);
      this.statusAnimation = !this.statusAnimation;
      this.ref.markForCheck();
    }, 500);
  }

  changeNotification(itemBeforeChange: foodObject) {
    const [index, hasBeenNotified] = this.checkIfNotified();
    // no notification if previous already under notification
    if (
      itemBeforeChange.dayLeft! >= this.notification.notificationsDays &&
      this.item.dayLeft! <= this.notification.notificationsDays &&
      !hasBeenNotified
    ) {
      // this.notificationsNumber++;
      this.notification.newItemUnderNotification.push(this.item);
      this.notification.notificationSubject.next(
        this.notification.newItemUnderNotification.length
      );
    } else if (
      this.item.dayLeft! > this.notification.notificationsDays &&
      hasBeenNotified
    ) {
      // this.notificationsNumber--;
      this.notification.newItemUnderNotification.splice(index, 1);
      this.notification.notificationSubject.next(
        this.notification.newItemUnderNotification.length
      );
    }
  }

  checkIfNotified(): [number, boolean] {
    let index = 0;
    for (
      let i = 0;
      i < this.notification.newItemUnderNotification.length;
      i++
    ) {
      index = i;
      if (this.item.id === this.notification.newItemUnderNotification[i].id) {
        return [index, true];
      }
    }

    return [index, false];
  }

  countUp(totalDays: number) {
    this.enableCountUp = true;
    const refreshRate = interval(totalDays >= 20 ? 50 : 100);

    this.item.dayLeft = 0;
    const daysSub = refreshRate.pipe(
      delay(300),
      takeWhile((value) => value < totalDays && this.enableCountUp)
    );

    daysSub.subscribe(() => {
      this.item.dayLeft!++;
      this.ref.markForCheck();
    });
  }

  itemDeleted() {
    const [index, notified] = this.checkIfNotified();
    if (notified) {
      this.notification.newItemUnderNotification.splice(index, 1);
      this.notification.notificationSubject.next(
        this.notification.newItemUnderNotification.length
      );
    }
    if (!this.foodData.listItems.length) {
      return this.goBack();
    }
    this.navigateTo(this.id + 1);
  }

  goBack() {
    this.router.navigate(['my-list']);
  }
}
