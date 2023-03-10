import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iconsCode, selfPic, title } from '../shared/animations';
import { FoodDataService } from '../shared/food-data-service.service';
import { NotificationsService } from '../shared/notifications-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [iconsCode, selfPic, title],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  imgList = [
    '../../assets/contact-page/Angular.png',
    '../../assets/contact-page/javascript.png',
    '../../assets/contact-page/HTML5.png',
    '../../assets/contact-page/css3.jpg',
    '../../assets/contact-page/NodeJS.png',
  ];
  imgTitle = ['Angular', 'Javascript', 'HTML5', 'CSS3', 'NodeJS'];
  constructor(
    private foodData: FoodDataService,
    private notification: NotificationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // direct URL
    this.route.data.subscribe((data) => {
      if (!data['items']) return;

      this.foodData.setDayLeftItems(this.notification.notificationsDays);
      this.notification.notificationSubject.next(
        this.notification.numberOfNotifications()
      );
    });
  }
}
