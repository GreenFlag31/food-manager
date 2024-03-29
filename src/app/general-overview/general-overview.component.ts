import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { deleteAll, fadeInOut, slidingApparition } from '../shared/animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { Criteria, foodObject } from '../shared/IfoodObject';
import { NotificationsService } from '../shared/notifications-service.service';
import { PaginationService } from '../shared/pagination-service.service';

@Component({
  selector: 'app-general-overview',
  templateUrl: './general-overview.component.html',
  styleUrls: ['./general-overview.component.css'],
  animations: [fadeInOut, slidingApparition, deleteAll],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralOverviewComponent implements OnInit, OnChanges {
  @Input() listItems: foodObject[] = this.foodData.listItems;
  error = false;
  isLoading = false;
  searchingItems: foodObject[] = [];
  @Input() searching = false;
  @Output() searchingChange = new EventEmitter<boolean>();
  orderStatusName = 'ascending';
  orderStatusDate = 'ascending';
  criteria: Criteria = this.foodData.criteria;
  @Output() choosenCriteria = new EventEmitter<Criteria>();
  @Input() totalPages = 0;
  @Input() itemsToDisplay: foodObject[] = [];
  @Output() LI = new EventEmitter<foodObject[]>();
  @Output() updateTP = new EventEmitter<number>();
  @Input() currentPage!: number;
  @Input() notificationsDays!: number;
  filteredItems!: foodObject[];
  @Output() itemsToExpire = new EventEmitter<number>(true);
  numberOfNotifications = 0;
  confirmDeleteSingle = 0;
  @Input() confirmDeleteCount!: number;
  @Output() confirmDeleteCountChange = new EventEmitter<number>();

  constructor(
    private foodData: FoodDataService,
    private pagination: PaginationService,
    private notification: NotificationsService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentPage =
      Number(this.route.snapshot.queryParamMap.get('page')) || 1;

    this.fetchItems();
  }

  fetchItems() {
    this.isLoading = true;
    this.foodData.fetchItems().subscribe({
      next: (items: foodObject[]) => {
        if (items.length === 0) {
          this.isLoading = false;
          this.listItems = [];
          this.pagination.addPaginationToUrl(true);
          return;
        }

        this.listItems = items;
        this.foodData.setDayLeftItems(this.notification.notificationsDays);
        this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
        this.isLoading = false;
        this.updateItemsToDisplay(this.notificationsDays);
        this.updateCentralListItems(this.listItems);
        this.setNotification();
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
        this.ref.markForCheck();
      },
      complete: () => {
        this.ref.markForCheck();
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['notificationsDays']?.currentValue >= 0) {
      this.updateItemsToDisplay(this.notificationsDays);
    }
  }

  setNotification() {
    const notifications = this.notification.filterAccordingToDaysBefore(
      this.notification.notificationsDays
    );
    this.numberOfNotifications =
      notifications.length - this.notification.hasBeenNotified;

    if (this.numberOfNotifications > 0) {
      this.notification.newItemUnderNotification = [...notifications];
    }
    this.notification.notificationSubject.next(this.numberOfNotifications);
  }

  updateItemsToDisplay(daysBefore = Infinity) {
    if (daysBefore < Infinity) {
      this.filteredItems =
        this.notification.filterAccordingToDaysBefore(daysBefore);
      this.foodData.setDayLeftItems(daysBefore);

      this.itemsToExpire.emit(this.filteredItems.length);
      if (this.filteredItems.length === 0) {
        this.pagination.addPaginationToUrl(true);
      }
    }

    this.totalPages = this.pagination.updateItemsToDisplay(this.filteredItems);
    // wrong page number in URL
    if (this.currentPage <= 0) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.itemsToDisplay = this.pagination.paginate(
      this.currentPage,
      this.filteredItems
    );
  }

  onCancel() {
    this.confirmDeleteCount = 0;
    this.confirmDeleteCountChange.emit(0);
  }

  onDelete(item: foodObject) {
    if (this.filteredItems?.length) {
      this.filteredItems.splice(item.itemId, 1);
      this.itemsToExpire.emit(this.filteredItems.length);
      this.notification.notificationSubject.next(this.filteredItems.length);
    } else {
      this.notification.notificationSubject.next(
        this.notification.newItemUnderNotification.length
      );
    }

    this.updateItemsToDisplay();
    this.updateTP.emit(this.totalPages);

    this.currentPage = this.pagination.currentPage;
    if (this.totalPages === 0) {
      this.pagination.addPaginationToUrl(true);
    }
  }

  updateCentralListItems(list: foodObject[]) {
    this.foodData.listItems = list;
    this.LI.emit(list);
  }

  changeOrder(element: MouseEvent) {
    if (this.itemsToDisplay.length <= 1) return;

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
    this.foodData.sortItems(
      this.criteria.sortedBy,
      this.criteria.order,
      this.filteredItems
    );
    this.choosenCriteria.emit(this.criteria);
    this.itemsToDisplay = this.pagination.paginate(
      this.currentPage,
      this.filteredItems
    );
  }

  getClassOf(order: string) {
    if (order === 'ascending') {
      return 'fa-solid fa-sort-up';
    } else {
      return 'fa-solid fa-sort-down';
    }
  }

  onSearch(term: string) {
    if (!this.listItems.length) return;

    const defaultItems = this.filteredItems || this.listItems;
    const items = this.foodData.getItemByName(term, defaultItems);
    if (items.length) {
      this.searchingItems = items;
      this.totalPages = this.pagination.updateItemsToDisplay(items);
      this.currentPage = 1;
      this.itemsToDisplay = this.pagination.paginate(this.currentPage, items);
      this.searching = true;
    } else if (!term.trim()) {
      this.currentPage = 1;
      this.totalPages = this.pagination.updateItemsToDisplay();
      this.itemsToDisplay = this.pagination.paginate(this.currentPage);
      this.searching = false;
    } else {
      this.itemsToDisplay = [];
      this.searching = false;
    }

    this.searchingChange.emit(this.searching);
  }

  onGoTo(page: number) {
    this.currentPage = page;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage, this.filteredItems);
  }

  onNext(page: number) {
    this.currentPage = page + 1;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage, this.filteredItems);
  }

  onPrevious(page: number) {
    this.currentPage = page - 1;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage, this.filteredItems);
  }
}
