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

  onSubmit(form: NgForm) {
    // this.foodData.updateItem(this.item.id, form);
  }

  onDeleteItem() {
    // this.foodData.deleteItem(this.item.id);
  }
}
