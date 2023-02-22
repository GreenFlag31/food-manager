import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FoodDataService } from '../food-data-service.service';
import { Criteria, foodObject } from '../IfoodObject';
import { PaginationService } from '../pagination-service.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnInit {
  listItems: foodObject[] = this.foodData.listItems;
  itemsToDisplay: foodObject[] = [];
  currentPage!: number;
  totalPages!: number;
  criteria: Criteria = this.foodData.criteria;
  searchInProgress = false;
  notificationsNumber!: number;

  constructor(
    private foodData: FoodDataService,
    private pagination: PaginationService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  addItem(newItem: foodObject) {
    // for apparition animation but not changing page if foodData.listItems is []
    this.foodData.listItems.push(newItem);
    this.listItems = this.foodData.listItems;

    this.foodData.setDayLeftItem(newItem);
    this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);

    this.totalPages = Math.ceil(
      this.foodData.listItems.length / this.pagination.itemsperPage
    );

    if (this.searchInProgress) {
      this.currentPage = 1;
      this.searchInProgress = false;
    } else {
      this.currentPage = this.pagination.currentPage;
    }
    this.pagination.totalPages = this.totalPages;
    this.itemsToDisplay = this.pagination.paginate(this.currentPage);
  }

  updateNotifications(notifications: number) {
    this.notificationsNumber = notifications;
  }

  updateCriteria(criteria: Criteria) {
    this.criteria = criteria;
  }

  updateTotalPages(total: number) {
    this.totalPages = total;
  }

  updateLI(list: foodObject[]) {
    this.listItems = list;
  }

  onDeleteAll() {
    this.foodData.deleteItems().subscribe(() => {
      // add an alert confirm message
      this.listItems = [];
      this.itemsToDisplay = [];
      this.totalPages = 0;
      this.pagination.addPaginationToUrl(true);
      this.ref.markForCheck();
    });
  }
}
