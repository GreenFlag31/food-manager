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
import { fadeInOut, slidingApparition } from '../animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { Criteria, foodObject } from '../shared/IfoodObject';
import { PaginationService } from '../shared/pagination-service.service';

@Component({
  selector: 'app-general-overview',
  templateUrl: './general-overview.component.html',
  styleUrls: ['./general-overview.component.css'],
  animations: [fadeInOut, slidingApparition],
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
  @Output() notificationsNumber = new EventEmitter<number>();
  numberOfNotifications = 0;

  constructor(
    private foodData: FoodDataService,
    private pagination: PaginationService,
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
          this.pagination.addPaginationToUrl(true);
          return;
        }

        this.listItems = items;
        this.foodData.setDayLeftItems(this.notificationsDays);
        this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
        this.isLoading = false;
        this.updateItemsToDisplay(this.notificationsDays);
        this.updateCentralListItems(this.listItems);
        this.setNotification();
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
      complete: () => {
        this.ref.markForCheck();
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['notificationsDays']?.currentValue) {
      this.updateItemsToDisplay(this.notificationsDays);
    }
  }

  setNotification() {
    const notifications = this.foodData.filterAccordingToDaysBefore(
      this.foodData.notificationsDays
    );
    this.numberOfNotifications =
      notifications.length - this.foodData.hasBeenNotified;

    if (this.numberOfNotifications > 0) {
      this.foodData.newItemUnderNotification = [...notifications];
    }
    this.notificationsNumber.emit(this.numberOfNotifications);
  }

  updateItemsToDisplay(daysBefore = Infinity) {
    if (daysBefore < Infinity) {
      this.filteredItems =
        this.foodData.filterAccordingToDaysBefore(daysBefore);
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

  onDelete(item: foodObject) {
    if (this.filteredItems?.length) {
      this.filteredItems.splice(item.itemId, 1);
      this.itemsToExpire.emit(this.filteredItems.length);
      this.foodData.ObsArrayNotifications.next(this.filteredItems.length);
    }

    this.updateItemsToDisplay();
    this.updateTP.emit(this.totalPages);
    this.notificationsNumber.emit(
      this.foodData.newItemUnderNotification.length
    );

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
    // debugger;
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
      // this.totalPages = this.pagination.updateItemsToDisplay();
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
