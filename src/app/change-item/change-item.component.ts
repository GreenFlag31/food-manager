import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../login/auth.service';
import { selfPic } from '../shared/animations';
import { DateValidator } from '../shared/date-validator.directive';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';

@Component({
  selector: 'app-change-item',
  templateUrl: './change-item.component.html',
  styleUrls: ['./change-item.component.css'],
  animations: [selfPic],
})
export class ChangeItemComponent implements OnInit {
  changeForm!: FormGroup;
  @Input() item!: foodObject;
  @Output() itemChanged = new EventEmitter();
  @Output() itemDeleted = new EventEmitter();
  url =
    'https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items';

  constructor(
    private foodData: FoodDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.changeForm = new FormGroup({
      name: new FormControl(this.item.name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      bestBefore: new FormControl(this.item.bestBefore, [
        Validators.required,
        DateValidator(),
      ]),
    });
  }

  get bestBefore() {
    return this.changeForm.get('bestBefore');
  }

  onChange() {
    const copiedItem = { ...this.item };
    const formValues = this.changeForm.value;

    this.authService.itemDeletedID = this.item.id!;
    this.foodData.patchItem(this.url, formValues).subscribe(() => {
      this.itemChanged.emit([copiedItem, formValues]);
    });
  }

  onDeleteItem() {
    this.authService.itemDeletedID = this.item.id!;

    this.foodData.deleteSingleItem(this.url).subscribe(() => {
      this.foodData.listItems.splice(this.item.itemId, 1);
      this.foodData.setUniqueId();
      this.itemDeleted.emit();
    });
  }
}
