import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { selfPic } from '../animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';

@Component({
  selector: 'app-change-item',
  templateUrl: './change-item.component.html',
  styleUrls: ['./change-item.component.css'],
  animations: [selfPic],
})
export class ChangeItemComponent implements OnInit {
  @Input() item!: foodObject;
  @Output() itemChanged = new EventEmitter();
  @Output() itemDeleted = new EventEmitter();
  dateError = false;

  constructor(private foodData: FoodDataService) {}

  ngOnInit(): void {}

  onChange(form: NgForm, bestBefore: HTMLInputElement) {
    const copiedItem = { ...this.item };
    const formValues = form.form.value;

    if (!this.foodData.checkValidDate(formValues.bestBefore)) {
      this.dateError = true;
      bestBefore.blur();
      bestBefore.focus();
      return;
    }

    const url = this.targetUrl();
    this.foodData.patchItem(url, formValues).subscribe(() => {
      this.dateError = false;
      this.itemChanged.emit([copiedItem, formValues]);
    });
  }

  onDeleteItem() {
    const url = this.targetUrl();
    this.foodData.deleteSingleItem(url).subscribe(() => {
      this.foodData.listItems.splice(this.item.itemId, 1);
      this.foodData.setUniqueId();
      this.itemDeleted.emit();
    });
  }

  targetUrl(): string {
    return `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
  }
}
