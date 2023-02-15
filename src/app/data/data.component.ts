import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FoodDataService } from '../food-data-service.service';
import { foodObject, Icriteria } from '../IfoodObject';
import { fadeInOut, slidingApparition } from '../animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  animations: [fadeInOut, slidingApparition],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnInit {
  listItems: foodObject[] = this.foodData.listItems;
  error = false;
  isLoading = false;
  orderStatusName = 'ascending';
  orderStatusDate = 'ascending';
  criteria: Icriteria = this.foodData.criteria;
  currentPage!: number;
  itemsToDisplay: foodObject[] = [];
  itemsperPage = 3;
  totalPages: number = 0;

  constructor(
    private foodData: FoodDataService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
          this.addPaginationToUrl(true);
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
      complete: () => {
        this.ref.markForCheck();
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
    this.itemsToDisplay = this.paginate();
  }

  // trop de données - mettre dans un service - utiliser ngOnChanges pour détecter les changements ?
  onDelete() {
    this.updateItemsToDisplay();
    if (this.totalPages === 0) {
      this.addPaginationToUrl(true);
    }
  }

  onDeleteAll() {
    this.foodData.deleteItems().subscribe(() => {
      // add an alert confirm message
      this.listItems = [];
      this.itemsToDisplay = [];
      this.totalPages = 0;
      this.addPaginationToUrl(true);
      this.ref.markForCheck();
    });
  }

  updateCentralListItems(list: foodObject[]) {
    this.foodData.listItems = list;
  }

  changeOrder(element: MouseEvent) {
    if (this.foodData.listItems.length <= 1) return;

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
    this.itemsToDisplay = this.paginate();
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
    this.itemsToDisplay = this.paginate();
  }

  onNext(page: number) {
    this.currentPage = page + 1;
    this.itemsToDisplay = this.paginate();
  }

  onPrevious(page: number) {
    this.currentPage = page - 1;
    this.itemsToDisplay = this.paginate();
  }

  paginate(): foodObject[] {
    this.addPaginationToUrl();
    return [
      ...this.foodData.listItems
        .slice((this.currentPage - 1) * this.itemsperPage)
        .slice(0, this.itemsperPage),
    ];
  }

  addPaginationToUrl(noParam = false) {
    if (this.totalPages === 0 && !noParam) return;
    if (this.currentPage > this.totalPages && this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: noParam ? null : this.currentPage,
      },
    });
  }
}
