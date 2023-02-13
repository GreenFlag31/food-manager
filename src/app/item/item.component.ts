import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FoodDataService } from '../food-data-service.service';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [],
})
export class ItemComponent implements OnInit {
  @Input() item!: foodObject;
  @Output() itemDeleted = new EventEmitter();

  constructor(private foodService: FoodDataService) {}

  ngOnInit() {}

  onDeleteItem() {
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodService.deleteSingleItem(url, this.item).subscribe();
    this.itemDeleted.emit();
  }
}
