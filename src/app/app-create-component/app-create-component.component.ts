import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FoodDataService } from '../food-data-service.service';
import { DatePipe } from '@angular/common';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-create-component',
  templateUrl: './app-create-component.component.html',
  styleUrls: ['./app-create-component.component.css'],
})
export class AppCreateComponentComponent implements OnInit {
  dateNextWeek = new Date();
  @Output() newItemAdded = new EventEmitter<foodObject>();

  constructor(private foodData: FoodDataService, private date: DatePipe) {}

  ngOnInit(): void {
    this.dateNextWeek = new Date(
      this.dateNextWeek.setDate(this.dateNextWeek.getDate() + 7)
    );
  }

  onSubmit(
    itemForm: NgForm,
    name: HTMLInputElement,
    bestBefore: HTMLInputElement
  ) {
    const values = itemForm.form.value;
    this.foodData.addItem(values).subscribe(() => {
      this.resetFields(name, bestBefore);
      this.newItemAdded.emit(itemForm.form.value);
    });
  }

  onCancel(name: HTMLInputElement, bestBefore: HTMLInputElement) {
    this.resetFields(name, bestBefore);
  }

  resetFields(name: HTMLInputElement, bestBefore: HTMLInputElement) {
    name.value = '';
    bestBefore.value = this.date.transform(this.dateNextWeek, 'yyyy-MM-dd')!;
    name.focus();
  }
}
