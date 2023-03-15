import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { opacityTransition } from '../shared/animations';
import { PaginationService } from '../shared/pagination-service.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  animations: [opacityTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  onGoTo(page: number | string) {
    if (typeof page === 'string') return;
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
