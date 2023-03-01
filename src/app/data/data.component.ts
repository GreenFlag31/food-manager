import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FoodDataService } from '../shared/food-data-service.service';
import { Criteria, foodObject } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';
import { PaginationService } from '../shared/pagination-service.service';

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
  notificationsNumber = 0;
  dateError = false;

  constructor(
    private foodData: FoodDataService,
    private pagination: PaginationService,
    private notification: NotificationsService,
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

    // debugger;
    if (this.searchInProgress) {
      this.currentPage = 1;
      this.searchInProgress = false;
    } else if (this.totalPages === 1) {
      this.currentPage = 1;
    } else {
      this.currentPage = this.pagination.currentPage;
    }
    this.pagination.totalPages = this.totalPages;
    this.itemsToDisplay = this.pagination.paginate(this.currentPage);

    if (newItem.dayLeft! <= this.notification.notificationsDays) {
      this.notification.newItemUnderNotification.push(newItem);

      this.notification.notificationSubject.next(
        this.notification.newItemUnderNotification.length
      );
    }
  }

  updateCriteria(criteria: Criteria) {
    this.criteria = criteria;
  }

  updateTotalPages(total: number) {
    this.totalPages = total;
    if (this.totalPages === 0) this.currentPage = 0;
  }

  updateLI(list: foodObject[]) {
    this.listItems = list;
  }

  onDeleteAll() {
    this.foodData.deleteItems().subscribe(() => {
      // add an alert confirm message
      this.listItems = [];
      this.foodData.listItems = [];
      this.itemsToDisplay = [];
      this.notification.newItemUnderNotification = [];
      this.notification.notificationSubject.next(0);
      this.notificationsNumber = 0;
      this.totalPages = 0;
      this.pagination.addPaginationToUrl(true);
      this.ref.markForCheck();
    });
  }
}
