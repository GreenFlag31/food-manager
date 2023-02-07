import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodDataService } from '../food-data-service.service';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
})
export class ItemViewComponent implements OnInit {
  item!: foodObject;
  id!: number;
  pageNo = 0;
  snapshotPageNo = 0;
  // criteria: Icriteria = this.foodData.criteria;

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
    this.foodData.getItem(id).subscribe((item: foodObject) => {
      this.item = item;
    });
  }

  changeItem(n: number) {
    this.getItem(this.id + n);
  }

  goBack() {
    this.location.back();
  }
}
