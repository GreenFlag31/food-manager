import { LocationStrategy } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { tipsAnimation } from '../shared/animations';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css'],
  animations: [tipsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipsComponent implements OnInit {
  isOpen = false;
  tipsContent = [
    {
      content: `&nbsp;Use arrows
    <i class="fa-solid fa-arrow-up" style="
    font-size: 0.8em;margin-right: 0.3em;
"></i
    ><i class="fa-solid fa-arrow-down" style="
    font-size: 0.8em;margin-right: 0.3em;
"></i> | TAB | Enter to add a new item easely`,
    },
    {
      content: '',
    },
  ];
  routes = [
    'Getting Started',
    'My List',
    'Contact',
    'Notifications',
    'Log Out',
  ];

  constructor(private ref: ChangeDetectorRef, private url: LocationStrategy) {}

  ngOnInit() {
    this.noTipsForCurrentRoute();

    setTimeout(() => {
      this.isOpen = !this.isOpen;
      this.ref.markForCheck();
    }, 1500);
  }

  noTipsForCurrentRoute() {
    const currentURL = this.url.path();
    if (currentURL.includes('my-list') && !currentURL.includes('item')) {
      this.routes.splice(1, 1);
    } else if (currentURL.includes('notifications')) {
      this.routes.splice(3, 1);
    }
  }

  generateTipsContentAboutNavigation() {
    const randomRouteTips = this.getRandom(this.routes);
    const lastWordRouteTips = this.routes[randomRouteTips].split(' ');
    const upperFirstLetter = lastWordRouteTips.at(-1)![0].toUpperCase();
    const restWord = lastWordRouteTips.at(-1)!.slice(1);

    const endString =
      lastWordRouteTips.length > 1
        ? `${lastWordRouteTips[0]} <span style="font-weight:600">${upperFirstLetter}</span>${restWord}`
        : `<span style="font-weight:600">${upperFirstLetter}</span>${restWord}`;

    return `&nbsp;Use <span style="font-weight:600">Alt + ${upperFirstLetter}</span> to navigate to "${endString}"`;
  }

  getTips() {
    const randomTips = this.getRandom(this.tipsContent) + 0.2 > 1 ? 1 : 0;

    if (randomTips === 1) {
      this.tipsContent[1].content = this.generateTipsContentAboutNavigation();
    }
    return this.tipsContent[randomTips].content;
  }

  getRandom(content: Array<{ content: string }> | Array<string>) {
    return Math.floor(Math.random() * content.length);
  }
}
