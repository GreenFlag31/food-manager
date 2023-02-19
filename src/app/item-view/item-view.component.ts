import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, interval, takeWhile } from 'rxjs';
import { changedAnimation } from '../animations';
import { FoodDataService } from '../food-data-service.service';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
  animations: [changedAnimation],
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

  constructor(
    private route: ActivatedRoute,
    private foodData: FoodDataService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.queryParamMap.get('id')) || 0;
    this.addDataIfDirectAccess();
    this.navigateTo(0);
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

      this.foodData.setDayLeftItems();
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
    this.item.dayLeft = this.foodData.setDayLeftItem(this.item);

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
      const totalDays = this.foodData.setDayLeftItem(this.item);
      this.countUp(totalDays);
      this.statusAnimation = !this.statusAnimation;
      this.ref.markForCheck();
    }, 500);
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
    if (!this.foodData.listItems.length) {
      return this.goBack();
    }
    this.navigateTo(this.id + 1);
  }

  goBack() {
    this.router.navigate(['my-list']);
  }
}
