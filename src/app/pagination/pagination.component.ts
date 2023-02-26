import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { changedAnimation } from '../animations';
import { PaginationService } from '../pagination-service.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  animations: [changedAnimation],
})
export class PaginationComponent implements OnInit, OnChanges {
  pages: (number | string)[] = [];

  @Input() current = 0;
  @Input() total = 0;

  @Output() goTo = new EventEmitter<number>();
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();

  constructor(private pagination: PaginationService) {}

  ngOnInit() {}

  onGoTo(page: number) {
    page = page + 1;

    if (this.pagination.paginationSchema.type === 'symmetrical') {
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

    if (this.pagination.paginationSchema.type === 'startMore') {
      if (page === 2) {
        page = this.total - 5;
      } else if (page > 2) {
        const correctionIndex = this.total - this.pagination.maxPages;
        page += correctionIndex;
      }
    }
    if (this.pagination.paginationSchema.type === 'endMore') {
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
    if (changes['current']?.currentValue || changes['total']?.currentValue) {
      this.pages = this.pagination.getPages(this.current, this.total);
    }
  }
}
