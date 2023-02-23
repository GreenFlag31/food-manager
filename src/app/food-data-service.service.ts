import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { foodObject, Criteria } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class FoodDataService implements OnInit {
  listItems: foodObject[] = [];
  currentDate!: string | Date;
  compute!: number;
  url =
    'https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/items.json';
  criteria: Criteria = {
    sortedBy: 'date',
    order: 'ascending',
  };
  notificationsDays = 5;
  hasBeenNotified = 0;
  newItemUnderNotification: foodObject[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  fetchItems(): Observable<foodObject[]> {
    return this.http.get<foodObject>(this.url).pipe(
      map((response) => {
        if (response === null) {
          return (this.listItems = []);
        }
        this.listItems = Object.entries(response).map(([id, item]) => {
          return { ...item, id };
        });
        return this.listItems;
      })
    );
  }

  addItem(form: foodObject): Observable<foodObject> {
    return this.http.post<foodObject>(this.url, form);
  }

  deleteItems() {
    this.listItems = [];
    return this.http.delete(this.url);
  }

  deleteSingleItem(endpoint: string) {
    return this.http.delete(endpoint);
  }

  patchItem(endpoint: string, body: { name: string; bestBefore: string }) {
    return this.http.patch(endpoint, body);
  }

  setDayLeftItems(notificationsDays = 7): foodObject[] {
    for (const item of this.listItems) {
      this.setDayLeftItem(item, notificationsDays);
    }
    return this.listItems;
  }

  setDayLeftItem(item: foodObject, notificationsDays = 7) {
    this.currentDate = new Date();
    this.compute = Math.ceil(
      (+new Date(item.bestBefore) - +this.currentDate) / 1000 / 3600 / 24
    );
    if (this.compute <= notificationsDays) {
      item.class = 'priority-1';
    } else if (this.compute <= notificationsDays + 3) {
      item.class = 'priority-2';
    } else {
      item.class = '';
    }
    item.dayLeft = this.compute;
    return item.dayLeft;
  }

  filterAccordingToDaysBefore(daysBefore: number): foodObject[] {
    return this.listItems.filter((item) => item.dayLeft! <= daysBefore);
  }

  sortItems(type: string, order: string, defaultItems = this.listItems) {
    if (type === 'name') {
      defaultItems.sort((item1, item2) => {
        const nameA = item1.name.toLowerCase();
        const nameB = item2.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }
    if (type === 'date') {
      defaultItems.sort(
        (item1, item2) => <number>item1.dayLeft - <number>item2.dayLeft
      );
    }

    if (order === 'descending') {
      defaultItems.reverse();
    }

    this.setUniqueId();
    this.lowerNames();
  }

  setUniqueId() {
    for (let i = 0; i < this.listItems.length; i++) {
      this.listItems[i].itemId = i;
    }
  }

  lowerNames() {
    for (const item of this.listItems) {
      item.name = item.name.toLowerCase();
    }
  }

  getItem(id: number): any {
    if (this.listItems.length) {
      const item = this.listItems.find((item) => item.itemId === id)!;
      return item;
    }
  }

  getItemByName(term: string, defaultItems: foodObject[]) {
    term = term.toLowerCase().trim();
    if (!term || !defaultItems.length) {
      return [];
    }

    return defaultItems.filter(
      (item) => item.name.toLowerCase().trim() === term
    )!;
  }
}
