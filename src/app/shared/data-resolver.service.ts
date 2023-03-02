import { LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { FoodDataService } from './food-data-service.service';
import { foodObject } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class DataResolverService implements Resolve<foodObject[]> {
  noRedirectTo = '/contact';

  constructor(
    private foodData: FoodDataService,
    private authService: AuthService,
    private router: Router,
    private url: LocationStrategy
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<foodObject[]> | any {
    if (!this.authService.user['_value']) return;

    // direct URL or interface access
    const redirection =
      state.url !== this.noRedirectTo && this.url.path() !== this.noRedirectTo;

    if (this.foodData.listItems.length) return of(this.foodData.listItems);

    return this.foodData.fetchItems().pipe(
      map((data) => {
        if (!data.length && redirection) {
          return this.router.navigate(['/my-list']);
        }
        return of(data);
      })
    );
  }
}
