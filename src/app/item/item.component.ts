import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [],
})
export class ItemComponent implements OnInit {
  @Input() item!: foodObject;
  @Output() itemDeleted = new EventEmitter();

  constructor(
    private foodService: FoodDataService,
    private notification: NotificationsService
  ) {}

  ngOnInit() {}

  onDeleteItem() {
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodService.deleteSingleItem(url).subscribe(() => {
      this.foodService.listItems.splice(this.item.itemId, 1);
      this.foodService.setUniqueId();
      this.updateListOfNotifiedItems();
      this.itemDeleted.emit();
    });
  }

  updateListOfNotifiedItems() {
    const notifiedItems = this.notification.newItemUnderNotification;
    for (let i = 0; i < notifiedItems.length; i++) {
      if (notifiedItems[i].id === this.item.id) {
        notifiedItems.splice(i, 1);
        break;
      }
    }
  }
}
