import { Component, Input, OnInit } from '@angular/core';
import { foodObject } from '../IfoodObject';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [],
})
export class ItemComponent implements OnInit {
  @Input() item!: foodObject;

  constructor() {}

  ngOnInit(): void {}

  onDeleteItem() {
    // delete single item
  }
}
