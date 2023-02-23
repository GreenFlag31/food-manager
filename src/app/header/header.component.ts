import { Component, Input, OnInit } from '@angular/core';
import { fadeInOut } from '../animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [fadeInOut],
})
export class HeaderComponent implements OnInit {
  @Input() notificationsNumber = 0;

  constructor() {}

  ngOnInit(): void {}
}
