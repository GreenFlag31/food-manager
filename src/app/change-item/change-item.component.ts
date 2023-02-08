import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private foodData: FoodDataService) {}

  ngOnInit(): void {}

  onChange(form: NgForm) {
    console.log(form.form.value);
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodData.patchItem(url, form.form.value).subscribe();
  }

  onDeleteItem() {
    const url = `https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items/${this.item.id}.json`;
    this.foodData.deleteSingleItem(url).subscribe();
  }
}
