import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodDataService } from './food-data-service.service';
import { foodObject } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentPage!: number;
  itemsperPage = 3;
  totalPages: number = 1;

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
    // if (this.currentPage > this.totalPages && this.totalPages) {
    //   this.currentPage = this.totalPages;
    // }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: noParam ? null : this.currentPage,
      },
    });
  }
}
