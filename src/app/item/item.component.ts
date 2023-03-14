import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { deleteSingle } from '../shared/animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [deleteSingle],
})
export class ItemComponent {
  @Input() item!: foodObject;
  @Output() itemDeleted = new EventEmitter();
  confirmDeleteSingle = 0;
  @Input() confirmDeleteCount!: number;

  constructor(
    private foodService: FoodDataService,
    private notification: NotificationsService,
    private authService: AuthService
  ) {}

  onDeleteItem() {
    this.confirmDeleteSingle += 1;
    if (this.confirmDeleteSingle < 2) return;

    this.authService.itemDeletedID = this.item.id!;
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items`;
    this.foodService.deleteSingleItem(url).subscribe(() => {
      this.foodService.listItems.splice(this.item.itemId, 1);
      this.foodService.setUniqueId();
      this.notification.updateListOfNotifiedItems(this.item.id!);
      this.confirmDeleteSingle = 0;
      this.itemDeleted.emit();
    });
  }
}
