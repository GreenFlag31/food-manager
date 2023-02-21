import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { max } from 'rxjs';
import { changedAnimation } from '../animations';
import type { paginationSchema } from '../IfoodObject';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  animations: [changedAnimation],
})
export class PaginationComponent implements OnInit, OnChanges {
  pages: (number | string)[] = [];
  paginationSchema: paginationSchema = {
    type: 'endMore',
  };
  @Input() current = 0;
  @Input() total = 0;
  maxPages = 7;

  @Output() goTo = new EventEmitter<number>();
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  onGoTo(page: number) {
    page = page + 1;
    // debugger;

    if (this.paginationSchema.type === 'symmetrical') {
      if (page === 6) {
        page = this.current + 2;
      } else if (page > 6) {
        page = this.total;
      } else if (page === 2) {
        page = this.current - 2;
      } else {
        const correctionIndex = this.total - this.current - 3;
        page += correctionIndex;
      }
    }

    if (this.paginationSchema.type === 'startMore') {
      if (page === 2) {
        page = this.total - 5;
      } else if (page > 2) {
        const correctionIndex = this.total - this.maxPages;
        page += correctionIndex;
      }
    }
    if (this.paginationSchema.type === 'endMore') {
      if (page > 6) {
        page = this.total;
      }
    }

    this.goTo.emit(page);
  }
  onNext() {
    this.next.emit(this.current);
  }
  onPrevious() {
    this.previous.next(this.current);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['current'] && changes['current'].currentValue) ||
      (changes['total'] && changes['total'].currentValue)
    ) {
      this.pages = this.getPages(this.current, this.total);
    }
  }

  getPages(current: number, total: number): (number | string)[] {
    if (total <= this.maxPages) {
      return [...Array(total).keys()].map((x) => ++x);
    }

    if (current > 5) {
      if (current >= total - 4) {
        this.paginationSchema.type = 'startMore';
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
      } else {
        this.paginationSchema.type = 'symmetrical';
        return [1, '...', current - 1, current, current + 1, '...', total];
      }
    }

    this.paginationSchema.type = 'endMore';
    return [1, 2, 3, 4, 5, '...', total];
  }
}
