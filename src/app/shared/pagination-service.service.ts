import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodDataService } from './food-data-service.service';
import { foodObject } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentPage = 1;
  itemsperPage = 5;
  totalPages = 1;
  maxPages = 6;

  constructor(
    private foodData: FoodDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateItemsToDisplay(items = this.foodData.listItems) {
    return (this.totalPages = Math.ceil(items.length / this.itemsperPage));
  }

  paginate(
    currentPage: number,
    defaultItems = this.foodData.listItems
  ): foodObject[] {
    this.currentPage = currentPage;
    this.addPaginationToUrl();
    return [
      ...defaultItems
        .slice((this.currentPage - 1) * this.itemsperPage)
        .slice(0, this.itemsperPage),
    ];
  }

  addPaginationToUrl(noParam = false) {
    if (this.totalPages === 0 && !noParam) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: noParam ? null : this.currentPage,
      },
    });
  }

  getPages(current: number, total: number): (number | string)[] {
    if (total <= this.maxPages) {
      return [...Array(total).keys()].map((x) => ++x);
    }

    if (current > 4) {
      if (current >= total - 3) {
        return [1, '...', total - 3, total - 2, total - 1, total];
      } else {
        return [1, '...', current, current + 1, '...', total];
      }
    }

    return [1, 2, 3, 4, '...', total];
  }
}
