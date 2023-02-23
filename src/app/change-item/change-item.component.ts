import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FoodDataService } from '../food-data-service.service';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-change-item',
  templateUrl: './change-item.component.html',
  styleUrls: ['./change-item.component.css'],
})
export class ChangeItemComponent implements OnInit {
  @Input() item!: foodObject;
  @Output() itemChanged = new EventEmitter();
  @Output() itemDeleted = new EventEmitter();

  constructor(private foodData: FoodDataService) {}

  ngOnInit(): void {}

  onChange(form: NgForm) {
    const copiedItem = { ...this.item };
    const formValues = form.form.value;
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodData.patchItem(url, formValues).subscribe();
    this.itemChanged.emit([copiedItem, formValues]);
  }

  onDeleteItem() {
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodData.deleteSingleItem(url).subscribe({
      complete: () => {
        this.foodData.listItems.splice(this.item.itemId, 1);
        this.foodData.setUniqueId();
        this.itemDeleted.emit();
      },
    });
  }
}
