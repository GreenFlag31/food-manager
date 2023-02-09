import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoodDataService } from './food-data-service.service';
import { foodObject } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class DataResolverService {
  constructor(private foodData: FoodDataService) {}

  resolve(): Observable<foodObject[]> | Promise<foodObject> | foodObject[] {
    if (this.foodData.listItems.length) return of(this.foodData.listItems);
    return this.foodData.fetchItems();
  }
}
