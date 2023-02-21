import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInOut, slidingApparition } from '../animations';
import { FoodDataService } from '../food-data-service.service';
import { Criteria, foodObject } from '../IfoodObject';
import { PaginationService } from '../pagination-service.service';

@Component({
  selector: 'app-general-overview',
  templateUrl: './general-overview.component.html',
  styleUrls: ['./general-overview.component.css'],
  animations: [fadeInOut, slidingApparition],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralOverviewComponent implements OnInit {
  @Input() listItems: foodObject[] = this.foodData.listItems;
  error = false;
  isLoading = false;
  searchingItems: foodObject[] = [];
  @Input() searching = false;
  @Output() searchingChange = new EventEmitter<boolean>();
  orderStatusName = 'ascending';
  orderStatusDate = 'ascending';
  criteria: Criteria = this.foodData.criteria;
  @Output() choosenCriteria = new EventEmitter();
  @ViewChild('searchBox') searchBox!: ElementRef;
  @Input() totalPages: number = 0;
  @Input() itemsToDisplay: foodObject[] = [];
  @Output() LI = new EventEmitter();
  @Output() updateTP = new EventEmitter();
  currentPage!: number;

  constructor(
    private foodData: FoodDataService,
    private pagination: PaginationService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
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
        this.foodData.setDayLeftItems();
        this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
        this.isLoading = false;
        this.updateItemsToDisplay();
        this.updateCentralListItems(this.listItems);
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

  updateItemsToDisplay() {
    this.totalPages = this.pagination.updateItemsToDisplay();
    // wrong page number in URL
    if (this.currentPage <= 0) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.itemsToDisplay = this.pagination.paginate(this.currentPage);
  }

  onDelete() {
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
    this.foodData.sortItems(this.criteria.sortedBy, this.criteria.order);
    this.choosenCriteria.emit(this.criteria);
    this.itemsToDisplay = this.pagination.paginate(this.currentPage);
  }

  getClassOf(order: string) {
    if (order === 'ascending') {
      return 'fa-solid fa-sort-up';
    } else {
      return 'fa-solid fa-sort-down';
    }
  }

  onSearch(term: string) {
    const items = this.foodData.getItemByName(term);
    if (items.length) {
      this.searchingItems = items;
      this.totalPages = this.pagination.updateItemsToDisplay(items);
      this.currentPage = 1;
      this.itemsToDisplay = this.pagination.paginate(this.currentPage, items);
      // this.currentPage = Math.ceil(
      //   (items[0].itemId + 1) / this.pagination.itemsperPage
      // );

      this.searching = true;
    } else if (!term.trim()) {
      this.currentPage = 1;
      this.totalPages = this.pagination.updateItemsToDisplay();
      this.itemsToDisplay = this.pagination.paginate(this.currentPage);
      this.searching = false;
    } else {
      this.totalPages = this.pagination.updateItemsToDisplay();

      this.itemsToDisplay = [];
      this.searching = false;
    }

    this.searchingChange.emit(this.searching);
  }

  onGoTo(page: number) {
    this.currentPage = page;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage);
  }

  onNext(page: number) {
    this.currentPage = page + 1;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage);
  }

  onPrevious(page: number) {
    this.currentPage = page - 1;
    this.itemsToDisplay = this.searching
      ? this.pagination.paginate(this.currentPage, this.searchingItems)
      : this.pagination.paginate(this.currentPage);
  }
}
