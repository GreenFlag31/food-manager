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
      content: `Use arrows
    <i class="fa-solid fa-arrow-up" style="
    font-size: 0.8em;margin-right: 0.3em;
"></i
    ><i class="fa-solid fa-arrow-down" style="
    font-size: 0.8em;margin-right: 0.3em;
"></i> | TAB | Enter to add a new item easely`,
    },
    {
      content: `Find how to reduce food waste <a href="https://www.fao.org/fao-stories/article/en/c/1309609/"
      target="_blank" style="text-decoration:underline; font-weight:700; color: rgb(0 106 187)">here</a>`,
    },
    {
      content: `<span style="font-size:0.9em">Sometimes food is still safe to eat after the “best before” date</span>`,
    },
    {
      content: `<span style="font-size:0.9em">On average, <a href="https://www.europarl.europa.eu/news/en/headlines/society/20170505STO73528/food-waste-the-problem-in-the-eu-in-numbers-infographic#:~:text=Some%2088%20million%20tonnes%20of,also%20contributes%20to%20climate%20change."
        target="_blank" style="text-decoration:underline; font-weight:700; color: rgb(0 106 187)">173 kilos of food per person</a> are wasted per year in EU
      </span>`,
    },
    {
      content: `Find a receipt <a href="https://www.supercook.com/#/desktop"
      target="_blank" style="text-decoration:underline; font-weight:700; color: rgb(0 106 187)">here</a> or <a href="https://recipeland.com/recipes/by_ingredient"
      target="_blank" style="text-decoration:underline; font-weight:700; color: rgb(0 106 187)">here</a> with your items to expire`,
    },
  ];

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.isOpen = !this.isOpen;
      this.ref.markForCheck();
    }, 1500);
  }

  getTips() {
    const randomTips = this.getRandom(this.tipsContent);
    return this.tipsContent[randomTips].content;
  }

  getRandom(content: Array<{ content: string }> | Array<string>) {
    return Math.floor(Math.random() * content.length);
  }
}
