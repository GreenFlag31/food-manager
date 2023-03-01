import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iconsCode, selfPic, title } from '../animations';
import { FoodDataService } from '../shared/food-data-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [iconsCode, selfPic, title],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  notificationsNumber = 0;
  imgList = [
    '../../assets/contact-page/Angular.png',
    '../../assets/contact-page/JS.png',
    '../../assets/contact-page/HTML.png',
    '../../assets/contact-page/CSS.png',
    '../../assets/contact-page/NodeJS.png',
  ];
  constructor(
    private foodData: FoodDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(() => {
      this.foodData.setDayLeftItems(this.foodData.notificationsDays);

      this.notificationsNumber = this.foodData.numberOfNotifications();
    });
  }
}
