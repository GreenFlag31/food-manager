import { Location } from '@angular/common';
import { Component, ENVIRONMENT_INITIALIZER, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { changedAnimation } from '../animations';
import { FoodDataService } from '../food-data-service.service';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
  animations: [changedAnimation],
})
export class ItemViewComponent implements OnInit {
  item!: foodObject;
  id!: number;
  statusAnimation = false;
  changedName = false;
  changedDate = false;
  pageNo = 0;
  snapshotPageNo = 0;

  constructor(
    private route: ActivatedRoute,
    private foodData: FoodDataService,
    private location: Location
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.queryParamMap.get('id')) || 0;
    this.getItem(this.id);

    return;
    this.snapshotPageNo = +this.route.snapshot.queryParamMap.get('id')! || 0;

    this.route.queryParamMap.subscribe((params) => {
      this.pageNo = +params.get('id')! || 0;
      console.log('Query params ', this.pageNo);
    });
  }

  getItem(id: number) {
    this.route.data.subscribe(({ items }) => {
      if (this.foodData.listItems.length) return;
      this.foodData.listItems = items;
      this.foodData.setDayLeftItems();
      this.foodData.sortItems(
        this.foodData.criteria.sortedBy,
        this.foodData.criteria.order
      );
      this.item =
        this.foodData.listItems.find((item) => item.itemId === id) ||
        this.foodData.listItems[0];
    });
  }

  changeItem(n: number) {
    this.getItem(this.id + n);
  }

  goBack() {
    this.location.back();
  }

  statusChanged(copiedItem: foodObject[]) {
    this.changedName = copiedItem[0].name !== copiedItem[1].name;
    this.changedDate = copiedItem[0].bestBefore !== copiedItem[1].bestBefore;
    this.statusAnimation = !this.statusAnimation;

    setTimeout(() => {
      this.item.name = copiedItem[1].name;
      this.item.bestBefore = copiedItem[1].bestBefore;
      this.statusAnimation = !this.statusAnimation;
    }, 700);
  }
}
