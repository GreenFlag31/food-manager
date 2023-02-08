import { Component, OnInit } from '@angular/core';
import { FoodDataService } from '../food-data-service.service';
import { foodObject, Icriteria } from '../IfoodObject';
import { fadeInOut, slidingApparition } from '../animations';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  animations: [fadeInOut, slidingApparition],
})
export class DataComponent implements OnInit {
  constructor(private foodData: FoodDataService) {}
  listItems: foodObject[] = this.foodData.listItems;
  error = false;
  isLoading = false;
  orderStatusName = 'ascending';
  orderStatusDate = 'ascending';
  criteria: Icriteria = this.foodData.criteria;

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.isLoading = true;
    this.foodData.fetchItems().subscribe({
      next: (items: foodObject[]) => {
        if (items.length === 0) {
          this.isLoading = false;
          return;
        }

        this.listItems = items;
        this.foodData.setDayLeftItems();
        this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  addItem(newItem: foodObject) {
    this.listItems.push(newItem);
    this.updateCentralListItems(this.listItems);
    this.foodData.setDayLeftItem(newItem);
    this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
  }

  onDeleteAll() {
    this.foodData.deleteItems().subscribe(() => {
      // add an alert confirm message
      this.listItems = [];
      this.updateCentralListItems(this.listItems);
    });
  }

  updateCentralListItems(list: foodObject[]) {
    this.foodData.listItems = list;
  }

  changeOrder(element: MouseEvent) {
    const name = (
      element.target as HTMLParagraphElement
    ).innerText.toLowerCase();
    let order = (element.target as HTMLParagraphElement).dataset['title']!;

    if (order.includes('ascending')) {
      order = 'descending';
    } else {
      order = 'ascending';
    }

    if (name === 'name') {
      this.orderStatusName = order;
    } else {
      this.orderStatusDate = order;
    }

    this.criteria.sortedBy = name;
    this.criteria.order = order;
    this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
  }

  getClassOf(order: string) {
    if (order === 'ascending') {
      return 'fa-solid fa-sort-up';
    } else {
      return 'fa-solid fa-sort-down';
    }
  }

  method(e: any) {
    console.log(e);
  }
}
