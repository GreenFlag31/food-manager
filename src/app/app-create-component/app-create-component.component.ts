import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { FoodDataService } from '../shared/food-data-service.service';
import { DatePipe } from '@angular/common';
import { foodObject } from '../shared/IfoodObject';
import { selfPic } from '../animations';

@Component({
  selector: 'app-create-component',
  templateUrl: './app-create-component.component.html',
  styleUrls: ['./app-create-component.component.css'],
  animations: [selfPic],
})
export class AppCreateComponent implements OnInit {
  dateNextWeek = new Date();
  currentDate = new Date();
  dateNextWeekStringified!: string;
  dateError = false;
  @Output() newItemAdded = new EventEmitter<foodObject>();
  @Output() wrongDate = new EventEmitter<boolean>();

  constructor(
    private foodData: FoodDataService,
    private date: DatePipe,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dateNextWeek = new Date(
      this.dateNextWeek.setDate(this.dateNextWeek.getDate() + 7)
    );
    this.dateNextWeekStringified = this.date.transform(
      this.dateNextWeek,
      'yyyy-MM-dd'
    )!;
  }

  onCreateItem(
    itemForm: NgForm,
    name: HTMLInputElement,
    bestBefore: HTMLInputElement
  ) {
    const values = itemForm.form.value;
    if (!this.foodData.checkValidDate(values.bestBefore)) {
      this.dateError = true;
      bestBefore.blur();
      bestBefore.focus();
      return;
    }

    this.foodData.addItem(values).subscribe((res) => {
      this.dateError = false;
      values.id = res.name;
      this.resetFields(name);
      this.newItemAdded.emit(values);
    });
  }

  onCancel(name: HTMLInputElement) {
    this.resetFields(name);
  }

  resetFields(name: HTMLInputElement) {
    name.value = '';
    this.dateNextWeekStringified = this.date.transform(
      this.dateNextWeek,
      'yyyy-MM-dd'
    )!;
    name.focus();
  }
}
