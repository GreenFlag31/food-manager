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
  currentPage = 1;
  itemsToDisplay: foodObject[] = [];
  itemsperPage = 3;
  totalPages: number = 0;

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
        this.updateItemsToDisplay();
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
    this.updateItemsToDisplay();
  }

  updateItemsToDisplay() {
    this.totalPages = Math.ceil(
      this.foodData.listItems.length / this.itemsperPage
    );
    this.itemsToDisplay = this.paginate(this.currentPage, this.itemsperPage);
  }

  onDelete() {
    this.updateItemsToDisplay();
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

  onGoTo(page: number) {
    this.currentPage = page;
    this.itemsToDisplay = this.paginate(this.currentPage, this.itemsperPage);
  }

  onNext(page: number) {
    this.currentPage = page + 1;
    this.itemsToDisplay = this.paginate(this.currentPage, this.itemsperPage);
  }

  onPrevious(page: number) {
    this.currentPage = page - 1;
    this.itemsToDisplay = this.paginate(this.currentPage, this.itemsperPage);
  }

  paginate(currentPage: number, itemsperPage: number): foodObject[] {
    return [
      ...this.foodData.listItems
        .slice((currentPage - 1) * itemsperPage)
        .slice(0, itemsperPage),
    ];
  }
}
