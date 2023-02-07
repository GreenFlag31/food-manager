import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Observable, of, Subscription } from 'rxjs';
import { foodObject, Icriteria } from './IfoodObject';

@Injectable({
  providedIn: 'root',
})
export class FoodDataService implements OnInit {
  listItems: foodObject[] = [];
  currentDate!: string | Date;
  compute!: number;
  url =
    'https://my-list-a7fb0-default-rtdb.europe-west1.firebasedatabase.app/item.json';
  criteria: Icriteria = {
    sortedBy: 'date',
    order: 'ascending',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

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

  setDayLeftItems() {
    for (const item of this.listItems) {
      this.setDayLeftItem(item);
    }
    return this.listItems;
  }

  setDayLeftItem(item: foodObject) {
    this.currentDate = new Date();
    this.compute =
      (+new Date(item.bestBefore) - +this.currentDate) / 1000 / 3600 / 24;

    if (this.compute < 7) {
      item.class = 'priority-1';
    } else if (this.compute <= 10) {
      item.class = 'priority-2';
    }
    item.dayLeft = Math.floor(this.compute);
  }

  sortItems(type: string, order: string) {
    if (type === 'name') {
      this.listItems.sort((item1, item2) => {
        const nameA = item1.name.toLowerCase();
        const nameB = item2.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }
    if (type === 'date') {
      this.listItems.sort(
        (item1, item2) => <number>item1.dayLeft - <number>item2.dayLeft
      );
    }

    if (order === 'descending') {
      this.listItems.reverse();
    }

    this.setUniqueId();
    this.lowerNames();
  }

  setUniqueId() {
    if (this.listItems[0].itemId) return;

    for (let i = 0; i < this.listItems.length; i++) {
      this.listItems[i].itemId = i;
    }
  }

  lowerNames() {
    for (const item of this.listItems) {
      item.name = item.name.toLowerCase();
    }
  }

  getItem(id: number): Observable<foodObject> | any {
    if (this.listItems.length) {
      const item = this.listItems.find((item) => item.itemId === id)!;
      return of(item);
    }

    // accessed thourgh direct url ?
    this.fetchItems().subscribe({
      next: (items: foodObject[]) => {
        this.listItems = items;
        this.setDayLeftItems();
        this.sortItems(this.criteria.sortedBy, this.criteria.order);
        debugger;
        const item = this.listItems.find((item) => item.itemId === id)!;
        return of(item);
      },
    });
  }

  updateItem(id: number, form: NgForm) {
    const item = this.listItems[id];
    item.name = form.form.value.name;
    item.bestBefore = new Date(form.form.value.date);
    this.setDayLeftItem(item);
  }

  deleteItems() {
    return this.http.delete(this.url);
  }
}
