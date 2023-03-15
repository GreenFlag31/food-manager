import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../login/auth.service';
import { selfPic } from '../shared/animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';

@Component({
  selector: 'app-change-item',
  templateUrl: './change-item.component.html',
  styleUrls: ['./change-item.component.css'],
  animations: [selfPic],
})
export class ChangeItemComponent {
  @Input() item!: foodObject;
  @Output() itemChanged = new EventEmitter();
  @Output() itemDeleted = new EventEmitter();
  @Input() confirmDeleteCount!: number;
  @Output() confirmDeleteCountChange = new EventEmitter<number>();
  url =
    'https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items';

  constructor(
    private foodData: FoodDataService,
    private authService: AuthService
  ) {}

  onChange(changeForm: NgForm) {
    const copiedItem = { ...this.item };
    const formValues = changeForm.form.value;

    this.authService.itemDeletedID = this.item.id!;
    this.foodData.patchItem(this.url, formValues).subscribe(() => {
      this.itemChanged.emit([copiedItem, formValues]);
    });
  }

  onDeleteItem() {
    // debugger;
    this.confirmDeleteCount += 1;
    this.confirmDeleteCountChange.emit(this.confirmDeleteCount);
    if (this.confirmDeleteCount < 2) return;

    this.authService.itemDeletedID = this.item.id!;

    this.foodData.deleteSingleItem(this.url).subscribe(() => {
      this.foodData.listItems.splice(this.item.itemId, 1);
      this.confirmDeleteCount = 0;
      this.foodData.setUniqueId();
      this.itemDeleted.emit();
    });
  }
}
