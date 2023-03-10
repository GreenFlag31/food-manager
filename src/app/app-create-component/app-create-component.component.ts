import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FoodDataService } from '../shared/food-data-service.service';
import { foodObject } from '../shared/IfoodObject';
import { selfPic } from '../shared/animations';
import { DateValidator } from '../shared/date-validator.directive';

@Component({
  selector: 'app-create-component',
  templateUrl: './app-create-component.component.html',
  styleUrls: ['./app-create-component.component.css'],
  animations: [selfPic],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCreateComponent implements OnInit {
  initialName = '';
  @Output() newItemAdded = new EventEmitter<foodObject>();
  @ViewChild('name') name!: ElementRef;
  initialForm!: FormGroup;

  constructor(private foodData: FoodDataService) {}

  ngOnInit() {
    this.initialForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      bestBefore: new FormControl(this.foodData.dateNextWeekToString(), [
        Validators.required,
        DateValidator(),
      ]),
    });
  }

  get bestBefore() {
    return this.initialForm.get('bestBefore');
  }

  onCreateItem() {
    const values = this.initialForm.value;
    this.foodData.addItem(values).subscribe((res) => {
      values.id = res.name;
      this.resetFields();
      this.newItemAdded.emit(values);
    });
  }

  onCancel() {
    this.resetFields();
  }

  resetFields() {
    this.initialForm.patchValue({
      name: '',
      bestBefore: this.foodData.dateNextWeekToString(),
    });
    this.name.nativeElement.focus();
  }
}
